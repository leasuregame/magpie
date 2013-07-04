playerManager = require '../../../manager/playerManager'
taskManager = require '../../../manager/taskManager'
table = require '../../manager/table'
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
    taskManager.explore player, cb

  checkFight = (_player, data, cb) =>
    player = _player
    rewards = data
    if rewards.result is 'fight'
      @app.rpc.battle.fightRemote.pve( session, {pid: player.id, taskId: player.task.id, table: 'task_config'}, cb )
    else
      cb(null, null)

  addBattleLogIfFight = (bl, cb) ->
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

Handler::passBarrier = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  rewards = {win: false}
  player = null
  pass = 0

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (_player, cb) ->
      player = _player
      pass = msg.pass or player.pass
      @app.rpc.battle.fightRemote.pve( session, {pid: player.id, passId: pass, table: 'pass_config'}, cb )

    (bl, cb) ->
      if bl.winner is 'own'
        rdata = table.getTableItem 'pass_reward', pass
        rewards.exp = rdata.exp
        rewards.coins = rdata.coins
        rewards.skill_poins = rdata.skill_poins
        rewards.win = true
      cb(null)

  ], (err) ->
    if err 
      return next(err, {code: 500})

    player.save()
    next(null, {code: 200, msg: rewards})