request = require 'request'
logger = require('pomelo-logger').getLogger(__filename)
_ = require 'underscore'
async = require 'async'
table = require '../manager/table'
utility = require '../common/utility'
Queue = require '../common/verifyQueue'

SANBOX_URL = 'https://sandbox.itunes.apple.com/verifyReceipt'
VERIFY_URL = 'https://buy.itunes.apple.com/verifyReceipt'

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

  stop: () ->
    clearInterval @timerId
    process.nextTick cb

executeVerify = (app, queue) ->
  return if queue.len() is 0
  items = queue.needToProcess()
  return if items.length is 0

  async.each items, (item, done) ->
    return if item.doing 
    item.doing = true
    tryCount = 0

    postReceipt = (reqUrl, receiptData) ->
      request.post {
        headers: 'content-type': 'application/json'
        url: reqUrl
        json: 'receipt-data': new Buffer(receiptData).toString('base64')
      }, (err, res, body) ->
        if err
          logger.error('faild to verify app store receipt.', err)
          return

        if body.status is 0
          queue.del(item.id) # 删除后，后面用到这个对象的地方会不会出问题呢
          updatePlayer(app, item, body)
        else
          item.doing = false
          updateBuyRecord(app, item.id, {status: body.status})

        if body.status is 21007 and tryCount == 0
          tryCount += 1
          return postReceipt(SANBOX_URL, receiptData)

        done()

    postReceipt(VERIFY_URL, item.receiptData)
  , (err) ->
    if err
      logger.error('faild to verify app store reciept.', err)

updatePlayer = (app, buyRecord, receiptResult) ->
  products = table.getTable('recharge').filter (id, item) -> item.product_id is receiptResult.receipt.product_id
  if products and products.length > 0
    product = products[0]
  else
    throw new Error('can not file product info by product id ', receiptResult.receipt.product_id)
    return

  app.get('playerManager').getPlayerInfo {pid: buyRecord.playerId}, (err, player) ->
    if err
      logger.error('can not find player info by playerid ', buyRecord.playerId, err)
      return

    player.increase('cash', product.cash)
    player.increase('gold', product.cash * 10)
    player.save()

    rdata = 
      isVerify: 1
      purchaseDate: utility.dateFormat(new Date(parseInt receiptResult.receipt.purchase_date_ms), 'yyyy-MM-dd h:mm:ss')
      productId: receiptResult.receipt.product_id
      qty: receiptResult.receipt.quantity
      status: receiptResult.status

    updateBuyRecord(app, buyRecord.id, rdata)
    successMsg(app, player)

updateBuyRecord = (app, id, data) ->
  app.get('dao').buyRecord.update {
    where: id: id
    data: data
  }, (err, res) ->
    if err
      logger.error('faild to update buy record.', err)

successMsg = (app, player) ->
  app.get('messageService').pushByPid player.id, {
    route: 'onVerifyResult',
    msg: {
      gold: player.gold,
      vip: player.vip,
      cash: player.cash
    }
  }, (err, res) ->
    if err
      logger.error('faild to send message to playerId ', playerId)
