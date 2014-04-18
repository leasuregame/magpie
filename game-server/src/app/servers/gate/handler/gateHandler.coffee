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
	os = msg.os or 'IOS'
	platform = msg.platform or 'TB'
	version = msg.version

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
			servers: filterServers(areasInfo, os, platform, version)
		}
	}

randomStatus = ->
	SERVER_STATUS[status[_.random(0, status.length-1)]]

filterServers = (areas, os, platform, version) ->
	if os is 'ALL' and platform is 'ALL'
		items = areas
	else
		items = areas.filter (area) -> os in area.os and platform in area.platform
	
	if version
		versionSpecifyItems = items.filter (i) -> version in i.version
		if versionSpecifyItems.length > 0
			items = versionSpecifyItems

	items.sort (x, y) -> parseInt(x.id) - parseInt(y.id)
	items.map (el, idx) -> 
		id: el.id
		name: el.name
		index: idx+1
		status: el.status

