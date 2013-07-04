playerManager = require '../../../manager/playerManager'
taskManager = require '../../../manager/taskManager'
async = require 'async'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::explore = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  rewards = null
  player = null

  getPlayer = (cb) ->
    playerManager.getPlayerInfo {pid: playerId}, cb

  executeExpolore = (player, cb) ->
    console.log 'player got.'
    taskManager.explore player, cb

  checkFight = (_player, data, cb) =>
    player = _player
    rewards = data
    if rewards.result is 'fight'
      @app.rpc.battle.fightRemote.pve( session, {pid: player.id, taskId: player.task.id}, cb )
    else
      console.log 'not fight', cb, data
      cb(null, null)

  addBattleLogIfFight = (bl, cb) ->
    console.log 'add bl: ', bl, rewards
    if bl?
      rewards.battle_log = bl
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
      next(null, {code: 200, msg: rewards})
  )