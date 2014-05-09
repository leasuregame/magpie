dao = require('pomelo').app.get('dao')
playerManager = require('pomelo').app.get('playerManager')
table = require '../../../manager/table'
utility = require '../../../common/utility'
entityUtil = require '../../../util/entityUtil'
logger = require('pomelo-logger').getLogger(__filename)
async = require 'async' 
_ = require 'underscore'

GOLDCARDMAP = 
  'com.leasuregame.magpie.week.card': 'week'
  'com.leasuregame.magpie.month.card': 'month'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::dailyReward = (msg, session, next) ->
  playerId = session.get('playerId')

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    if player.vip <= 0
      return next(null, {code: 501, msg: '成为VIP,方可领取'})

    if !!player.dailyGift.vipReward
      return next(null, {code: 501, msg: '不能重复领取'})

    reward = table.getTableItem('vip_daily_reward', player.vip)
    if not reward
      return next(null, {code: 501, msg: '找不到该奖励'})

    player.increase('money', reward.money)
    player.increase('elixir', reward.elixir)
    player.increase('energy', reward.energy)
    player.updateGift('vipReward', 1)
    player.save()
    playerManager.addExpCardFor player, reward.exp_card, (err, cards) ->
      if err
        next(null, {code: 501, msg: '经验卡领取出错'})
      else
        next(null, {code: 200, msg: card: cards[0], cardIds: cards.map (c) -> c.id})

Handler::buyPlan = (msg, session, next) ->
  playerId = session.get('playerId')

  playerManager.getPlayerInfo {pid: playerId}, (err, player) ->
    if err
      return next(null, {
        code: err.code or 501
        msg: err.msg or err
        }
      )

    if player.hasBuyPlan()
      return next(null, {code: 501, msg: '不能重复购买'})

    if player.gold < 1000
      return next(null, {code: 501, msg: '魔石不足，请充值'})

    player.buyPlan()
    player.decrease('gold', 1000)
    player.save()
    next(null, {code: 200, msg: gold: player.gold, plan: player.plan})

Handler::getPlanReward = (msg, session, next) -> 
  playerId = session.get('playerId')
  id = parseInt msg.id

  if isNaN(id)
    return next(null, {code: 501, msg: '参数错误'})

  playerManager.getPlayerInfo {pid: playerId}, (err, player) ->
    if err
      return next(null, {
        code: err.code or 501
        msg: err.msg or err
        }
      )

    if not player.hasBuyPlan()
      return next(null, {code: 501, msg: '请购买成长计划,方可领取'})

    if player.hasPlanFlag(id)
      return next(null, {code: 501, msg: '不能重复领取'})

    reward = table.getTableItem('growth_plan', id)
    if not reward
      return next(null, {code: 501, msg: '找不到该奖励'})

    if player.lv < reward.lv
      return next(null, {code: 501, msg: '等级不够,不能领取'})

    player.increase('gold', reward.gold)
    player.setPlanFlag(id)
    player.save()
    next(null, {code: 200, msg: gold: player.gold})

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

Handler::firstRechargeBox = (msg, session, next) ->
  playerId = session.get('playerId')

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    if player.cash <= 0
      return next(null, {code: 501, msg: '无权限领取该礼包'})

    boxInfo = table.getTableItem('first_recharge_box', 1)
    if not boxInfo
      return next(null, {code: 501, msg: '找不到该礼包信息'})

    if player.firstTime.frb is 0
      return next(null, {code: 501, msg: '已领取'})

    openFirstRechargeBox player, boxInfo, next


checkResourceLimit = (player, boxInfo, cb) ->
  resLimit = table.getTableItem('resource_limit', 1)
  maxValue = (keys) ->
    key for key in keys when player[key] >= resLimit[key]

  results = maxValue ['energy', 'money', 'skillPoint', 'elixir']
  if _.keys(player.cards).length >= player.cardsCount
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

setIfExist = (player, boxInfo, attrs) ->
  player.increase att, val for att, val of boxInfo when att in attrs
  return

openVipBox = (player, boxInfo, next) ->
  setIfExist player, boxInfo, ['energy', 'money', 'skillPoint', 'elixir', 'fragments']

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

