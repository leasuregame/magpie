module.exports = 
	connector: (session, msg, app, cb) ->
		if not session
			cb(new Error('fail to reoute to connector server for session is empty'))
			return

		if not session.fontendId
			cb(new Error('fail to find fronend id in session'))
			return

		cb(null, session.fontendId)

	area: (session, msg, app, cb) ->
		areas = app.get 'areaIdMap'
		serverId = areas[session.get('areaId')]

		if not serverId
			cb(new Error('can not find server info for type: ' + msg.serverType))
			return

		cb(null, serverId)


	battle: (session, msg, app, cb) ->
		battles = app.get 'battleIdMap'
		serverId = battles[session.get('areaId')]

		if not serverId
			cb(new Error('can not find server info for type: ' + msg.serverType))
			return

		cb(null, serverId)