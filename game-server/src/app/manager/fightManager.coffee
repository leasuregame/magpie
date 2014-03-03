table = require './table'
Battle = require '../battle/battle'
battleLog = require '../battle/battle_log'
Player = require '../battle/player'
VirtualPlayer = require '../battle/virtual_player'
playerManager = require('pomelo').app.get('playerManager')
async = require 'async'

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
        playerEntity = _playerEntity
        attacker = new Player(playerEntity)
        defender = new VirtualPlayer(taskData)

        battleLog.clear()
        battle = new Battle(attacker, defender)
        battle.process()

        cb(null,  battleLog)
    ], (err, bl) ->
      if err
        return callback(err, null)
      
      callback(null, bl.reports())

  @pvp: (attEnt, defEnt, callback) ->

    attacker = new Player(attEnt)
    attacker.setLineUp attEnt.get('lineUp')
    defender = new Player(defEnt)
    defender.setLineUp defEnt.get('lineUp')

    battleLog.clear()
    battle = new Battle(attacker, defender)
    battle.process()

    callback null, battleLog.reports()

  @attackBoss: (player, boss, callback) ->
    attacker = new Player(player)
    defender = new BossPlayer(boss)
    battleLog.clear()
    battle = new Battle(attacker, defender)
    battle.process()

    callback(null, battleLog.reports())

module.exports = Manager