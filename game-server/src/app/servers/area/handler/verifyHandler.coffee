_ = require 'underscore'
async = require 'async'
request = require 'request'

SANBOX_URL = 'https://sandbox.itunes.apple.com/verifyReceipt'
VERIFY_URL = 'https://buy.itunes.apple.com/verifyReceipt'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

# 返回的验证信息：
# https://developer.apple.com/library/ios/releasenotes/General/ValidateAppStoreReceipt/Chapters/ReceiptFields.html#//apple_ref/doc/uid/TP40010573-CH106-SW1
Handler::appStore = (msg, session, next) ->
	# #for test
	# return vitualBuy(@app, msg, session, next) if msg.id?

	playerId = session.get('playerId')
	receipt = msg.receipt
	if not receipt
		return next(null, {code: 501, msg: '请提供购买凭证信息'})

	brecord = null
	async.waterfall [
		(cb) =>
			@app.get('dao').buyRecord.fetchOne {where: {receiptData: receipt, playerId: playerId}}, (err, res) ->
				if err and err.code is 404
					return cb(null, null)					

				if !!res and res.isVerify is 1
					return cb({code: 600, msg: '该凭证已经验证过了'})
				if !!res and res.isVerify is 0
					return cb(null, res)

				cb(null, null)

		(record, cb) =>
			if not record
				@app.get('dao').buyRecord.create data: {
					playerId: playerId
					receiptData: receipt
				}, cb
			else 
				cb(null, record)

	], (err, record) =>
		if err
			return next(null, {code: err.code or 500, msg: err.message or err.msg or err})

		@app.get('verifyQueue').push(record) if record
		next(null, {code: 200})
		
		
vitualBuy = (app, msg, session, next) ->
  playerId = session.get('playerId')
  id = msg.id
  table = require('../../../manager/table')
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
		