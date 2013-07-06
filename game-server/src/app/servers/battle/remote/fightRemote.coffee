table = require '../../../manager/table'
Battle = require '../../../battle/battle'
battleLog = require '../../../battle/battle_log'
Player = require '../../../battle/player'
VirtualPlayer = require '../../../battle/virtual_player'
async = require 'async'
playerManager = require '../../../manager/playerManager'
taskRate = require '../../../../config/data/taskRate'
cardConfig = require '../../../../config/data/card'
_ = require 'underscore'

exports.pve = (args, callback) ->
  pid = args.pid
  taskId = args.taskId
  table = args.table
  taskData = table.getTableItem table, taskId
  cardIds = taskData.cards.split('#')

  playerEntity = null
  async.waterfall([
    (cb) ->
      playerManager.getPlayerInfo {pid: pid}, cb
    
    (_playerEntity, cb) ->
      playerEntity = _playerEntity
      attacker = new Player(playerEntity)
      defender = new VirtualPlayer(taskData)

      battleLog.clear()
      battle = new Battle(attacker, defender)
      battle.process()

      cb(null,  battleLog)
    ],
    (err, bl) ->
      if err
        return callback(err, null)
      
      callback(null, bl)
  )