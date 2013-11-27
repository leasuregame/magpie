module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::serverTime = (msg, session, next) ->
	next(null, {code: 200, msg: Date.now()})