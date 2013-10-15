playerEvent = require('./playerEvent')
Manager = module.exports

Manager.addEventToPlayer = (app, player) ->
	playerEvent.addEvents(app, player)