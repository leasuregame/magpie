request = require 'request'
logger = require('pomelo-logger').getLogger(__filename)
_ = require 'underscore'
async = require 'async'
table = require '../manager/table'
utility = require '../common/utility'
Queue = require '../common/verifyQueue'

SANBOX_URL = 'https://sandbox.itunes.apple.com/verifyReceipt'
VERIFY_URL = 'https://buy.itunes.apple.com/verifyReceipt'

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
      where: isVerify: 0
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

    request.post {
      headers: 'content-type': 'application/json'
      url: SANBOX_URL
      json: 'receipt-data': new Buffer(item.receiptData).toString('base64')
    }, (err, res, body) ->
      if err
        logger.error('faild to verify app store receipt.', err)

      if body.status is 0
        queue.del(item.id) # 删除后，后面用到这个对象的地方会不会出问题呢
        updatePlayer(app, item, body)
        
      done()
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
    updateBuyRecord(app, buyRecord, receiptResult.receipt)
    successMsg(app, player)

updateBuyRecord = (app, buyRecord, receipt) ->
  app.get('dao').buyRecord.update {
    where: id: buyRecord.id
    data: {
      isVerify: 1,
      purchaseDate: utility.dateFormat(new Date(parseInt receipt.purchase_date_ms), 'yyyy-MM-dd h:mm:ss'),
      productId: receipt.product_id,
      qty: receipt.quantity
    }
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
