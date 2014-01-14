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
		# session is the first arg of the rpc call
		areas = app.get 'areaIdMap'
		
		serverId = areas[session.get('areaId')]

		if not serverId
			console.log('=a=a=', session.get('areaId'), '>>>>>>>',  msg)
			cb(new Error('can not find server info for type: ' + msg.serverType, 'areaId:', session.get('areaId')))
			return

		cb(null, serverId)