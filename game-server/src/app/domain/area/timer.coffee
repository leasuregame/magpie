area = require './area'
Timer = module.exports

Timer.run = ->
	#console.log 'timer is running...'
	setInterval(tick, 1000)

count = 1
tick = ->
	#console.log 'tick', count++
	area.powerConsume()

	area.resetDate()
