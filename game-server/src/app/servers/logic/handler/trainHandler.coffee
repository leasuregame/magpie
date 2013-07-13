playerManager = require '../../../manager/playerManager'
cardManager = require '../../../manager/cardManager'
lottery = require '../../../manager/lottery'
async = require 'async'
dao = require('pomelo').app.get('dao')
table = require '../../../manager/table'
passSkillConfig = require '../../../../config/data/passSkill'
elixirConfig = require '../../../../config/data/elixir'
starUpgradeConfig = require '../../../../config/data/starUpgrade'
utility = require '../../../common/utility'
_ = require 'underscore'

LOTTERY_BY_GOLD = 1
LOTTERY_BY_ENERGY = 0

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

###
强化
###
Handler::strengthen = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  sources = msg.sources
  target = msg.target
  player = null;

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (_player, cb) ->
      player = _player
      cardManager.deleteCards sources, cb  

    (cardsDeleted, cb) ->
      if cardsDeleted
        player.strengthen(target, sources, cb)
      else
        cb(null, {exp_obtain: 0, upgraded_level: 0, money_consume: 0})

  ], (err, result) ->
    if err
      return next(null, {code: 500, msg: err.msg})

    player?.save()
    next(null, {code: 200, msg: result})

Handler::luckyCard = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  level = msg.level or 1
  type = msg.type or 1

  typeMapping = {}
  typeMapping[LOTTERY_BY_GOLD] = 'gold'
  typeMapping[LOTTERY_BY_ENERGY] = 'energy'

  player = null
  consumeVal = 0
  fragment = false
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      [card, consumeVal, fragment] = lottery(level, type);

      if player[typeMapping[type]] < consumeVal
        return cb({code: 501, msg: '没有足够的资源来完成本次抽卡'}, null)

      card.playerId = player.id
      dao.card.createCard card, cb

    (cardEnt, cb) ->
      player.addCard(cardEnt);
      if type is LOTTERY_BY_GOLD
        player.decrease('gold', consumeVal)

      if type is LOTTERY_BY_ENERGY
        player.decrease('energy', consumeVal)

      if fragment
        player.increase('fragments')

      cb(null, cardEnt, player)
  ], (err, cardEnt, player) ->
    if err
      return next(null, {code: err.code, msg: err.msg})

    player.save()
    next(null, {
      code: 200, 
      msg: {card: cardEnt.toJson(), consume: consumeVal, hasFragment: fragment}
      })

Handler::skillUpgrade = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  cardId = msg.cardId

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      card = player.getCard(cardId)
      cb(null, player, card)

    (player, card, cb) ->
      if not card
        return cb({code: 501, msg: '找不到卡牌'})

      if card? and card.star < 3
        return cb({code: 501, msg: '三星级以下的卡牌没有技能，不能升级'}, null)

      if card? and card.skillLv > 5
        return cb({code: 501, msg: '该卡牌的技能等级已经升到最高级，不能再升级了'})

      console.log 'skill upgrade: ', 'skillLv: ', card.skillLv, card
      upgradeData = table.getTableItem('skill_upgrade', card.skillLv)
      sp_need = upgradeData['star'+card.star];

      if player.skillPoint < sp_need
        return cb({code: 501, msg: '技能点不够，不能升级'}, card)  
      
      card.increase('skillLv')
      cb(null, card)
  ], (err, card) ->
    if err
      return next(null, {code: err.code, msg: err.msg})

    card.save()
    next(null, {code: 200})

Handler::starUpgrade = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  target = msg.target
  sources = msg.sources
  gold = msg.gold or 0
  allInherit = msg.allInherit or false

  card_count = sources.length
  is_upgrade = false
  card = null
  player = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      card = player.getCard(target)
      if card.star < starUpgradeConfig.STAR_MIN
        return cb({code: 501, msg: "卡牌星级必须到达#{starUpgradeConfig.STAR_MIN}级才能进阶"})
      cb(null)

    (cb) ->
      _config = starUpgradeConfig['STAR_'+card.star]
      if gold > 0 and gold < player.gold
        card_count += parseInt(gold/_config.gold_per_card)
        
      if card_count > _config.max_num
        return cb({code: 501, msg: "最多只能消耗#{_config.max_num}张卡牌来进行升级"})

      totalRate = _.min([card_count * _config.rate_per_card, 100])
      if utility.hitRate(totalRate)
        is_upgrade = true

      cardManager.deleteCards sources, cb
  ], (err, result) ->
    if err
      return next(null, {code: err.code, msg: err.msg})

    if is_upgrade and result
      player.decrease('gold', gold)
      card.increase('star')
      if allInherit
        player.decrease('gold', starUpgradeConfig.ALL_INHERIT_GOLD)
      else
        inherit_info = starUpgradeConfig.DEFAULT_INHERIT
        card.set('exp', parseInt(card.get('exp') * inherit_info['exp'] / 100))
        card.set('skillPoint', parseInt(card.get('skillPoint') * inherit_info['skillPoint'] / 100))
        card.set('elixir', parseInt(card.get('elixir') * inherit_info['elixir'] / 100))

    player.save()
    card.save()
    next(null, {code: 200, msg: {upgrade: is_upgrade}})

Handler::passSkillAfresh  = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  cardId = msg.cardId
  psId = msg.psId
  type = msg.type or 'money'

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (player, cb) ->
      money_need = passSkillConfig.CONSUME[type]

      if player[type] < money_need
        return cb({code: 501, msg: '资源不足，不能洗炼'})

      card = player.getCard(cardId)
      passSkill = card.passiveSkills[psId]

      if not passSkill
        return cb({code: 501, msg: '找不到被动属性'})

      _obj = passSkillConfig.AFRESH[type]
      valueScope = utility.randomValue(_.keys(_obj), _.values(_obj))
      [start, end] = valueScope.split('~')
      value = _.random(start * 100, end * 100)
      passSkill.set('value', (value/100).toFixed(1))

      cb(null, passSkill)
  ], (err, passSkill) ->
    if err
      return next(null, {code: err.code, msg: err.msg})

    passSkill.save()
    next(null, {code: 200, msg: {value: passSkill.value}})

Handler::smeltElixir = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  cardIds = msg.cardIds

  result = 0
  async.waterfall [
    (cb) ->
      cardManager.getCards cardIds, cb

    (cards, cb) ->
      result = cards.map (c) ->
        _points = 0
        if utility.hitRate(elixirConfig.smelt[c.star].rate)
          _points += elixirConfig.smelt[c.star].value

        return _points

      cb(null)

    (cb) ->
      cardManager.deleteCards cardIds, cb

    (results, cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb
  ], (err, player) ->
    if err
      return next(null, {code: 501, msg: err.msg})

    sum = result.reduce (x,y) -> x + y
    player.increase('elixir', sum) if sum > 0
    player.save()
    next(null, {code: 200, msg: {elixir: result, sum: sum}})

Handler::useElixir = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  elixir = msg.elixir
  cardId = msg.cardId

  cardManager.getCardInfo cardId, (err, card) ->
    if card.star < 3
      return next(null, {code: 501, msg: 'can not use elixir on star 2 card'})

    limit = elixirConfig.limit[card.star]
    if card.elixir + elixir > limit
      return next(null, {code: 501, msg: "card's elixir has be the max"})

    card.increase('elixir', elixir)
    card.save()
    next(null, {code: 200})

  

