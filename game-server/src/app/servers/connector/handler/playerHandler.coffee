dao = require('pomelo').app.get('dao')

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::createPlayer = (msg, session, next) ->
  name = msg.name
  areaId = msg.areaId
  uid = session.uid
  
  dao.player.getPlayerByName name, (err, player) ->
    if player
      next(null, {code: 501})
      return

    dao.player.createPlayer {userId: uid, name: name, areaId: areaId}, (err, player) ->
      if err and not player
        next(null, {code: 500, error: err})
      else
        session.bind(uid)
        session.set('playerId', player.id)
        session.set('playername', player.name)
        session.on('close', onUserLeave)

        next(null, {code: 200, player: player})

onUserLeave = (session, reason) ->
  if not session or not session.uid
    return