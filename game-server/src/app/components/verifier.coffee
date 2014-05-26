request = require 'request'
logger = require('pomelo-logger').getLogger(__filename)
_ = require 'underscore'
async = require 'async'
table = require '../manager/table'
utility = require '../common/utility'
Queue = require '../common/verifyQueue'

SANBOX_URL = 'https://sandbox.itunes.apple.com/verifyReceipt'
VERIFY_URL = 'https://buy.itunes.apple.com/verifyReceipt'

GOLDCARDMAP = 
  'com.leasuregame.magpie.week.card': 'week'
  'com.leasuregame.magpie.month.card': 'month'

# app receipt 验证返回状态码
# 状态码 描述
# 21000 App Store无法读取你提供的JSON数据
# 21002 收据数据不符合格式
# 21003 收据无法被验证
# 21004 你提供的共享密钥和账户的共享密钥不一致
# 21005 收据服务器当前不可用
# 21006 收据是有效的，但订阅服务已经过期。当收到这个信息时，解码后的收据信息也包含在返回内容中
# 21007 收据信息是测试用（sandbox），但却被发送到产品环境中验证
# 21008 收据信息是产品环境中使用，但却被发送到测试环境中验证

module.exports = (app, opts) ->
  return new Component(app, opts)

class Component
  constructor: (app, opts={}) ->
    @app = app
    @timerId = null
    @interval = 1000
    @app.set('verifyQueue', new Queue())

  @name = '__verify__'

  start: (cb) ->
    @app.get('dao').buyRecord.fetchMany {
      where: "isVerify = 0 and (status is null or status = 21005)"
    }, (err, res) =>
      if err
        logger.error('faild to fetch buyRecord.', err)

      if !!res and res.length > 0
        @app.get('verifyQueue').init(res)

    process.nextTick cb

  afterStart: (cb) ->
    @timerId = setInterval executeVerify.bind(null, @app, @app.get('verifyQueue')), @interval
    process.nextTick cb

  stop: (cb) ->
    clearInterval @timerId
    process.nextTick cb

executeVerify = (app, queue) ->
  return if queue.len() is 0
  items = queue.needToProcess()

  return if items.length is 0

  useSanbox = app.get('useSanbox') or false
  async.each items, (item, done) ->    
    tryCount = 0
    postReceipt = (reqUrl, receiptData) ->
      request.post {
        headers: 'content-type': 'application/json'
        url: reqUrl
        json: 'receipt-data': new Buffer(receiptData).toString('base64')
      }, (err, res, body) ->
        if err
          logger.error('faild to verify app store receipt.', err)
          return done()

        #logger.info 'verify result: ', reqUrl, body
        if body.status is 0
          queue.del(item.id) # 删除后，后面用到这个对象的地方会不会出问题呢
          return updatePlayer(app, item, body, done)
        else if body.status is 21005
          #收据服务器当前不可用
          item.doing = false
          updateBuyRecord(app, item.id, {status: body.status}, ()->)
        else 
          queue.del(item.id)
          updateBuyRecord(app, item.id, {status: body.status}, ()->)

        if body.status is 21007 and tryCount == 0 and useSanbox
          tryCount += 1
          return postReceipt(SANBOX_URL, receiptData)

        done()

    postReceipt(VERIFY_URL, item.receiptData)
  , (err) ->
    if err
      logger.error('faild to verify app store reciept.', err)

updatePlayer = (app, buyRecord, receiptResult, done) ->
  products = table.getTable('recharge').filter (id, item) -> item.product_id is receiptResult.receipt.product_id
  if products and products.length > 0
    product = products[0]
  else
    logger.error('verify result: ', receiptResult)
    logger.error('buy record: ', buyRecord)
    throw new Error('can not find product info by product id ', receiptResult.receipt.product_id)
    return done()

  isFirstRechage = false
  player = null
  async.waterfall [
    (cb) ->
      app.get('playerManager').getPlayerInfo {pid: buyRecord.playerId}, cb

    (_player, cb) ->
      player = _player
      times = 1
      ### 首冲获得相应倍数魔石 ###
      if player.isRechargeFirstTime(parseInt product.id)
        times = product.times
        player.setRechargeFirstTime(parseInt product.id)

      if player.cash is 0
        isFirstRechage = true

      player.increase('cash', product.cash)
      player.increase('gold', (product.cash * 10 + product.gold) * times)
      player.save()

      rdata = 
        isVerify: 1
        purchaseDate: utility.dateFormat(new Date(parseInt receiptResult.receipt.purchase_date_ms), 'yyyy-MM-dd h:mm:ss')
        productId: receiptResult.receipt.product_id
        qty: receiptResult.receipt.quantity
        status: receiptResult.status

      updateBuyRecord(app, buyRecord.id, rdata, cb)
    (updateResult, cb) ->
      addGoldCard(app, buyRecord.id, player, product, cb)

    # (cb) ->
    #   noticeNewYearActivity app, player, cb
  ], (err) ->
    if err
      logger.error('can not find player info by playerid ', buyRecord.playerId, err)
      return done()

    successMsg(app, player, isFirstRechage)
    done()

addGoldCard = (app, orderId, player, product, cb) ->
  return cb() if not isGoldCard(product)

  app.get('dao').goldCard.fetchOne where: playerId: player.id, orderId: orderId, (err, res) ->
    if res
      updateGoldCardStatus app, orderId, res, player, cb
    else 
      createNewGoldCard app, orderId, player, product, cb

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

updateBuyRecord = (app, id, data, cb) ->
  app.get('dao').buyRecord.update {
    where: id: id
    data: data
  }, cb

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
      logger.error('faild to send message to playerId ', playerId)

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
