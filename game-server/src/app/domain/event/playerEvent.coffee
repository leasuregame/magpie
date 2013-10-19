playerConfig = require('../../../config/data/player')
table = require('../../manager/table')
utility = require '../../common/utility'
_ = require 'underscore'

exports.addEvents = (app, player) ->

  player.on 'add.card', (card) ->
    if card.isNewLightUp
      card.isNewLightUp = false
      app.get('messageService').pushByPid player.id, {
        route: 'onLightUpCard'
        msg: tableId: card.tableId
      }, () ->

  player.on 'exp.change', ->
    if player.isUpgrade
      player.isUpgrade = false
      data = table.getTableItem('player_upgrade', player.lv - 1)
      app.get('messageService').pushByPid player.id, {
        route: 'onPlayerUpgrade'
        msg: {
          money: data.money,
          energy: data.energy,
          skillPoint: data.skillPoint,
          elixir: data.elixir 
        }
      }, () ->

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
