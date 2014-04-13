dao = require('pomelo').app.get('dao')
playerManager = require('pomelo').app.get('playerManager')
table = require '../../../manager/table'
utility = require '../../../common/utility'
logger = require('pomelo-logger').getLogger(__filename)
async = require 'async'
_ = require 'underscore'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::orderList = (msg, session, next) ->
	async.parallel [
		(cb) ->
			dao.player.orderBy 'lv DESC, ability DESC', 50, cb

		(cb) ->
			dao.player.orderBy 'ability DESC, lv DESC', 50, cb

		# (cb) ->
		# 	dao.player.orderByRanking 50, cb

		(cb) ->
			dao.player.orderByLayer 50, cb
	], (err, results) ->
		if err
			return next(null, {
				code: err.code or 501
				msg: err.msg or err
				}
			)
		next(null, {
			code: 200,
			msg: {
				level: results[0]
				ability: results[1]
				# ranking: results[2]
				pass: results[2]
			}
		})