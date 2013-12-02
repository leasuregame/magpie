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

	goods = msg.goods
	if not goods
		return next(null, msg: '请提供购买凭证信息')

	goods = JSON.parse(goods) if _.isString(goods)
	goods = [goods] if not _.isArray(goods)

	brecord = null
	verify = (g, done) ->
		async.waterfall [
			(cb) =>
				@app.get('dao').buyRecored.fetchOne {where: {signature: g.signature}}, (err, res) ->
					if err and err.code is 404
						return cb()					

					if !!res and res.isVerify is 1
						return cb({code: 501, msg: '该凭证已经验证过了'})
					if !!res and res.isVerify is 0
						return cb(null, res)

					cb()

			(record, cb) ->
				if not record
					@app.get('dao').buyRecored.create data: {
						playerId: playerId
						signature: g.signature
						receiptData: JSON.stringify(g)
					}, cb
				else 
					cb(null, record)

			(record, cb) ->
				brecord = record

				request.post {
					headers: {'content-type': 'application/json'}
					url: SANBOX_URL
					json: new Buffter(g).toString('base64')
				}, (err, res, body) ->
					if err
						return cb(err)
					cb(null, res, body) 

			(verifyResult, body, cb) ->
				console.log 'verify result:', verifyResult, body
				cb(null, [verifyResult, body])

		], (err, result) ->
			console.log err, result
			done(null, {code: 200, msg: result})


	async.each goods, verify, (err, res) ->
		console.log err, res
		
		next(null, {code: 200, msg: res})