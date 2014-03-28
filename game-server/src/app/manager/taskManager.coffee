table = require './table'
taskRate = require '../../config/data/taskRate'
psConfig = require '../../config/data/passSkill'
spiritConfig = require '../../config/data/spirit'
utility = require '../common/utility'
entityUtil = require '../util/entityUtil'
dao = require('pomelo').app.get('dao')
async = require('async')
_ = require 'underscore'
fightManager = require './fightManager'
achieve = require '../domain/achievement'
logger = require('pomelo-logger').getLogger(__filename)

class Manager
  @explore: (player, taskId, cb) ->
    task_id = taskId or player.task.id
    taskData = table.getTableItem('task', task_id)

    data = {
      result: 'none'
      power_consume: 0
      exp_obtain: 0
      gold_obtain: 0
      money_obtain: 0
      open_box_card: null
      battle_log: null
      momo: null
      find_boss: false
    }

    ### 检查是否体力充足 ###
    if player.power.value < taskData.power_consume
      return cb({code: 501 ,msg: '体力不足'}, null, null)

    data.result = utility.randomValue(
      ['fight','box', 'none'],
      [taskRate.fight, taskRate.precious_box, (100 - taskRate.fight - taskRate.precious_box)]
    )

    ### 判断最后一小关，如果没有在这一个章节中获得战斗的胜利，则触发战斗 ###
    if player.task.progress is (taskData.points - 1) and not player.task.hasWin
      data.result = 'fight'

    cb(null, data, taskData.chapter_id, taskData.section_id)

  @wipeOut: (player, type, chapterId, cb) ->
    if type is 'pass'
      @wipeOutPass player, cb
    else if type is 'task'
      @wipeOutTask player, chapterId, cb

  @wipeOutPass: (player, cb) ->
    layer = player.passLayer

    rewards = {exp_obtain: 0, money_obtain: 0, skill_point: 0}
    isWipeOut = false
    for id in _.range(1, layer + 1)
      if not player.hasPassMark(id)
        data = table.getTableItem('pass_reward', id)
        rewards.exp_obtain += parseInt(data.exp)
        rewards.money_obtain += parseInt(data.money)
        rewards.skill_point += parseInt(data.skill_point)
        # 标记为已扫荡
        player.setPassMark(id)
        isWipeOut = true

    # player.increase('exp',  rewards.exp_obtain)
    player.increase('money', rewards.money_obtain)
    player.increase('skillPoint', rewards.skill_point)

    return cb({code: 501, msg: "没有关卡可以扫荡"}) if not isWipeOut
    cb(null, player, rewards)

  @wipeOutTask: (player, chapterId, cb) ->
    rewards = {money_obtain: 0}

    count_ = (id, rewards) ->
      wipeOutData = table.getTableItem('wipe_out', id)
      rewards.money_obtain += parseInt(wipeOutData.money_obtain)
      player.setTaskMark(id)

    if chapterId? and player.hasTaskMark(chapterId)
      return cb({code: 501, msg: '已扫荡'})

    if chapterId? and not player.hasTaskMark(chapterId)
      count_(chapterId, rewards)
    else
      taskData = table.getTableItem('task', player.task.id)
      chapterId = taskData.chapter_id
      count_(id, rewards) for id in _.range(1, chapterId) when not player.hasTaskMark(id)
          
    player.increase('money', rewards.money_obtain)

    cb(null, player, rewards)

  @openBox: (player, data, cb) ->
    _obj = taskRate.open_box.star

    _rd_star = parseInt utility.randomValue(_.keys(_obj), _.values(_obj))
    _card_table_id = entityUtil.randomCardId(_rd_star, player.lightUpCards())
    
    entityUtil.createCard {
      star: _rd_star
      tableId: _card_table_id
      playerId: player.id
    }, (err, card) ->
      if err
        logger.error 'faild to create card. ' + err
        return cb(err)

      player.addCard card
      data.open_box_card = card.toJson()
      cb()

  @fightToMonster: (args, cb) ->
    fightManager.pve( args, cb )

  @obtainBattleRewards: (player, data, taskId, battleLog, cb) ->
    taskData = table.getTableItem 'task_config', taskId

    firstWin = false
    task = utility.deepCopy(player.task)
    if not task.hasWin
      ### 标记为已经赢得战斗 ###
      task.hasWin = true
      player.task = task

      if task.id == 1
        firstWin = true # 第一小关第一次赢
        data.first_win = true
        ### 第一次战斗胜利奖励5000仙币 ###
        player.increase('money', 5000)
        data.money_obtain += 5000

    ### 每次战斗结束都有10%的概率获得5魔石 ###
    if utility.hitRate(taskRate.gold_obtain.rate)
      player.increase('gold', taskRate.gold_obtain.value)
      battleLog.rewards.gold = taskRate.gold_obtain.value  

    saveExpCardsInfo player.id, player.lv, taskData.max_drop_card_number, firstWin, (err, results) ->
      if err
        logger.error('save exp card for task error: ', err)

      battleLog.rewards.cards = results.map (card) -> card.toJson()

      # 将掉落的卡牌添加到玩家信息
      player.addCards results
      cb()

  @countExploreResult: (player, data, taskId, chapterId, cb) ->
    taskData = table.getTableItem('task', taskId)

    times = 1
    isDouble = false
    # 暴击仙币和经验翻倍
    if utility.hitRate 10
      times = 2
      isDouble = true

    data.power_consume += taskData.power_consume
    data.exp_obtain += taskData.exp_obtain * times
    data.money_obtain += taskData.coins_obtain * times
    data.isDouble = isDouble

    # 更新玩家money
    player.increase('money', data.money_obtain)
    # 更新任务的进度信息
    # 参数points为没小关所需要探索的层数
    if taskId is player.task.id
      if taskId is 500 and player.task.progress is taskData.points
        ### 全部通关，do nothing ###
        return cb(null, data)
      else
        if taskId < 4
          ### 十步之遥 成就奖励 ###
          achieve.taskPoinTo(player)

        task = utility.deepCopy(player.task)
        task.progress += 1
        if task.progress >= taskData.points
          if taskId%10 is 0
            ### 一大关结束，触发摸一摸功能 ###
            data.momo = player.createMonoGift()
            ### 通关成就 ###
            achieve.taskChapterPassTo(player, chapterId)
            achieve.taskPartPassTo(player, chapterId)

          if task.id < 500
            task.progress = 0
            task.id += 1 
            task.hasWin = false

          rew = table.getTableItem('task_through_reward', task.id-1)
          if not rew
            logger.error('can not find throught reward by id', task.id-1)
          data.through_reward = {money: rew?.money_obtain}
          player.increase('money', rew?.money_obtain or 0)
        player.set('task', task)

    ### consume power first, then add exp
    because exp change will check if upgrade player level ###
    player.consumePower(data.power_consume)

    ###  判断是否升级 ###
    entityUtil.upgradePlayer player, data.exp_obtain, (isUpgrade, level9Box, rewards) ->
      if isUpgrade
        data.upgradeInfo = {
          lv: player.lv
          rewards: rewards
          friendsCount: player.friendsCount
        }
      if level9Box?
        data.level9Box = level9Box

      cb(null, data)
        
  @seekBoss: (data, player, cb) ->
    ### boss等级限制判断 ###
    boss_limit_level = table.getTableItem('function_limit', 1)?.boss or 1
    if player.lv < boss_limit_level
      return cb(null, data)

    player.incBossCount()

    if not player.task.boss.found and checkFindBoss(player.task.boss.count)
      typeRates = table.getTable('boss_type_rate')
      ids = typeRates.map (r) -> r.id
      rates = typeRates.map (r) -> r.rate
      type = utility.randomValue(ids, rates)
      bossInfo = getBossInfo(type)
      if not bossInfo
        logger.error('找不到boss卡牌')
        cb(null, data)
      else
        bossData = table.getTableItem('boss_card', bossInfo.boss_id)
        dao.boss.create data: {
          tableId: bossInfo.id
          playerId: player.id
          finder: player.name
          hp: lineUpToObj(bossInfo.formation)
        }, (err, res) ->
          if err
            logger.error('创建Boss信息出错', err.stack)
            cb(null, data)
          else
            data.find_boss = true
            player.setBossFound(true)
            cb(null, data)
    else
      dao.boss.bossExists player.id, (err, exists) ->
        if not exists and player.task.boss.found
          player.setBossFound(false)
          player.incBossCount()
        
        cb(null, data)

