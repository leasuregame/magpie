userDao = require '../../../manager/userDao'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::entry = (msg, session, next) ->
  uid = msg.uid
  session.bind(uid)
  session.set('playerId', uid)

  next(null, {code: 200, msg: 'game server is ok'})
