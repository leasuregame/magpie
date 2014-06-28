_ = require 'underscore'
async = require 'async'
request = require 'request'
table = require '../../../manager/table'
utility = require '../../../common/utility'
rechargeDao = require('pomelo').app.get('dao').backendRecharge

GOLDCARD_MAP =
  'com.leasuregame.magpie.week.card': 'week'
  'com.leasuregame.magpie.month.card': 'month'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->


Handler::recharge = (msg, session, next) ->
  app = @app

  playerIds = msg.playerIds
  playerNames = msg.playerNames
  verifyKey = msg.verifyKey
  proId = msg.productId
  type = if msg.type then msg.type else 0
  qty = msg.qty

  #verify client

  if not _.isArray playerIds
    playerIds = [playerIds]

  if (not qty) or (not _.isNumber qty) or qty <= 0 or qty > 20
    return next(null, {code: 500, msg: 'parameter unexpected'})

  if (isGoldCard(proId) && qty != 1)
    return next(null, {code: 500, msg: 'parameter unexpected'})

  products = table.getTable('recharge').filter (id, item) -> item.product_id is proId
  if products and products.length > 0
    product = products[0]
  else
    return next(null, {code: 500, msg: 'product does not exists'})

  # 用于记录充值失败的用户
  failIdx = playerIds.length

  _.each playerIds, (playerId, idx) ->

    isFirstRechage = false
    player = null

    async.waterfall [
      (cb) ->
        #查找用户
        app.get('playerManager').getPlayerInfo {pid: playerId}, cb

      (_player, cb) ->
        #为用户增加相关资源
        player = _player

        presentTimes = 1

        ### 首冲获得相应倍数魔石 ###
        if player.isRechargeFirstTime(parseInt product.id)
          presentTimes = product.times
          player.setRechargeFirstTime(parseInt product.id)

        if player.cash is 0
          isFirstRechage = true

        cashAmount = product.cash * qty
        goldGain = (product.cash * 10 + product.gold) * (presentTimes + qty - 1)

        player.increase('cash', cashAmount)
        player.increase('gold', goldGain)
        player.save()

        addGoldCard(app, null, player, product, ->
          cb null, data:
            playerId : player.id
            type : type
            productId : proId
            qty : qty
            amount : cashAmount
            gain : goldGain
        )

      (rechargeData, cb) ->
        # 记录此次操作
        rechargeDao.createRecharge rechargeData, cb
    ], (err) ->
      if err
        # 如果充值失败则同时返回哪些用户成功,哪些用户失败
        failIdx = idx
        succeededPN = playerNames.splice(0, failIdx);
        return next(null, {code: 501, msg: {
          err:'player not found',
          players:succeededPN,
          failedPlayers:playerNames,
          product:product,
          qty:qty,
        }})
      successMsg(app, player, isFirstRechage)

  next(null, {code: 200, msg: {players:playerNames, product:product, qty:qty}})


addGoldCard = (app, orderId, player, product, cb) ->
  return cb() if not isGoldCard(product)

  app.get('dao').goldCard.fetchOne where: playerId: player.id, orderId: orderId, (err, res) ->
    if res
      updateGoldCardStatus app, orderId, res, player, cb
    else
      createNewGoldCard app, orderId, player, product, cb

isGoldCard = (product) ->
  ids = [
    'com.leasuregame.magpie.week.card',
    'com.leasuregame.magpie.month.card'
  ]
  if product and product.product_id in ids
    return true
  else
    return false

updateGoldCardStatus = (app, orderId, goldCard, player, cb) ->
  app.get('dao').goldCard.update {
    data: status: 1
    where: playerId: player.id, orderId: orderId
  }, (err, res) ->
    if err
      logger.error('faild to update goldCard record: ', err)

    goldCard.status = 1
    player.addGoldCard goldCard
    cb()

createNewGoldCard = (app, orderId, player, product, cb) ->
  today = new Date()
  vd = new Date()
  vd.setDate(vd.getDate()+product.valid_days-1)
  app.get('dao').goldCard.create {
    data: {
      orderId: orderId,
      playerId: player.id,
      type: GOLDCARD_MAP[product.product_id],
      created: utility.dateFormat(today, "yyyy-MM-dd"),
      validDate: utility.dateFormat(vd, "yyyy-MM-dd"),
      status: 1
    }
  }, (err, res) ->
    if err
      logger.error('faild to create goldCard record: ', err)

    player.addGoldCard(res)
    cb()

successMsg = (app, player, isFirstRechage) ->
  app.get('messageService').pushByPid player.id, {
    route: 'onVerifyResult',
    msg: {
      gold: player.gold,
      vip: player.vip,
      cash: player.cash,
      goldCards: player.getGoldCard(),
      recharge: player.firstTime.recharge or 0,
      firstRechargeBox: 1 if isFirstRechage
      vipLoginReward: !player.dailyGift.vipReward if player.isVip()
    }
  }, (err, res) ->
    if err
      logger.error('faild to send message to playerId ', playerId)