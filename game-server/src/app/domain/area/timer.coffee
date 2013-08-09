Timer = module.exports

Time.run = ->
	setInterval(tick, 1000)

tick = ->
	