playerManager = require '../../../manager/playerManager'

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
  type = msg.type

  functions = 
    ''