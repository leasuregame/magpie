playerConfig = require('../../../config/data/player')
_ = require 'underscore'

exports.addEvents = (player) ->
  player.on 'power.consume', ->
    ply = player
    interval = playerConfig.POWER_RESUME.interval
    power = ply.power

    if (power.time + interval) <= Date.now()
      times = parseInt (now - power.time)/interval
      resumePoint = playerConfig.POWER_RESUME.point
      ply.resumePower(resumePoint * times)
      ply.save()

  player.on 'power.give', ->
    givePoint = playerConfig.POWER_GIVE.point
    hours = playerConfig.POWER_GIVE.hours
    interval = playerConfig.POWER_GIVE.interval
    cur_hour = (new Date()).getHours()

    if _.contains(hours, hour) and not player.hasGive(hour)
      player.givePower(hour, givePoint)
      player.save()

  player.on 'lineUp.change', ->
    player.updateAbility()
    player.activeGroupEffect()
    player.save()

  return