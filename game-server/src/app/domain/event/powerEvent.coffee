playerConfig = require('../../../config/data/player')

Event = 
  resumePower: (player) ->
    resumePoint = playerConfig.POWER_RESUME.point
    interval = playerConfig.POWER_RESUME.interval
    player.resumePower(resumePoint)
    player.save()