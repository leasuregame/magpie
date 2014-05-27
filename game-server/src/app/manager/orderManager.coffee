dao = require('pomelo').app.get('dao');
table = require '../../../manager/table'
utility = require '../../../common/utility'
async = require 'async'
_ = require 'underscore'

GOLDCARDMAP_REVERT = 
  'com.leasuregame.magpie.week.card': 'week'
  'com.leasuregame.magpie.month.card': 'month'

class Manager
  @checkReceiptIsVerify: (playerId, receipt, productId, cb) ->
    dao.buyRecord.fetchOne {where: {receiptData: receipt, playerId: playerId}}, (err, res) ->
      if err and err.code is 404 return Manager.createBuyRecord(playerId, receipt, productId, cb)

      if !!res and res.isVerify is 1
        return cb({code: 600, msg: '该凭证已经验证过了'})
      else if !!res and res.isVerify is 0
        return cb(null, res)
      else
        cb(null, null)

  @createBuyRecord: (playerId, receipt, productId, cb) ->
    products = table.getTable('recharge').filter (id, item) -> item.product_id is productId
    product = products[0]

    dao.buyRecord.create data: {
      playerId: playerId
      receiptData: receipt
      amount: product?.cash or 0
    }, cb

  @addGoldCard: (playerId, orderId, productId, cb) ->
    if productId not in Object.keys(GOLDCARDMAP_REVERT)
      return cb(null)

    dao.goldCard.fetchOne where: playerId: playerId, orderId: orderId, (err, gc) =>
      if err and err.code is 404
        products = table.getTable('recharge').filter (id, item) -> item.product_id is productId
        product = products[0]

        if not product
          return cb({code: 501, msg: '找不到月卡或周卡的配置信息'})

        today = new Date()
        vd = new Date()
        vd.setDate(vd.getDate()+product.valid_days-1)
        dao.goldCard.create data: {
          orderId: orderId,
          playerId: playerId,
          type: GOLDCARDMAP_REVERT[product.product_id],
          created: utility.dateFormat(today, "yyyy-MM-dd"),
          validDate: utility.dateFormat(vd, "yyyy-MM-dd")
        }, cb
      else
        cb(null, gc)