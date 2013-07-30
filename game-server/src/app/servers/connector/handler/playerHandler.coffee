dao = require('pomelo').app.get('dao')
Player = require('../../../domain/player')

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::createPlayer = (msg, session, next) ->
  name = msg.name
  areaId = msg.areaId
  uid = session.uid

  dao.player.fetchOne where: {name: name}, (err, player) ->
    if not err and player instanceof Player
      return next(null, {code: 501, msg: "player exists."})
    
    dao.player.create data: {userId: uid, name: name, areaId: areaId}, (err, player) ->
      if err and not player
        next(null, {code: 500, error: err})
      else
        session.bind(uid)
        session.set('playerId', player.id)
        session.set('playername', player.name)
        session.on('close', onUserLeave)

        next(null, {code: 200, msg: {player: player.toJson()}})

onUserLeave = (session, reason) ->
  if not session or not session.uid
    return