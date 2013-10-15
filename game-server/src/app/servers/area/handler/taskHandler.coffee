playerManager = require '../../../manager/playerManager'
taskManager = require '../../../manager/taskManager'
fightManager = require '../../../manager/fightManager'
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
          #{pid: player.id, tableId: taskId, sectionId: sectionId, table: 'task_config'}
          {pid: player.id, tableId: taskId, table: 'task_config'}
        , (err, battleLog) ->
          data.battle_log = battleLog

          if not player.task.hasWin
            countSpirit(player, battleLog, 'TASK')
            player.incSpirit battleLog.totalSpirit if battleLog.winner is 'own'

          if battleLog.winner is 'own'
            async.parallel [
              (callback) ->
                taskManager.obtainBattleRewards(player, data, chapterId, battleLog, callback)

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
    data.lv = player.lv
    data.exp = player.exp
    data.spiritor = player.spiritor
    next(null, {code: 200, msg: data})

Handler::updateMomoResult = (msg, session, next) ->
  playerId = session.get('playerId')
  gold = msg.gold

  playerManager.getPlayerInfo {pid: playerId}, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg})

    if gold > player.getMonoGiftTotal()
      return next(null,{code: 501,msg: '获取的元宝数大于实际值'})
    player.clearMonoGift()

    player.increase 'gold', gold
    player.save()
    next(null, {code: 200})

###
任务扫荡
###
Handler::wipeOut = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  type = msg.type or 'task'
  chapterId = msg.chapterId
  console.log 'wipe out:', msg
  if type is 'task' and chapterId? and (chapterId < 1 or chapterId > 50)
    return next(null, {code: 501, msg: '无效参数：chapterId'})

  if ['task', 'pass'].indexOf(type) < 0
    return next(null, {code: 501, msg: '无效参数：type'})

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (player, cb) ->
      taskManager.wipeOut player, type, chapterId, cb
  ], (err, player, rewards) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    player.save()
    next(null, {code: 200, msg: {
      rewards: rewards, 
      mark: player[type]?.mark,
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

  fdata = table.getTableItem('function_limit', 1)
  if fdata? and player.lv < fdata.rank
    return next(null, {code: 501, msg: '10级开放'}) 

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (_player, cb) ->
      player = _player
      layer = if layer? then layer else player.passLayer + 1
      if layer > 100 or layer < 1 or layer > (player.passLayer + 1)
        return cb({code: 501, msg: '不能闯此关'})

      cb(null)

    (cb) =>
      fightManager.pve( {pid: player.id, tableId: layer, table: 'pass_config'}, cb )

    (bl, cb) ->
      ### 第一次经过layer层，才有灵气掉落 ###
      countSpirit(player, bl, 'PASS') if player.passLayer is layer-1
      if bl.winner is 'own'
        rdata = table.getTableItem 'pass_reward', layer
        _.extend bl.rewards, {
          exp: rdata.exp
          money: rdata.money
          skillPoint: rdata.skill_point
        }
        
        updatePlayer(player, bl.rewards, layer)
        checkMysticalPass(player)

      cb(null, bl)

  ], (err, bl) ->
    if err 
      return next(err, {code: err.code or 500, msg: err.msg or ''})

    player.save()

    next(null, {code: 200, msg: {
      battleLog: bl, 
      pass: player.getPass(),
      power: player.power,
      exp: player.exp,
      lv: player.lv,
      spiritor: player.spiritor
    }})

###
  重置关卡
###
Handler::resetPassMark = (msg, session, next) ->

  playerId = session.get('playerId')
  player = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb
    (res,cb) ->
      player = res
      console.log("gold = " , player.gold)
      if player.gold < 200
        return cb({code: 501,msg: '元宝不足'})

      if player.resetPassMark()
         cb()

      else
        return cb({code: 501,msg: '重置关卡次数已用光'})

    (cb) ->
      player.decrease 'gold',200
      cb(null,player.gold)
  ],(err,gold) ->

    if err
      return next(err, {code: err.code or 500, msg: err.msg or ''})

    player.save()

    next(null,{code: 200,msg: {
      canReset:if player.pass.resetTimes > 0 then true else false
      gold:gold
    }})

###
  神秘关卡
###
Handler::mysticalPass = (msg, session, next) ->
  playerId = session.get('playerId')
  #diff = if msg.diff? then msg.diff else 1

  player = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      if not player.pass.mystical.isTrigger or player.pass.mystical.isClear
        return cb({code: 501, msg: '不能闯此神秘关卡'})

      cb()

    (cb) =>
      fightManager.pve {
        pid: player.id,
        tableId: player.pass.mystical.diff,
        table: 'mystical_pass_config'
      }, cb

    (bl, cb) ->
      countSpirit(player, bl, 'PASS')
      if bl.winner is 'own'
        mpcData = table.getTableItem('mystical_pass_config', player.pass.mystical.diff)
        bl.rewards.skillPoint = mpcData.skill_point

        player.increase('skillPoint', mpcData.skill_point)
        player.clearMysticalPass()        
        player.incSpirit(bl.rewards.totalSpirit)
        player.save()

      cb(null, bl)
  ], (err, bl) ->
    if err 
      return next(err, {code: err.code or 500, msg: err.msg or ''})

    next(null, {code: 200, msg: {
      battleLog: bl,
      spiritor: player.spiritor
      hasMystical: player.hasMysticalPass()
    }})

countSpirit = (player, bl, type) ->
  totalSpirit = 0
  _.each bl.cards, (v, k) ->
    return if k <= 6
    
    if v.boss?
      v.spirit = spiritConfig.SPIRIT[type].BOSS
      totalSpirit += spiritConfig.SPIRIT[type].BOSS
    else
      v.spirit = spiritConfig.SPIRIT[type].OTHER
      totalSpirit += spiritConfig.SPIRIT[type].OTHER

  bl.rewards.totalSpirit = totalSpirit if bl.winner is 'own'

checkMysticalPass = (player) ->
  return if player.pass.mystical.isTrigger

  mpc = table.getTableItem 'mystical_pass_config', player.pass.mystical.diff

  if mpc and (player.passLayer >= mpc.layer_from and player.passLayer <= mpc.layer_to) and utility.hitRate(mpc.rate)
    player.triggerMysticalPass()


updatePlayer = (player, rewards, layer) ->
  player.increase('exp', rewards.exp)
  player.increase('money', rewards.money)
  player.increase('skillPoint', rewards.skillPoint)
  player.incSpirit(rewards.totalSpirit)
  player.incPass() if player.passLayer is layer-1
  player.setPassMark(layer)
  player.save()