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
logger = require('pomelo-logger').getLogger(__filename)

MAX_POWER = 200

class Manager
  @explore: (player, taskId, cb) ->
    task_id = taskId or player.task.id
    taskData = table.getTableItem('task', task_id)

    data = {
      result: 'none'
      power_consume: 0
      exp_obtain: 0
      money_obtain: 0
      upgrade: false
      open_box_card: null
      battle_log: null
      spiritor: null
      momo: null
    }

    ### 检查是否体力充足 ###
    if player.power.value < taskData.power_consume
      return cb({code: 501,msg: '体力不足'}, null, null)

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
    layer = player.pass.layer

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

    player.increase('exp',  rewards.exp_obtain)
    player.increase('money', rewards.money_obtain)
    player.increase('skillPoint', rewards.skill_point)

    return cb({code: 501, msg: "没有关卡可以扫荡"}) if not isWipeOut
    cb(null, player, rewards)

  @wipeOutTask: (player, chapterId, cb) ->
    rewards = {exp_obtain: 0, money_obtain: 0}

    count_ = (id, rewards) ->
      wipeOutData = table.getTableItem('wipe_out', id)
      rewards.exp_obtain += parseInt(wipeOutData.exp_obtain)
      rewards.money_obtain += parseInt(wipeOutData.money_obtain)
      player.setTaskMark(id)

    if chapterId? and not player.hasTaskMark(chapterId)
      count_(chapterId, rewards)
    else
      taskData = table.getTableItem('task', player.task.id)
      chapterId = taskData.chapter_id
      count_(id, rewards) for id in _.range(1, chapterId) when not player.hasTaskMark(id)
          
    player.increase('exp',  rewards.exp_obtain)
    player.increase('money', rewards.money_obtain)

    cb(null, player, rewards)

  @openBox: (player, data, cb) ->
    _obj = taskRate.open_box.star

    _rd_star = utility.randomValue(_.keys(_obj), _.values(_obj))
    _card_table_id = randomCard(_rd_star)
    
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

    task = utility.deepCopy(player.task)
    if not task.hasWin
      ### 标记为已经赢得战斗 ###
      task.hasWin = true
      player.task = task

      ### the first time win, obtain some spirit ###
      totalSpirit = 0
      _.each battleLog.cards, (v, k) ->
        ### 只计算敌方卡牌 ###
        return if k <= 6

        if v.boss?
          v.spirit = spiritConfig.SPIRIT.TASK.BOSS
          totalSpirit += spiritConfig.SPIRIT.TASK.BOSS
        else
          v.spirit = spiritConfig.SPIRIT.TASK.OTHER
          totalSpirit += spiritConfig.SPIRIT.TASK.OTHER
      battleLog.rewards.totalSpirit = totalSpirit

      player.incSpirit totalSpirit
      data["spiritor"] = player.spiritor

    if utility.hitRate(taskRate.fragment_rate)
      battleLog.rewards.fragment = 1
    else
      battleLog.rewards.fragment = 0

    saveExpCardsInfo player.id, taskData.max_drop_card_number, (err, results) ->
      if err
        logger.error('save exp card for task error: ', err)

      battleLog.rewards.cards = results.map (card) -> card.toJson()

      # 将掉落的卡牌添加到玩家信息
      player.addCards results
      cb()

  @countExploreResult: (player, data, taskId, cb) ->
    taskData = table.getTableItem('task', taskId)
    exp_to_upgrade = table.getTableItem('player_upgrade', player.lv)

    _.extend data, {
      power_consume: taskData.power_consume
      exp_obtain: taskData.exp_obtain
      money_obtain: taskData.coins_obtain
    }

    # 更新玩家money
    player.increase('money', taskData.coins_obtain)
    console.log 'count explore result: ', taskId, player.task
    # 更新任务的进度信息
    # 参数points为没小关所需要探索的层数
    if taskId is player.task.id
      task = utility.deepCopy(player.task)
      task.progress += 1
      if task.progress >= taskData.points
        task.progress = 0
        task.id += 1
        task.hasWin = false
        ### 一大关结束，触发摸一摸功能 ###
        if task.id % 10 is 1 && task.id != 1
          data.momo = player.createMonoGift();
          #task.momo = data.momo;
          console.log(data.momo);
        #data.isMomo = true
      player.set('task', task)

    # 判断是否升级
    if (player.exp + taskData.exp_obtain) >= exp_to_upgrade.exp
      data.upgrade = true

    ### consume power first, then add exp
    because exp change where check if upgrade player level ###
    player.consumePower(taskData.power_consume)
    player.increase('exp', taskData.exp_obtain)

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

randomCard = (star) ->
  ids = _.range(parseInt(star), 250, 5)
  index = _.random(0, ids.length - 1)
  ids[index]

bornPassiveSkill = () ->
  born_rates = psConfig.BORN_RATES
  name = utility.randomValue _.key(born_rates), _.value(born_rates)
  value = _.random(100, psConfig.INIT_MAX * 100)
  return {
    name: name
    value: parseFloat (value/100).toFixed(1)
  }

saveExpCardsInfo = (playerId, count, cb) ->
  cd = taskRate.card_drop
  results = []
  async.times count
    , (n, callback) ->
      dao.card.createExpCard(
        data: {
          playerId: playerId,
          lv: parseInt utility.randomValue _.keys(cd.level), _.values(cd.level)
        }, callback
      )
    , cb

module.exports = Manager