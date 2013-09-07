dao = require('pomelo').app.get('dao')
playerManager = require '../../../manager/playerManager'
table = require '../../../manager/table'
utility = require '../../../common/utility'
logger = require('pomelo-logger').getLogger(__filename)
async = require 'async'
_ = require 'underscore'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::playerLevel = (msg, session, next) ->
	dao.player.orderBy 'lv DESC, ability DESC', 50, (err, results) ->
		if err
			return next(null, {
				code: err.code or 501
				msg: err.msg or err
				}
			)

		next(null, {code: 200, msg: results})

Handler::playerAbility = (msg, session, next) ->
	dao.player.orderBy 'ability DESC, lv DESC', 50, (err, results) ->
		if err
			return next(null, {
				code: err.code or 501
				msg: err.msg or err
				}
			)

		next(null, {code: 200, msg: results})

Handler::playerRanking = (msg, session, next) ->
	dao.player.orderByRanking 50, (err, results) ->
		if err
			return next(null, {
				code: err.code or 501
				msg: err.msg or err
				}
			)

		next(null, {code: 200, msg: results})

Handler::playerPass = (msg, session, next) ->
	