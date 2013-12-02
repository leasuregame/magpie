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
	playerId = session.get('playerId')
	receipts = msg.receipts
	if not receipts
		return next(null, msg: '请提供购买凭证信息')

	#receipts = JSON.parse(receipts) if _.isString(receipts)
	receipts = [receipts] if not _.isArray(receipts)

	brecord = null
	verify = (g, done) =>
		async.waterfall [
			(cb) =>
				@app.get('dao').buyRecord.fetchOne {where: {receiptData: g, playerId: playerId}}, (err, res) ->
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
						receiptData: g
					}, cb
				else 
					cb(null, record)			

		], (err, record) =>
			@app.get('verifyQueue').push(record) if record
			done(err, record)

	async.map receipts, verify, (err, results) ->
		if err
			return next(null, {code: err.code or 500, msg: err.message or err.msg or err})
		
		next(null, {code: 200})