module.exports = (app) ->
  new Remote(app)

Remote = (@app) ->

Remote::addPlayer = (uid, sid, cb) ->
  channel = @app.get('channelService').getChannel('message', true)
  channel.add(uid, sid)
  