dispatcher = require '../../../common/dispatcher'
areasInfo = require '../../../../config/area'

module.exports = (app) ->
	new Handler(app)

Handler = (@app) ->

Handler::queryEntry = (msg, session, next) ->
	# uid = msg.uid 

	# if not uid
	# 	return next {code: 500}

	connectors = @app.getServersByType 'connector'
	if not connectors or connectors.length is 0
		return next {code: 500, msg: 'no servers available'}

	conn = dispatcher.randomDispatch(connectors)
	next null, {code: 200, host: conn.host, port: conn.clientPort}

Handler::serverList = (msg, session, next) ->
	next null, {code: 200, servers: areasInfo}