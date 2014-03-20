table = require './table'
Battle = require '../battle/battle'
battleLog = require '../battle/battle_log'
Player = require '../battle/player'
VirtualPlayer = require '../battle/virtual_player'
BossPlayer = require '../battle/boss_player'
playerManager = require('pomelo').app.get('playerManager')
async = require 'async'

BATTLELOG_TYPE = 
  PVE: 0
  PVP: 1
  BOSS: 2

class Manager
  @pve: (args, callback) ->
    pid = args.pid
    tableId = args.tableId
    tableName = args.table
    sectionId = args.sectionId
    taskData = table.getTableItem tableName, tableId
    taskData.sectionId = sectionId
    
    playerEntity = null
    async.waterfall [
      (cb) ->
        playerManager.getPlayerInfo {pid: pid, sync: false}, cb
      
      (_playerEntity, cb) ->
        battleLog.clear()
        
        playerEntity = _playerEntity
        attacker = new Player(playerEntity, is_attacker: true)
        defender = new VirtualPlayer(taskData)

        battle = new Battle(attacker, defender)
        battle.process()

        cb(null,  battleLog)
    ], (err, bl) ->
      if err
        return callback(err, null)

      res = bl.reports()
      res.type = BATTLELOG_TYPE.PVE
      callback(null, res)

  @pvp: (attEnt, defEnt, callback) ->
    battleLog.clear()

    attacker = new Player(attEnt, is_attacker: true)
    defender = new Player(defEnt)

    battle = new Battle(attacker, defender)
    battle.process()

    res = battleLog.reports()
    res.type = BATTLELOG_TYPE.PVP
    callback(null, res)

  @attackBoss: (player, boss, incRate, callback) ->
    battleLog.clear()

    attacker = new Player(player, {
      inc_scale: incRate,
      is_attacker: true
    })
    defender = new BossPlayer(boss)
    battle = new Battle(attacker, defender)
    battle.process()

    res = battleLog.reports()
    res.type = BATTLELOG_TYPE.BOSS
    callback(null, res)

module.exports = Manager