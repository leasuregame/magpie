playerManager = require('pomelo').app.get('playerManager')
job = require '../../../dao/job'
configData = require '../../../../config/data'
async = require 'async'
_ = require 'underscore'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::usePill = (msg, session, next) ->
  playerId = session.get('playerId')
  cardId = msg.cardId
  pill = msg.pill or 0

  if not cardId or not _.isNumber(cardId) or not _.isNumber(pill)
    return next(null, {code: 501, msg: 'wrong parameter'})

  player = null
  async.waterFall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb
    (res, cb) ->
      player = res
      if player.lv < 50
        return cb({code: 501, msg: '50级开启'})

      card = player.getCard(cardId)
      if not card
        return cb({code: 501, msg: 'can find card'})

      if card.star < 4
        return cb({code: 501, msg: 'can use pill on card that star blow 4'})

      card.increase 'pill', pill
      player.decrease 'pill', pill
      updateEntities ['update', player, card], cb
  ], (err) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    next(null, {code: 200, msg: ability: card.ability()})

updateEntities = (groups..., cb) ->
  jobs = []
  for group in groups
    if _.isArray(group) and group.length >= 2
      type = group[0]
      entities = group.slice(1)
      entities.forEach (ent) -> 
        action = type: type

        switch action
          when 'update' 
            data = ent.getSaveData()
            action.options = {
              where: id: ent.id
              data: data
            } if _.isEmpty(data)
          when 'delete'
            if _.isArray(ent)
              action.options.where = " id in (#{(ent.map (e) -> e.id).toString()}) "
            else
              action.options.where = id: ent.id
          when 'insert'
            action.options.data = ent
          else
            action.options = {}

        jobs.push action

  job.multJobs jobs, cb


Handler::dissolveCard = (msg, session, next) ->
  playerId = session.get('playerId')
  cardIds = msg.cardIds

  if not _.isArray(cardIds) or not _.isNumber(cardIds)
    return next(null, {code: 501, msg: 'wrong parameter'})

  cardIds = [cardIds] if _.isNumber(cardIds)
  player = null
  oldPill = 0
  async.waterFall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb
    (res, cb) ->
      player = res

      if player.lv < 20
        return cb({code: 501, msg: '20级开启'})

      cards = player.getCards cardIds
      if cards.length is 0
        return cb code: 501, msg: 'can not find card'

      if not canDissoleve(cards)
        return cb code: 501, msg: 'can not dissolve exp card or 6/7 star card'

      pill = doDissolveCard(cards)
      oldPill = player.pill
      player.increase('pill', pill)
      updateData(player, cards, cb)
  ], (err) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    next(null, {code: 200, msg: pill: player.pill})

canDissoleve = (cards) ->
  cards.filter (c) ->
    c.tableId is 3000 or c.star in [6,7]
  .length is 0

doDissolveCard = (cards) ->
  pill = 0
  rate_type = configData.card.CARD_DISSOLVE_CRIT_TYPE
  pill_map = configData.card.CARD_TO_PILL_MAP

  for card in cards
    if utility.hitRate configData.card.CARD_DISSOLVE_CRIT_RATE
      grow_rate = utility.randomValue _.values(rate_type), _.keys(rate_type)
      pill += parseInt (pill_map[card.star] or 0) * (100 + grow_rate) / 100
  pill

updateData = (player, cards, cb) ->
  jobs = []
  playerData = player.getSaveData()
  jobs.push {
    type: 'update'
    options: 
      table: 'player'
      where: id: player.id
      data: playerData
  } if not _.isEmpty(playerData)

  jobs.push {
    type: 'delete'
    options: 
      table: 'card'
      where: " id in (#{(cards.map (c) -> c.id).toString()}) "
  } if _.isArray(cards) and cards.length > 0

  job.multJobs jobs, cb