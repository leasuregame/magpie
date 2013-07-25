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
  tableId = args.tableId
  tableName = args.table
  sectionId = args.sectionId
  taskData = table.getTableItem tableName, tableId

  playerEntity = null
  async.waterfall([
    (cb) ->
      playerManager.getPlayerInfo {pid: pid, sync: false}, cb
    
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
      
      callback(null, bl.reports())
  )

exports.pvp = (args, callback) ->
  targetId = args.targetId
  playerId = args.playerId
  playerManager.getPlayers [playerId, targetId], (err, results) ->
    if err
      return callback(err, null)

    console.log 'players for fight: ', err, results
    p_data = results[playerId]
    attacker = new Player(p_data)
    console.log 'before set line up'
    attacker.setLineUp p_data.get('lineUp')
    console.log 'after set line up'
    t_data = results[targetId]
    defender = new Player(t_data)
    defender.setLineUp t_data.get('lineUp')

    battleLog.clear()
    battle = new Battle(attacker, defender)
    battle.process()

    callback null, battleLog.reports()