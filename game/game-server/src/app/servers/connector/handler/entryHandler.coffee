userDao = require '../../../manager/userDao'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::entry = (msg, session, next) ->
  username = msg.name

  console.log(msg, session)

  # sessionService = this.app.get('sessionService')
  # sessionService.sendMessage(session.id, {route: 'onChart', msg: 'push message.'} )

  next(null, {code: 200, msg: 'game server is ok'})