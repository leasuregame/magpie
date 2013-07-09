playerManager = require '../../../manager/playerManager'
lottery = require '../../../manager/lottery'
dao = require('pomelo').app.get('dao')

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
        cb(null, {exp_obtain: 0, upgraded_level: 0, money_obtain: 0})

  ], (err, result) ->
    if err
      return next(null, {code: 500, msg: err.msg})

    player?.save()
    next(null, {code: 200, msg: result})

Handler::luckyCard = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  level = msg.level
  type = msg.type

  player = null
  card = {}
  consumeVal = 0
  fragment = false
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      [card, consumeVal, fragment] = lottery.lottery(level, type);

      card.playerId = player.id
      dao.card.createCard card, cb

    (cardEnt, cb) ->
      player.addCard(card);
      if type is 'gold'
        player.decrease('gold', consumeVal)

      if type is 'friendship'
        player.decrease('friendship', consumeVal)

      if fragment
        player.increase('fragments')

      cb(null, player)
  ], (err, player) ->
    if err
      return next(null, {code: 500, msg: 'card upgrade faild'})

    player.save()
    next(null, {code: 200, card: card, consume: consumeVal, hasFragment: fragment})

    
