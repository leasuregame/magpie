#crc = require('crc')
_ = require 'underscore'

module.exports.dispatch = (uid, connectors) ->
	index = Number(uid) % connectors.length
	connectors[index]

module.exports.randomDispatch = (connectors) ->
	index = _.random(0, connectors.length-1)
	connectors[index]