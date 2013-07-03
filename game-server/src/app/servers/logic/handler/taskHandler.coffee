playerManager = require '../../../manager/playerManager'
taskManager = require '../../../manager/taskManager'
async = require 'async'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::explore = (msg, session, next) ->
  console.log 'explore start: ', msg

  playerId = session.get('playerId') or msg.playerId
  data = null
  player = null

  getPlayer = (cb) ->
    console.log 'getting player...'
    playerManager.getPlayerInfo {pid: playerId}, cb

  executeExpolore = (player, cb) ->
    console.log 'player got.'
    taskManager.explore player, cb

  checkFight = (_player, taskId, data, cb) =>
    console.log 'explored. checkFight...'
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
      next(null, {code: 200, msg: data})
  )