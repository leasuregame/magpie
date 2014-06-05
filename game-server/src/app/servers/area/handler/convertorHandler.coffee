playerManager = require('pomelo').app.get('playerManager')
job = require '../../../dao/job'
table = require '../../../manager/table'
configData = require '../../../../config/data'
entityUtil = require '../../../util/entityUtil'
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
      entityUtil.updateEntities ['update', 'player', player], ['update', 'card', card], cb
  ], (err) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    next(null, {
      code: 200
      msg: 
        playerPill: player.pill
        pill: card.pill
        potentialLv: card.potentialLv
        ability: card.ability()
    })

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
  pill = 0
  money = 0
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
      entityUtil.updateEntities ['update', 'player', player], ['delete', 'card', cards], cb
  ], (err) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    player.popCards(cardIds)
    next(null, {code: 200, msg: pill: pill, money: money})

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