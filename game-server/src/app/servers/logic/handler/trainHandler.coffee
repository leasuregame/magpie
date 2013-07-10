playerManager = require '../../../manager/playerManager'
cardManager = require '../../../manager/cardManager'
lottery = require '../../../manager/lottery'
async = require 'async'
dao = require('pomelo').app.get('dao')
table = require '../../../manager/table'
passSkillConfig = require '../../../../config/data/passSkill'
utility = require '../../../common/utility'
_ = require 'underscore'

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
  type = msg.type or 'gold'

  player = null
  card = {}
  consumeVal = 0
  fragment = false
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      [card, consumeVal, fragment] = lottery(level, type);

      card.playerId = player.id
      dao.card.createCard card, cb

    (cardEnt, cb) ->
      player.addCard(card);
      if type is 'gold'
        player.decrease('gold', consumeVal)

      if type is 'friendship'
        player.decrease('friendPoint', consumeVal)

      if fragment
        player.increase('fragments')

      cb(null, player)
  ], (err, player) ->
    if err
      return next(null, {code: 500, msg: 'card upgrade faild'})

    player.save()
    next(null, {code: 200, card: card, consume: consumeVal, hasFragment: fragment})

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
      if card? and card.star < 3
        return cb({code: 501, msg: '三星级以下的卡牌没有技能，不能升级'}, null)

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
    next(null, {code: 200, value: passSkill.value})


    
