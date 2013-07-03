table = require '../../../manager/table'
Battle = require '../../../battle/battle'
battleLog = require '../../../battle/battle_log'
Player = require '../../../battle/player'
VirtualPlayer = require '../../../battle/virtual_player'
async = require 'async'
playerManager = require '../../../manager/playerManager'

exports.pve = (args, callback) ->
  pid = args.pid
  taskId = args.taskId
  taskData = table.getTableItem 'task_config', taskId

  async.waterfall([
    (cb) ->
      playerManager.getPlayer {pid: pid}, cb
    
    (playerEntity, cb) ->
      attacker = new Player(playerEntity)
      defender = new VirtualPlayer(taskData)

      battleLog = clear()
      battle = new Battle(attacker, defender)
      battle.process()

      cb(null, JSON.stringify battleLog.reports())
    ],
    (err, bl) ->
      if err
        callback(err, null)
      else
        callback(null, bl)
  )