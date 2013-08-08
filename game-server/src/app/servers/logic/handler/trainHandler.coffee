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
job = require '../../../dao/job'
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

  if sources is null or sources.length == 0
    return next(null, {code: 501, msg: '素材卡牌不能为空'})

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      player.strengthen target, sources, cb

    (results, targetCard, cb) ->
      _jobs = [
        {
          type: 'update'
          options: 
            table: 'card'
            where: id: targetCard.id
            data: targetCard.getSaveData()
        }
        {
          type: 'update'
          options: 
            table: 'player'
            where: id: playerId
            data: player.getSaveData()
        }
      ]

      if sources.length > 0 
        _jobs.push {
          type: 'delete'
          options: 
            table: 'card'
            where: " id in (#{sources.toString()}) "
        }

      job.multJobs _jobs, (err, ok) ->
        if err and not ok
          return cb(err)

        cb(null, results)
  ], (err, result) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    next(null, {code: 200, msg: result})

Handler::luckyCard = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  level = msg.level or 1
  type = if msg.type? then msg.type else LOTTERY_BY_GOLD

  typeMapping = {}
  typeMapping[LOTTERY_BY_GOLD] = 'gold'
  typeMapping[LOTTERY_BY_ENERGY] = 'energy'

  player = null
  consumeVal = 0
  fragment = false
  passiveSkills = []
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      [card, consumeVal, fragment, passiveSkills] = lottery(level, type);

      console.log msg, type, player.gold, player.energy, consumeVal
      if player[typeMapping[type]] < consumeVal
        return cb({code: 501, msg: '没有足够的资源来完成本次抽卡'}, null)

      card.playerId = player.id
      dao.card.create data:card, cb

    (card, cb) ->
      if passiveSkills.length is 0
        return cb(null, card)

      async.each passiveSkills,
        (ps, callback) ->
          ps.cardId = card.id
          dao.passiveSkill.create data: ps, (err, res) ->
            return callback(err) if err
            card.addPassiveSkill(res)
            callback()
        (err) ->
          return cb(err) if err

          cb(null, card)
        
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
        return cb({code: 501, msg: '三星级以下的卡牌没有技能，不能升级'})

      if card? and card.skillLv == 5
        return cb({code: 501, msg: '该卡牌的技能等级已经升到最高级，不能再升级了'})

      upgradeData = table.getTableItem('skill_upgrade', card.skillLv + 1)
      sp_need = upgradeData['star'+card.star]

      if player.skillPoint < sp_need
        return cb({code: 501, msg: '技能点不够，不能升级'})  
      
      card.increase('skillLv')
      card.increase('skillPoint', sp_need)
      player.decrease('skillPoint', sp_need);
      cb(null, player, card)
  ], (err, player, card) ->
    if err
      return next(null, {code: err.code, msg: err.msg})

    card.save()
    player.save()
    next(null, {code: 200})

