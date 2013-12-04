dao = require('pomelo').app.get('dao')
playerManager = require('pomelo').app.get('playerManager')
area = require '../../../domain/area/area'
logger = require('pomelo-logger').getLogger(__filename)

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::entry = (msg, session, next) ->
  playerId = session.get('playerId')

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      logger.error 'Get player failed! ' + err
      return next(new Error('fail to get player info'), {
        route: msg.route,
        code: 500
        })

    area.addPlayer player
    next(null, {code: 200, msg: {player: player.toJson()}})