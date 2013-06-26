playerManager = require '../../../manager/playerManager'
taskManager = require '../../../manager/taskManager'
resources = require '../../../../shared/resources'
async = require 'async'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::explore = (msg, session, next) ->
  playerId = session.get('playerId')

  playerManager.getPlayer {pid: playerId}, (err, player) ->
    if err and not player
      next(null, {code: 500, msg: resources.ERROR.PLAYER_NOT_EXISTS})
    else
      taskManager.explore player, (err, data) ->
        if err
          next(null, {code: 500})
        else
          next(null, {code: 200, data: data})

  async.waterfall [
    (cb) ->
      playerManager.getPlayer {pid: playerId}, cb

    (player, cb) ->
      
    ], (err, result) ->