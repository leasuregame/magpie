dao = require('pomelo').app.get('dao')
playerManager = require('pomelo').app.get('playerManager')
table = require '../../../manager/table'
utility = require '../../../common/utility'
logger = require('pomelo-logger').getLogger(__filename)
async = require 'async'
_ = require 'underscore'

MAX_CARD_COUNT = table.getTableItem('resource_limit', 1).card_count_limit

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::buyVip = (msg, session, next) ->
  playerId = session.get('playerId')
  id = msg.id

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    data = table.getTableItem('recharge', id)
    player.increase('cash', data.cash)
    player.increase('gold', (data.cash * 10) + data.gold)
    player.save()
    next(null, {code: 200, msg: {
      vip: player.vip
    }})

Handler::buyVipBox = (msg, session, next) ->
  playerId = session.get('playerId')
  boxId = msg.boxId

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    boxInfo = table.getTableItem('vip_box', boxId)
    if not boxInfo
      return next(null, {code: 501, msg: '找不到礼包信息'})

    if boxInfo.id > player.vip
      return next(null, {code: 501, msg: '你还不是VIP'+boxId+', 不能购买VIP' + boxId + '礼包'})

    if _.contains player.vipBox, boxInfo.id
      return next(null, {code: 501, msg: '不能重复购买'})

    if player.gold < boxInfo.price
      return next(null, {code: 501, msg: '魔石不足'})

    checkResourceLimit player, boxInfo, (ok, msg) ->
      if not ok
        return next(null, {code: 501, msg: msg})

      openVipBox(player, boxInfo, next)

checkResourceLimit = (player, boxInfo, cb) ->
  resLimit = table.getTableItem('resource_limit', 1)
  maxValue = (keys) ->
    key for key in keys when player[key] >= resLimit[key]

  results = maxValue ['energy', 'money', 'skillPoint', 'elixir']
  if _.keys(player.cards).length >= resLimit.card_count_limit
    results.push 'card'
    
  if results.length > 0
    cb(false, genMsg(results))
  else 
    cb(true)

genMsg = (keys) ->
  chiness = 
    'energy': '活力值'
    'money': '仙币'
    'skillPoint': '技能点'
    'elixir': '仙丹'
    'card': '卡牌数量'

  text = ''
  text += chiness[key] + '，' for key in keys

  return text[0...-1] + '已经达到上限，不能购买'

openVipBox = (player, boxInfo, next) ->
  setIfExist = (attrs) ->
    player.increase att, val for att, val of boxInfo when att in attrs
    return

  setIfExist ['energy', 'money', 'skillPoint', 'elixir', 'fragments']

  vb = _.clone(player.vipBox)
  vb.push boxInfo.id
  player.vipBox = vb
  player.save()
  
  if _.has boxInfo, 'exp_card'
    playerManager.addExpCardFor player, boxInfo.exp_card, (err, cards) ->
      return next(null, {code: err.code or 500, msg: err.msg or err}) if err

      next(null, {code: 200, msg: {card: cards[0], cardIds: cards.map (c) -> c.id}})
  else
    next(null, {code: 200, msg: {card: {}, cardIds: []}})

