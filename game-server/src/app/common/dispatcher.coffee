#crc = require('crc')

module.exports.dispatch = (uid, connectors) ->
	index = Number(uid) % connectors.length
	connectors[index]
