table = require('../../../manager/table')
async = require('async')
utility = require('../../../common/utility')
logger = require('pomelo-logger').getLogger(__filename)

ORDER_INIT_STATUS = 1000
ORDER_FINISHED_STATUS = 2000
ORDER_ERROR_STATUS_1 = 3000
ORDER_ERROR_STATUS_2 = 3010

GOLDCARDMAP = 
  'com.leasuregame.magpie.week.card': 'week'
  'com.leasuregame.magpie.month.card': 'month'

module.exports = (app) ->
  new Remote(app)

Remote = (@app) ->

Remote::add = (args, platform, callback) ->
  player = null
  product = null
  isFirstRechage = false
  async.waterfall [
    (cb) =>
      @app.get('playerManager').getPlayerInfo pid: args.playerId, cb

    (_player, cb) =>
      player = _player
      @app.get('dao').order.fetchOne where: tradeNo: args.tradeNo, (err, o) -> cb(null, o)

    (exist, cb) =>
      if exist
        if exist.status is ORDER_FINISHED_STATUS
          return cb({ok: true, msg: '该订单已处理'})
        else 
          return cb(null, exist)

      @app.get('dao').order.create data: {
        playerId: args.playerId
        tradeNo: args.tradeNo
        tborderNo: args.tborderNo
        partner: args.partner
        amount: args.amount
        paydes: args.paydes
        status: ORDER_INIT_STATUS
        created: utility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
      }, cb

    (order, cb) =>
      # updateArgs(args, platform, order)

      order.partner = args.partner
      order.amount = args.amount
      order.paydes = args.paydes if args.paydes

      product = table.getTableItem('recharge', args.productId)
      if not product
        logger.warn('找不到购买的对应产品, 产品id为', args.productId)
        updateOrderStatus(@app, order, ORDER_ERROR_STATUS_1)
        return cb({ok: false, msg: '找不到购买的对应产品'})

      # 检查充值的金额是否正确
      if not checkAmountIsCorrect(args.amount, product?.cash, platform)
        logger.warn('充值的金额跟产品金额不匹配,', '订单金额为:', args.amount+'分,', 
          '产品实际金额为:', product.cash+'元', '产品id为:', args.productId)
        updateOrderStatus(@app, order, ORDER_ERROR_STATUS_2)
        return cb({ok: false, msg: '充值的金额跟产品金额不匹配'})
      
      times = 1
      ### 首冲获得相应倍数魔石 ###
      if player.isRechargeFirstTime(parseInt args.productId)
        times = product.times
        player.setRechargeFirstTime(parseInt args.productId)

      if player.cash is 0
        isFirstRechage = true

      player.increase('cash', product.cash)
      player.increase('gold', (product.cash * 10 + product.gold) * times)
      player.save()
      updateOrderStatus(@app, order, ORDER_FINISHED_STATUS, cb)
    
    (updated, cb) =>
      addGoldCard @app, args.tradeNo, player, product, cb

    (cb) =>
      noticeNewYearActivity @app, player, cb
  ], (err) =>
    if err
      return callback(null, err)

    successMsg(@app, player, isFirstRechage)
    callback(null, {ok: true})

checkAmountIsCorrect = (amount, cash, platform) ->
  switch platform
    when 'PP' then result = parseInt(amount) == cash
    when '91' then result = parseInt(amount) == cash
    when 'TB' then result = parseInt(amount) == cash*100
    else result = false

  result

updateArgs = (args, platform, order) ->
  if platform is 'PP'
    [productId, areaId] = order.billno.split('-')
    args.productId = parseInt productId
    args.areaId = parseInt areaId

addGoldCard = (app, tradeNo, player, product, cb) ->
  return cb() if not isGoldCard(product)

  app.get('dao').goldCard.fetchOne where: playerId: player.id, orderNo: tradeNo, (err, res) ->
    if res
      updateGoldCardStatus app, tradeNo, res, player, cb
    else 
      createNewGoldCard app, tradeNo, player, product, cb

updateGoldCardStatus = (app, tradeNo, goldCard, player, cb) ->
  app.get('dao').goldCard.update {
    data: status: 1
    where: playerId: player.id, orderNo: tradeNo
  }, (err, res) ->
    if err
      logger.error('faild to update goldCard record: ', err)

    goldCard.status = 1
    player.addGoldCard goldCard
    cb()

createNewGoldCard = (app, tradeNo, player, product, cb) ->
  today = new Date()
  vd = new Date()
  vd.setDate(vd.getDate()+product.valid_days-1)
  app.get('dao').goldCard.create {
    data: {
      orderNo: tradeNo,
      playerId: player.id,
      type: GOLDCARDMAP[product.product_id],
      created: utility.dateFormat(today, "yyyy-MM-dd"),
      validDate: utility.dateFormat(vd, "yyyy-MM-dd"),
      status: 1
    }
  }, (err, res) ->
    if err
      logger.error('faild to create goldCard record: ', err)

    player.addGoldCard(res)
    cb()

isGoldCard = (product) ->
  ids = [
    'com.leasuregame.magpie.week.card',
    'com.leasuregame.magpie.month.card'
  ]
  if product and product.product_id in ids
    return true
  else
    return false

updateOrderStatus = (app, order, status, cb) ->
  app.get('dao').order.update {
    data: {
      partner: order.partner
      amount: order.amount
      paydes: order.paydes
      status: status
    }
    where: tradeNo: order.tradeNo
  }, (err, res) ->
    if err
      logger.error('faild to udpate order status.', tradeNo, status)
      logger.error(err)

    cb(err, res) if typeof cb is 'function'

noticeNewYearActivity = (app, player, cb) ->
  startDate = new Date app.get('sharedConf').newYearActivity.startDate
  endDate = new Date app.get('sharedConf').newYearActivity.endDate
  endDate.setDate(endDate.getDate()+1)
  now = new Date()

  if startDate <= now < endDate
    app.get('dao').order.rechargeOnPeriod player.id, app.get('sharedConf').newYearActivity.startDate, app.get('sharedConf').newYearActivity.endDate, (err, cash) ->
      return cb(err) if err
      if cash <= 0
        return cb()

      len = (table.getTable('new_year_rechage').filter (id, row) -> row.cash <= cash).length
      if len > 0
        recharge = player.activities?.recharge or 0
        flag = (Math.pow(2, len)-1)^recharge
        sendNewYearMsg(app, player, flag, recharge) if flag > 0

      return cb()
  else
    cb()

sendNewYearMsg = (app, player, flag, recharge) ->
  app.get('messageService').pushByPid player.id, {
    route: 'onNewYearReward',
    msg: {
      flag: {
        canGet: flag
        hasGet: recharge
      }
    }
  }, (err, res) ->
    if err
      logger.error('faild to send message to playerId ', player.id)

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
    }
  }, (err, res) ->
    if err
      logger.error('faild to send message to playerId ', playerId)