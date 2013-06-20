module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::send = (msg, session, next) ->
  content = msg.content

  channel = @app.get('channelService').getChannel('message', false)
  channel.pushMessage({route: 'onMessage', msg: content})
  next(null, {code: 200, msg: content})