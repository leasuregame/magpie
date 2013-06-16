playerManager = require('../../../manager/manager').player

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::createPlayer = (msg, session, next) ->
  name = msg.name
  uid = session.uid
  console.log name, uid, session
  playerManager.fetch uid, (err, player) ->
    if err and not player
      next(null, {code: 501})
      return

    playerManager.create {id: uid, name: name}, (err, player) ->
      if err and not player
        next(null, {code: 500, error: err})
      else
        session.bind(uid)
        session.set('playername', name)
        session.on('close', onUserLeave)

        next(null, {code: 200, player: player})

onUserLeave = (session, reason) ->
  if not session or not session.uid
    return