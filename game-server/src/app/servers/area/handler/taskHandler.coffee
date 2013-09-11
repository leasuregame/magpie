playerManager = require '../../../manager/playerManager'
taskManager = require '../../../manager/taskManager'
table = require '../../../manager/table'
taskRate = require '../../../../config/data/taskRate'
async = require 'async'
_ = require 'underscore'
Card = require '../../../domain/entity/card'
cardConfig = require '../../../../config/data/card'
spiritConfig = require '../../../../config/data/spirit'
utility = require '../../../common/utility'
dao = require('pomelo').app.get('dao')

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

###
探索
###
Handler::explore = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  taskId = msg.taskId
  player = null

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (_player, cb) ->
      player = _player
      if taskId > player.task.id 
        return cb({code: 501, msg: '不能探索此关'})
        
      taskManager.explore player, taskId, cb

    (data, chapterId, sectionId, cb) =>
      if data.result is 'fight'
        taskManager.fightToMonster(
          @app, 
          session, 
          {pid: player.id, tableId: chapterId, sectionId: sectionId, table: 'task_config'}
        , (err, battleLog) ->
          data.battle_log = battleLog

          if battleLog.winner is 'own'
            async.parallel [
              (callback) ->
                taskManager.obtainBattleRewards(player, chapterId, battleLog, callback)

              (callback) ->
                taskManager.countExploreResult player, data, taskId, callback
            ], (err, results) ->
              cb(err, results[1])
          else
            cb(null, data)
        )
      else if data.result is 'box'
        taskManager.openBox player, data, (err) ->
          if err
            cb(err, null)
          else
            taskManager.countExploreResult player, data, taskId, cb
      else
        taskManager.countExploreResult player, data, taskId, cb
  ], (err, data) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg})

    player.save()
    data.task = player.task
    data.power = player.power
    next(null, {code: 200, msg: data})

###
任务扫荡
###
Handler::wipeOut = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  type = msg.type or 'task'

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (player, cb) ->
      taskManager.wipeOut player, type, cb
  ], (err, player, rewards) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    player.save()
    next(null, {code: 200, msg: {
      rewards: rewards, 
      pass: player.pass,
      power: player.power,
      exp: player.exp,
      lv: player.lv
    }})

###
精英关卡，闯关
###
Handler::passBarrier = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  layer = msg.layer
  player = null

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (_player, cb) ->
      player = _player
      layer = if layer? then layer else player.pass.layer + 1
      if layer > 100 or layer < 1 or layer > (player.pass.layer + 1)
        return cb({code: 501, msg: '不能闯此关'})

      cb(null)

    (cb) =>
      @app.rpc.battle.fightRemote.pve( session, {pid: player.id, tableId: layer, table: 'pass_config'}, cb )

    (bl, cb) ->
      if bl.winner is 'own'
        rdata = table.getTableItem 'pass_reward', layer
        rewards = 
          exp: rdata.exp
          money: rdata.coins
          skillPoint: rdata.skill_point

        ### count spirit ###
        spirit = {total: 0}
        if layer is player.pass.layer + 1
          _.each bl.enemy.cards, (v, k) ->
            if v.boss?
              spirit[k] = spiritConfig.SPIRIT.PASS.BOSS
              spirit.total += spiritConfig.SPIRIT.PASS.BOSS
            else 
              spirit[k] = spiritConfig.SPIRIT.PASS.OTHER
              spirit.total += spiritConfig.SPIRIT.PASS.OTHER

        rewards.spirit = spirit
        bl.rewards = rewards

        player.increase('exp', rewards.exp)
        player.increase('money', rewards.money)
        player.increase('skillPoint', rewards.skillPoint)
        player.incPass() if player.pass.layer is layer-1
        player.setPassMark(layer)
        player.save()
      
      cb(null, bl)

  ], (err, bl) ->
    if err 
      return next(err, {code: err.code or 500, msg: err.msg or ''})
    
    next(null, {code: 200, msg: {
      battleLog: bl, 
      pass: player.pass,
      power: player.power,
      exp: player.exp,
      lv: player.lv
    }})