lineUpToObj = (lineUp) ->
  _results = {}
  if _.isString(lineUp) and lineUp isnt ''
    lines = lineUp.split(',')
    lines.forEach (l) ->
      [pos, num] = l.split(':')
      _results[positionConvert(pos)] = 
        cardId: parseInt(num)
        hp: table.getTableItem('boss_card', num).hp

  _results

positionConvert = (val) ->
  order = ['00', '01', '02', '10', '11', '12']
  order.indexOf(val) + 1

getBossInfo = (type) ->
  results = table.getTable('boss').filter (id, item) -> item.type is type
  if results.length > 0
    idx = _.random(0, results.length-1)
    return results[idx]
  else 
    return null

checkFindBoss = (count) ->
  rate = table.getTableItem('boss_find_rate', count)?.rate or 1
  return utility.hitRate(rate)

saveExpCardsInfo = (playerId, playerLv, count, firstWin, cb) ->
  results = []
  async.times count
    , (n, callback) ->
      lv = if firstWin then 15 else parseInt genCardLv(playerLv)
      dao.card.createExpCard(
        data: {
          playerId: playerId,
          lv: lv
        }, callback
      )
    , cb

genCardLv = (playerLv) ->
  CD = taskRate.CARD_DROP
  lvs = _.keys(CD).sort (x, y) -> parseInt(y) - parseInt(x)
  
  lv = lvs[0]
  for l in lvs 
    if playerLv >= l
      lv = l
      break

  parseInt utility.randomValue _.keys(CD[lv]), _.values(CD[lv])

module.exports = Manager