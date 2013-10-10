playerConfig = require('../../../config/data/player')
utility = require '../../common/utility'
_ = require 'underscore'

exports.addEvents = (app, player) ->
  player.on 'add.card', (card) ->
    if not player.cardBookMark.hasMark(card.tableId)
      lightUpACard(app, player, card.tableId)

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

lightUpACard = (app, player, tableId) ->
  player.cardBookMark.mark(tableId)
  cardBook = utility.deepCopy(player.cardBook)
  cardBook.mark = player.cardBookMark.value
  player.cardBook = cardBook
  player.save()

  app.get('messageService').pushByPid player.id, {
    route: 'onLightUpCard'
    msg: tableId: tableId
  }, () ->