playerManager = require '../../../manager/playerManager'
table = require '../../../manager/table'
utility = require '../../../common/utility'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::achievements = (msg, session, next) ->
	playerId = session.get('playerId')

	playerManager.getPlayerInfo pid: playerId, (err, player) ->
		if err
      		return next(null, {code: err.code or 500, msg: err.msg or err})

      	next(null, {code: 200, msg: player.achievement})