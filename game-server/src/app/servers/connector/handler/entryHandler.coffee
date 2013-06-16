userDao = require '../../../manager/userDao'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::entry = (msg, session, next) ->
  # username = msg.name
  # uid = msg.uid
  # session.bind(uid, ()->)
  # session.set('name', username)

  # console.log(msg, session.id)

  #sessionService = this.app.get('sessionService')
  
  #console.log sessionService
  #sessionService.sendMessage(session.id, {route: 'onChart', msg: 'push message.'} )

  next(null, {code: 200, msg: 'game server is ok'})

Handler::push = (msg, session, next) ->
  ss = @app.get 'sessionService'
  ss.sendMessageByUid(session.uid, {route: 'onChart', msg: 'chart message'})

  next(null, {code: 200})