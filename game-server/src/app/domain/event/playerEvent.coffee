playerConfig = require('../../../config/data/player')
msgConfig = require '../../../config/data/message'
table = require('../../manager/table')
utility = require '../../common/utility'
_ = require 'underscore'

SYSTEM = -1

exports.addEvents = (app, player) ->

  player.on 'add.card', (card) ->
    if card.isNewLightUp
      card.isNewLightUp = false
      app.get('messageService').pushByPid player.id, {
        route: 'onLightUpCard'
        msg: tableId: card.tableId
      }, () ->

  player.on 'power.resume', ->
    ply = player
    interval = playerConfig.POWER_RESUME.interval
    power = ply.power
    now = Date.now()
    times = 1

    if (power.time + interval) <= now
      times = parseInt (now - power.time)/interval
      resumePoint = playerConfig.POWER_RESUME.point
      ply.resumePower(resumePoint * times)
      ply.save()

  player.on 'lineUp.change', ->
    player.updateAbility()
    player.activeSpiritorEffect()
    player.save()

  player.on 'data.reset', ->
    now = new Date();
    year = now.getFullYear()
    month = now.getMonth()
    day = now.getDate()
    start = new Date(year, month, day)
    end = new Date(year, month, day, 0, 10, 0)
    
    if start <= now <= end and not player.isReset()
      player.resetData()
      player.save()

  player.emit('lineUp.change')

  return
