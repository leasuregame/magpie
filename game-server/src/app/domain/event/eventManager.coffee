playerEvent = require('./playerEvent')
Manager = module.exports

Manager.addEventToPlayer = (player) ->
	playerEvent.addEvents(player)