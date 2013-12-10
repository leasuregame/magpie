playerManager = require('pomelo').app.get('playerManager')
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
entityUtil = require '../../../util/entityUtil'
dao = require('pomelo').app.get('dao')
achieve = require '../../../domain/achievement'

MAX_CARD_COUNT = table.getTableItem('resource_limit', 1).card_count_limit

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
      taskId = player.task.id unless taskId?

      if _.keys(player.cards).length >= MAX_CARD_COUNT
        return cb({code: 501, msg: '卡牌容量已经达到最大值'})

      if taskId > player.task.id 
        return cb({code: 501, msg: '不能探索此关'})

      taskManager.explore player, taskId, cb

    (data, chapterId, sectionId, cb) =>
      if data.result is 'fight'
        taskManager.fightToMonster(
          {pid: player.id, tableId: taskId, table: 'task_config'}
        , (err, battleLog) ->
          data.battle_log = battleLog

          if not player.task.hasWin
            countSpirit(player, battleLog, 'TASK')
            player.incSpirit battleLog.totalSpirit if battleLog.winner is 'own'      

          if battleLog.winner is 'own'
            checkFragment(battleLog, player, chapterId)
            async.parallel [
              (callback) ->
                taskManager.obtainBattleRewards(player, data, chapterId, battleLog, callback)

              (callback) ->
                taskManager.countExploreResult player, data, taskId, chapterId, callback
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
            taskManager.countExploreResult player, data, taskId, chapterId, cb
      else
        taskManager.countExploreResult player, data, taskId, chapterId, cb
  ], (err, data) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg})

    player.save()
    data.task = player.getTask()
    data.power = player.power
    data.exp = player.exp
    next(null, {code: 200, msg: data})

    saveBattleLog(@app, playerId, taskId, 'pve_task', data.battle_log) if data.battle_log?

Handler::updateMomoResult = (msg, session, next) ->
  playerId = session.get('playerId')
  gold = msg.gold

  playerManager.getPlayerInfo {pid: playerId}, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg})

    if gold > player.getMonoGiftTotal()
      return next(null,{code: 501,msg: '获取的魔石数大于实际值'})
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
    return next(null, {code: 501, msg: "无效参数：#{chapterId}"})

  if ['task', 'pass'].indexOf(type) < 0
    return next(null, {code: 501, msg: "无效参数：#{type}"})

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (player, cb) ->
      taskManager.wipeOut player, type, chapterId, cb
  ], (err, player, rewards) ->
    if err
      console.log 'wipe out error: ', err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    upgradeInfo = null
    level9Box = null
    entityUtil.upgradePlayer player, rewards.exp_obtain, (isUpgrade, box, rew) ->
      if isUpgrade
        upgradeInfo = {
          lv: player.lv
          rewards: rew
          friendsCount: player.friendsCount
        }
      if box
        level9Box = box

    player.save()
    next(null, {code: 200, msg: {
      rewards: rewards
      mark: player[type]?.mark
      power: player.power
      exp: player.exp
      upgradeInfo: upgradeInfo if upgradeInfo
      level9Box: level9Box if level9Box
    }})

###
精英关卡，闯关
###
Handler::passBarrier = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  layer = msg.layer
  player = null
  firstWin = false
  oldLayer = -10

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (_player, cb) ->
      player = _player
      oldLayer = player.passLayer

      fdata = table.getTableItem('function_limit', 1)
      if fdata? and player.lv < fdata.pass
        return next(null, {code: 501, msg: fdata.pass+'级开放'}) 

      layer = if layer? then layer else player.passLayer + 1
      layer = 100 if layer > 100
      if layer > 100 or layer < 1 or layer > (player.passLayer + 1)
        return cb({code: 501, msg: '不能闯此关'})

      cb(null)

    (cb) =>
      fightManager.pve( {pid: player.id, tableId: layer, table: 'pass_config'}, cb )

    (bl, cb) ->
      ### 第一次经过layer层，才有灵气掉落 ###
      countSpirit(player, bl, 'PASS') if player.passLayer is layer-1
      upgradeInfo = null
      level9Box = null
      if bl.winner is 'own'
        rdata = table.getTableItem 'pass_reward', layer
        _.extend bl.rewards, {
          exp: rdata.exp
          money: rdata.money
          skillPoint: rdata.skill_point
        }

        updatePlayer(player, bl.rewards, layer)
        checkMysticalPass(player)
        entityUtil.upgradePlayer player, bl.rewards.exp, (isUpgrade, box, rewards) ->
          if isUpgrade
            upgradeInfo = {
              lv: player.lv
              rewards: rewards
              friendsCount: player.friendsCount
            }
          if box
            level9Box = level9Box

        if layer is 1 and oldLayer is layer-1
          ### 天道首胜 成就 ###
          achieve.passFirstWin(player)
          firstWin = true

      cb(null, bl, upgradeInfo, level9Box)

  ], (err, bl, upgradeInfo, level9Box) ->
    if err 
      return next(err, {code: err.code or 500, msg: err.msg or ''})

    player.save()

    next(null, {code: 200, msg: {
      battleLog: bl, 
      upgradeInfo: upgradeInfo if upgradeInfo
      level9Box: level9Box if level9Box
      pass: player.getPass(),
      power: player.power,
      exp: player.exp,
      firstWin: firstWin if firstWin
    }})

    saveBattleLog(@app, playerId, layer, 'pve_pass', bl) if bl?

###
  重置关卡
###
Handler::resetPassMark = (msg, session, next) ->
  playerId = session.get('playerId')
  player = null
  goldResume = 200
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb
    (res,cb) ->
      player = res
      if player.gold < goldResume
        return cb({code: 501,msg: '魔石不足'})

      if not player.canResetPassMark()
        return cb({code: 501, msg: '没有关卡可以重置'})

      if player.resetPassMark()
         cb()
      else
        return cb({code: 501,msg: '重置关卡次数已用光'})

    (cb) ->
      player.decrease 'gold', goldResume
      cb(null, player.gold)
  ],(err,gold) ->

    if err
      return next(err, {code: err.code or 500, msg: err.msg or ''})

    player.save()

    next(null, {code: 200, msg: {
      canReset: if player.pass.resetTimes > 0 then true else false
      gold: gold
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
      battleLog: bl
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

  if mpc and player.passLayer < mpc.layer_from
    return
  else if mpc and player.passLayer is mpc.layer_to and not player.pass.mystical.isTrigger
    player.triggerMysticalPass()
  else if utility.hitRate(mpc.rate)
    player.triggerMysticalPass()

updatePlayer = (player, rewards, layer) ->
  player.increase('money', rewards.money)
  player.increase('skillPoint', rewards.skillPoint)
  player.incSpirit(rewards.totalSpirit)
  player.incPass() if player.passLayer is layer-1
  player.setPassMark(layer)
  player.save()

checkFragment = (battleLog, player, chapterId) ->  
  if(
    player.task.hasFragment != parseInt(chapterId) and 
    ( utility.hitRate(taskRate.fragment_rate) or player.task.id%10 is 0 )
    )
    battleLog.rewards.fragment = 1
    task = utility.deepCopy(player.task)
    task.hasFragment = parseInt(chapterId)
    player.set('task', task)
    player.increase('fragments')
  else 
    battleLog.rewards.fragment = 0

saveBattleLog = (app, pid, eid, type, bl) ->
  app.get('dao').battleLog.create {
    data: {
      playerId: pid
      enemy: eid
      type: type
      battleLog: bl
    }
  }, (err, res) ->
    if err
      logger.error '[faild to save battleLog]', err
    