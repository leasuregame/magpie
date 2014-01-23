dispatcher = require '../../../common/dispatcher'
areasInfo = require '../../../../config/area'
async = require 'async'
_ = require 'underscore'
fs = require 'fs'
path = require 'path'

status = ['NEW', 'NORMAL', 'BUSY', 'MAINTENANCE']
SERVER_STATUS = 
	NEW: 10
	NORMAL: 20
	BUSY: 30
	MAINTENANCE: 40

watchAreasInfo = ->
	filepath = path.join(__dirname, '..', '..', '..', '..', 'config', 'area.json')
	fs.watchFile filepath, (curr, prev) -> 
		areasInfo = JSON.parse fs.readFileSync(filepath)
watchAreasInfo()

module.exports = (app) ->
	new Handler(app)

Handler = (@app) ->

Handler::queryEntry = (msg, session, next) ->
	connectors = @app.getServersByType 'connector'
	if not connectors or connectors.length is 0
		return next {code: 500, msg: '没有可用的服务器'}

	# async.parallel [
	# 	(cb) => 
	# 		@app.get('serverStateService').areaPlayerCount cb
	# 	(cb) =>
	# 		@app.get('serverStateService').connectCount cb
	# ], (err, results) ->
	# 	if err
	# 		logger.error('get servers state faild. ', err)
	# 	areas = results[0]
	# 	conns = results[1]

	connector = dispatcher.randomDispatch(connectors)
	next null, {
		code: 200, 
		msg: {
			host: connector.host, 
			port: connector.clientPort,
			servers: areasInfo
		}
	}

randomStatus = ->
	SERVER_STATUS[status[_.random(0, status.length-1)]]