openFirstRechargeBox = (player, boxInfo, next) ->
  setIfExist player, boxInfo, ['energy', 'money', 'skillPoint', 'elixir']
  player.incSpirit boxInfo.spirit if _.has boxInfo, 'spirit'
  player.addPower boxInfo.power if _.has boxInfo, 'power'
  player.setFirstTime 'frb', 0
  player.save()

  if _.has boxInfo, 'card_id'
    cardData = 
      tableId: boxInfo.card_id
      lv: boxInfo.card_lv
      playerId: player.id

    entityUtil.createCard cardData, (err, card) ->
      if err
        return next null, {code: err.code or 500, msg: err.msg or err}

      player.addCard(card)
      next null, {code: 200, msg: {card: card.toJson()}}
  else
    next null, {code: 200}


# Handler::buyVip = (msg, session, next) ->
#   playerId = session.get('playerId')
#   id = msg.id

#   data = table.getTableItem('recharge', id)
#   tradeNo = new Date().getTime().toString()

#   player = null
#   async.waterfall [
#     (cb) ->
#       playerManager.getPlayerInfo pid: playerId, cb

#     (res, cb) =>
#       player = res
#       addGoldCard @app, tradeNo, player, data, cb

#     (cb) =>
#       addOrder @app, tradeNo, player, data.cash, cb
#   ], (err) =>
#     if err
#       return next(null, {code: err.code or 500, msg: err.msg or err})

#     player.increase('cash', data.cash)
#     player.increase('gold', (data.cash * 10) + data.gold)
#     player.save()
#     next(null, {code: 200, msg: {
#       vip: player.vip
#     }})

#     noticeNewYearActivity @app, player, (err) ->
#     @app.get('messageService').pushByPid player.id, {
#       route: 'onVerifyResult',
#       msg: {
#         gold: player.gold,
#         vip: player.vip,
#         cash: player.cash,
#         goldCards: player.getGoldCard()
#       }
#     }, (err, res) ->
#       if err
#         logger.error('faild to send message to playerId ', playerId)

# addOrder = (app, tradeNo, player, cash, cb) ->
#   app.get('dao').order.create data: {
#     playerId: player.id
#     tradeNo: tradeNo
#     partner: 'tongbu'
#     amount: cash * 100
#     paydes: ''
#     status: 2000
#     created: utility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
#   }, cb

# addGoldCard = (app, tradeNo, player, product, cb) ->
#   return cb() if not isGoldCard(product)

#   today = new Date()
#   vd = new Date()
#   vd.setDate(today.getDate()+product.valid_days-1)
#   app.get('dao').goldCard.create {
#     data: {
#       orderNo: tradeNo,
#       playerId: player.id,
#       type: GOLDCARDMAP[product.product_id],
#       created: utility.dateFormat(today, "yyyy-MM-dd"),
#       validDate: utility.dateFormat(vd, "yyyy-MM-dd"),
#       status: 1
#     }
#   }, (err, res) ->
#     if err
#       logger.error('faild to create goldCard record: ', err)

#     player.addGoldCard(res)
#     cb()

# isGoldCard = (product) ->
#   ids = [
#     'com.leasuregame.magpie.week.card',
#     'com.leasuregame.magpie.month.card'
#   ]
#   if product and product.product_id in ids
#     return true
#   else
#     return false

# noticeNewYearActivity = (app, player, cb) ->
#   startDate = new Date app.get('sharedConf').newYearActivity.startDate
#   endDate = new Date app.get('sharedConf').newYearActivity.endDate
#   now = new Date()

#   if startDate <= now < endDate
#     app.get('dao').order.rechargeOnPeriod player.id, startDate, endDate, (err, cash) ->
#       return cb(err) if err
#       if cash <= 0
#         return cb()

#       len = (table.getTable('new_year_rechage').filter (id, row) -> row.cash <= cash).length
#       if len > 0
#         recharge = player.activities.recharge or 0
#         flag = (Math.pow(2, len)-1)^recharge
#         sendNewYearMsg(app, player, flag, recharge) if flag > 0

#       return cb()
#   else
#     cb()

# sendNewYearMsg = (app, player, flag, recharge) ->
#   app.get('messageService').pushByPid player.id, {
#     route: 'onNewYearReward',
#     msg: {
#       flag: {
#         canGet: flag
#         hasGet: recharge
#       }
#     }
#   }, (err, res) ->
#     if err
#       logger.error('faild to send message to playerId ', playerId)