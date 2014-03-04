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
      find_boss: null
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

    saveExpCardsInfo player.id, taskData.max_drop_card_number, firstWin, (err, results) ->
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

  @createPassiveSkillForCard: (card, times, cb) ->
    async.times times
      , (n, next) ->
        ps_data = require('../domain/entity/passiveSkill').born()
        ps_data.cardId = card.id
        dao.passiveSkill.create data: ps_data, (err, ps) ->
          if err
            logger.error 'faild to create passiveSkill, ', err
            return next(err)

          card.addPassiveSkill ps
          next(null, ps)
      , (err, pss) ->
        if err
          return cb(err) 

        card.addPassiveSkills pss

        cb(null, card)
  @seekBoss: (data, player, cb) ->
    player.incBossCount()

    findBossRate = table.getTableItem('values', 'findBossRate')?.value
    if not player.task.boss.found and checkFindBoss(player.task.boss.count, findBossRate)
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
            data.find_boss = res.toJson()
            data.find_boss.finder = player.name
            data.find_boss.killer = null
            player.setBossFound(true)
            cb(null, data)
    else
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

checkFindBoss = (count, findBossRate) ->
  return (count < 20 and utility.hitRate(findBossRate)) or count >= 20

bornPassiveSkill = () ->
  born_rates = psConfig.BORN_RATES
  name = utility.randomValue _.key(born_rates), _.value(born_rates)
  value = _.random(100, psConfig.INIT_MAX * 100)
  return {
    name: name
    value: parseFloat (value/100).toFixed(1)
  }

saveExpCardsInfo = (playerId, count, firstWin, cb) ->
  cd = taskRate.card_drop
  results = []
  async.times count
    , (n, callback) ->
      lv = if firstWin then 15 else parseInt utility.randomValue _.keys(cd.level), _.values(cd.level)
      dao.card.createExpCard(
        data: {
          playerId: playerId,
          lv: lv
        }, callback
      )
    , cb

module.exports = Manager