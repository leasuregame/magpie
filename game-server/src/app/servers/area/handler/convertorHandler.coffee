playerManager = require('pomelo').app.get('playerManager')
job = require '../../../dao/job'
table = require '../../../manager/table'
configData = require '../../../../config/data'
async = require 'async'
_ = require 'underscore'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

### 
  卡牌吞噬轮回丹
###
Handler::usePill = (msg, session, next) ->
  playerId = session.get('playerId')
  cardId = msg.cardId

  if not cardId or not _.isNumber(cardId)
    return next(null, {code: 501, msg: '参数错误'})

  player = null
  card = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb
    (res, cb) ->
      player = res
      if player.lv < 50
        return cb({code: 501, msg: '50级开启'})

      card = player.getCard(cardId)
      if not card
        return cb({code: 501, msg: '找不到卡牌'})

      if card.star < 4
        return cb({code: 501, msg: '4星以下卡牌不能吞噬轮回丹'})

      if not card.canUsePill()
        return cb({code: 501, msg: '卡牌潜能级别已达最高'})

      reward = table.getTableItem('card_pill_use', card.potentialLv+1)
      if not reward
        return cb({code: 501, msg: '找不到配置信息'})

      if player.pill < reward.pill
        return cb({code: 501, msg: '轮回丹不足'})

      card.increase 'pill', reward.pill
      player.decrease 'pill', reward.pill
      updateEntities ['update', 'player', player], ['update', 'card', card], cb
  ], (err) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    next(null, {code: 200, msg: pill: player.pill, ability: card.ability()})

###
  卡牌熔炼
###
Handler::dissolveCard = (msg, session, next) ->
  playerId = session.get('playerId')
  cardIds = msg.cardIds

  cardIds = [cardIds] if _.isNumber(cardIds)
  if not _.isArray(cardIds)
    return next(null, {code: 501, msg: '参数错误'})
  
  player = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb
    (res, cb) ->
      player = res
      if player.lv < 20
        return cb({code: 501, msg: '20级开启'})

      cards = player.getCards cardIds
      if cards.length is 0
        return cb code: 501, msg: '找不到卡牌'

      if not canDissoleve(cards)
        return cb code: 501, msg: '经验卡不能熔炼'

      [pill, money] = doDissolveCard(cards)
      player.increase('pill', pill)
      player.increase('money', money)
      updateEntities ['update', 'player', player], ['delete', 'card', cards], cb
  ], (err) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    next(null, {code: 200, msg: pill: player.pill, money: player.money})

updateEntities = (groups..., cb) ->
  jobs = []
  groups.forEach (group) ->
    if _.isArray(group) and group.length >= 2
      type = group[0]
      tableName = group[1]
      entities = group.slice(2)
      entities.forEach (ent) -> 
        action = type: type, options: {table: tableName}

        switch type
          when 'update' 
            data = ent.getSaveData()
            if not _.isEmpty(data)
              action.options.where = id: ent.id
              action.options.data = data
          when 'delete'
            if _.isArray(ent) and ent.length > 0
              ids = ent.map (e) -> e.id or e
              action.options.where = " id in (#{ids.toString()}) "
            else if _.has(ent, 'id')
              action.options.where = id: ent.id
            else if _.isString(ent)
              action.options.where = ent
            else
              action.options.where = ''
          when 'insert'
            action.options.data = ent
          else
            action.options = {}

        jobs.push action

  console.log '-jobs-', JSON.stringify(jobs)
  job.multJobs jobs, cb

canDissoleve = (cards) ->
  cards.filter (c) ->
    c.tableId is 30000
  .length is 0

doDissolveCard = (cards) ->
  pill = 0
  money = 0
  pill_tab = table.getTable('card_pill_dissolve')

  for card in cards
    pill += pill_tab.getItem(card.star)?.pill or 0
    money += pill_tab.getItem(card.star)?.money or 0
  [pill, money]

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