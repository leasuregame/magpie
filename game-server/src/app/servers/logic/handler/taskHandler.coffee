playerManager = require '../../../manager/playerManager'
taskManager = require '../../../manager/taskManager'
resources = require '../../../../shared/resources'
async = require 'async'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::explore = (msg, session, next) ->
  playerId = session.get('playerId')
  data = null
  player = null

  getPlayer = (cb) ->
    playerManager.getPlayer {pid: playerId}, cb

  executeExpolore = (player, cb) ->
    taskManager.explore player, cb

  checkFight = (_player, taskId, data, cb) =>
    player = _player
    data = data
    if data.result is 'fight'
      @app.rpc.battle.fightRemote.pve( session, {pid: player.id, taskId: taskId}, cb )
    else
      cb(null, null)

  addBattleLogIfFight = (bl, cb) ->
    if bl?
      data.battle_log = bl
    cb(null)

  async.waterfall([
    getPlayer,
    executeExpolore,
    checkFight,
    addBattleLogIfFight      
    ], 
    (err) ->
      if err
        next(err, {code: 500})
        return

      player.save()
      next(null, {code: 200, data: data})
  )