Handler::starUpgrade = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  target = msg.target
  sources = msg.sources
  allInherit = msg.allInherit or false

  card_count = sources.length
  is_upgrade = false
  money_consume = 0
  card = null
  player = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      card = player.getCard(target)
      if card is null
        return cb({code: 501, msg: "找不到卡牌"})
      if card.star < starUpgradeConfig.STAR_MIN
        return cb({code: 501, msg: "卡牌星级必须到达#{starUpgradeConfig.STAR_MIN}级才能进阶"})
      if card.star is 5
        return cb({code: 501, msg: "卡牌星级已经是最高级了"})

      cb(null)

    (cb) ->
      _config = starUpgradeConfig['STAR_'+card.star]
      money_consume = _config.money
      
      if player.money < money_consume
        return cb({code: 501, msg: '铜板不足'})

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
      player.decrease('money', money_consume)
      card.increase('star')

      # 若金币不足，则不能使用金币来继承全部属性
      if allInherit and player.gold >= starUpgradeConfig.ALL_INHERIT_GOLD
        player.decrease('gold', starUpgradeConfig.ALL_INHERIT_GOLD)
        _exp = table.getTableItem('card_grow', card.lv).cur_exp + card.exp
      else
        inherit_info = starUpgradeConfig.DEFAULT_INHERIT
        _exp = parseInt((table.getTableItem('card_grow', card.lv).cur_exp + card.exp) / 2)
        card.set('skillPoint', parseInt(card.get('skillPoint') * inherit_info['skillPoint'] / 100))
        card.set('elixir', parseInt(card.get('elixir') * inherit_info['elixir'] / 100))

      # 重新计算卡牌等级和剩余经验
      card.set('lv', 1)
      [_lv, _exp_remain] = card.vitual_upgrade(_exp)
      card.upgrade(_lv, _exp_remain)

    player.save()
    card.save()
    next(null, {code: 200, msg: {upgrade: is_upgrade, card: card.toJson()}})

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
        return cb({code: 501, msg: '铜板不足，不能洗炼'})

      card = player.getCard(cardId)
      passSkill = card.passiveSkills[psId]

      if card.passiveSkills.length is 0 or not passSkill
        return cb({code: 501, msg: '找不到被动属性'})

      _obj = passSkillConfig.AFRESH[type]
      valueScope = utility.randomValue(_.keys(_obj), _.values(_obj))
      [start, end] = valueScope.split('~')
      value = _.random(start * 100, end * 100)
      passSkill.set('value', parseFloat((value/100).toFixed(1)))

      cb(null, passSkill)
  ], (err, passSkill) ->
    if err
      return next(null, {code: err.code, msg: err.msg})

    passSkill.save()
    next(null, {code: 200, msg: {value: passSkill.value}})

Handler::smeltElixir = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  cardIds = msg.cardIds

  result = []
  sum = 0
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      cards = player.getCards cardIds
      console.log 'cards: ', cards
      if cards.length is 0
        return cb({code: 501, msg: '找不到卡牌'})

      result = cards.map (c) ->
        _points = 0
        if utility.hitRate(elixirConfig.smelt[c.star].rate)
          _points += elixirConfig.smelt[c.star].value

        return _points

      cb(null, player)    

    (player, cb) ->
      sum = result.reduce((x,y) -> x + y) if not _.isEmpty(result)
      player.increase('elixir', sum) if _.isNumber(sum) and sum > 0

      _jobs = [
        {
          type: 'delete'
          options:
            table: 'card'
            where: " id in (#{cardIds.toString()})"
        }
      ]
      console.log 'data: ', player.getSaveData()
      _jobs.push {
        type: 'update'
        options:
          table: 'player'
          where: id: player.id
          data: player.getSaveData()
      } if not _.isEmpty(player.getSaveData())
      
      job.multJobs _jobs, cb
  ], (err, res) ->
    if err and not res
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    next(null, {code: 200, msg: {elixir: result, sum: sum}})

Handler::useElixir = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  elixir = msg.elixir
  cardId = msg.cardId

  playerManager.getPlayerInfo playerId, (err, player) ->
    card = player.getCard(cardId)

    if card is null
      return next(null, {code: 501, msg: '找不到卡牌'})

    if card.star < 3
      return next(null, {code: 501, msg: '不能对3星以下的卡牌使用仙丹'})

    limit = elixirConfig.limit[card.star]
    if card.elixir >= limit
      return next(null, {code: 501, msg: "卡牌仙丹容量已满"})

    if card.elixir + elixir > limit
      return next(null, {code: 501, msg: "使用的仙丹已经超出了卡牌的最大仙丹容量"})

    card.increase('elixir', elixir)
    player.decrease('elixir', elixir)
    card.save()
    player.save()
    next(null, {code: 200})

Handler::changeLineUp = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  lineupObj = msg.lineUp

  playerManager.getPlayerInfo {pid: playerId}, (err, player) ->
    if err
      return next(null, {code: 500, msg: err.msg})

    player.updateLineUp(lineupObj)
    player.save()
    next(null, { code: 200, msg: {lineUp: player.lineUpObj()} })

