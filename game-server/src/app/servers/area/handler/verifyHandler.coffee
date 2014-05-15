_ = require 'underscore'
async = require 'async'
request = require 'request'
table = require '../../../manager/table'
utility = require '../../../common/utility'

SANBOX_URL = 'https://sandbox.itunes.apple.com/verifyReceipt'
VERIFY_URL = 'https://buy.itunes.apple.com/verifyReceipt'

GOLDCARDMAP_REVERT = 
  'com.leasuregame.magpie.week.card': 'week'
  'com.leasuregame.magpie.month.card': 'month'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

# 返回的验证信息：
# https://developer.apple.com/library/ios/releasenotes/General/ValidateAppStoreReceipt/Chapters/ReceiptFields.html#//apple_ref/doc/uid/TP40010573-CH106-SW1
Handler::appStore = (msg, session, next) ->
  
  playerId = session.get('playerId')
  receipt = msg.receipt
  productId = msg.productId

  if not receipt
    return next(null, {code: 501, msg: '请提供购买凭证信息'})

  dao = @app.get('dao')

  brecord = null
  async.waterfall [
    (cb) =>
      dao.buyRecord.fetchOne {where: {receiptData: receipt, playerId: playerId}}, (err, res) ->
        if err and err.code is 404
          return cb(null, null)         

        if !!res and res.isVerify is 1
          return cb({code: 600, msg: '该凭证已经验证过了'})
        if !!res and res.isVerify is 0
          return cb(null, res)

        cb(null, null)

    (record, cb) =>
      brecord = record
      if not record
        products = table.getTable('recharge').filter (id, item) -> item.product_id is productId
        product = products[0]

        dao.buyRecord.create data: {
          playerId: playerId
          receiptData: receipt
          amount: product?.cash or 0
          productId: product?.product_id or ''
        }, cb
      else 
        cb(null, record)

    (record, cb) =>
      if record
        @app.get('verifyQueue').push(record)

      if productId not in Object.keys(GOLDCARDMAP_REVERT)
        return cb(null, record)

      dao.goldCard.fetchOne where: playerId: playerId, orderId: record.id, (err, gc) =>
        if err and err.code is 404
          products = table.getTable('recharge').filter (id, item) -> item.product_id is productId
          product = products[0]

          if not product
            return cb({code: 501, msg: '找不到月卡或周卡的配置信息'})

          today = new Date()
          vd = new Date()
          vd.setDate(vd.getDate()+product.valid_days-1)
          dao.goldCard.create data: {
            orderId: record.id,
            playerId: playerId,
            type: GOLDCARDMAP_REVERT[product.product_id],
            created: utility.dateFormat(today, "yyyy-MM-dd"),
            validDate: utility.dateFormat(vd, "yyyy-MM-dd")
          }, cb
        else
          cb(null, gc)
  ], (err, record) =>
    if err
      return next(null, {code: err.code or 500, msg: err.message or err.msg or err})

    next(null, {code: 200})
    
    
vitualBuy = (app, msg, session, next) ->
  playerId = session.get('playerId')
  id = msg.id
  products = table.getTable('recharge').filter (dkkd, item) -> item.product_id is id
  if products and products.length > 0
    product = products[0]
  else
    throw new Error('can not file product info by product id ', id)
    
  app.get('playerManager').getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    times = 1
    if player.cash is 0
      times = 3
    player.increase('cash', product.cash)
    player.increase('gold', ((product.cash * 10) + product.gold) * times)
    player.save()

    successMsg(app, player)

    next(null, {code: 200})

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
      logger.error('faild to send message to playerId ', player.id)
    