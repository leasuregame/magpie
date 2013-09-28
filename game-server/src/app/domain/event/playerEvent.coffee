playerConfig = require('../../../config/data/player')
_ = require 'underscore'

exports.addEvents = (player) ->
  player.on 'power.resume', ->
    ply = player
    interval = playerConfig.POWER_RESUME.interval
    power = ply.power
    now = Date.now()

    if (power.time + interval) <= now
      times = parseInt (now - power.time)/interval
      resumePoint = playerConfig.POWER_RESUME.point
      ply.resumePower(resumePoint * times)
      ply.save()

  player.on 'power.give', ->
    givePoint = playerConfig.POWER_GIVE.point
    hours = playerConfig.POWER_GIVE.hours
    interval = playerConfig.POWER_GIVE.interval
    cur_hour = (new Date()).getHours()

    if _.contains(hours, cur_hour) and not _.contains(player.dailyGift.powerGiven, cur_hour)
      player.givePower(cur_hour, givePoint)
      player.save()

  player.on 'lineUp.change', ->
    player.updateAbility()
    #player.activeGroupEffect()
    player.activeSpiritorEffect()
    player.save()  

  player.emit('lineUp.change')

  return