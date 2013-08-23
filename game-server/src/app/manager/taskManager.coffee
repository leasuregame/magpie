table = require './table'
taskRate = require '../../config/data/taskRate'
psConfig = require '../../config/data/passSkill'
utility = require '../common/utility'
dao = require('pomelo').app.get('dao')
async = require('async')
_ = require 'underscore'
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
      fragment: false
    }

    ### 检查是否体力充足 ###
    if player.power.value < taskData.power_consume
      return cb({code: 501,msg: '体力不足'}, null, null)

    data.result = utility.randomValue( 
      ['fight','box', 'none'],
      [taskRate.fight, taskRate.precious_box, (100 - taskRate.fight - taskRate.precious_box)]
    )

    ### 判断最后一小关，如果没有在这一个章节中获得战斗的胜利，则触发战斗 ###
    if player.task.progress is taskData.points and not player.task.hasWin
      data.result = 'fight'

    cb(null, data, taskData.chapter_id, taskData.section_id)

  @wipeOut: (player, type, cb) ->
    funs = {task: @wipeOutTask, pass: @wipeOutPass}
    funs[type](player, cb)

  @wipeOutPass: (player, cb) ->
    layer = player.pass.layer

    rewards = {exp_obtain: 0, money_obtain: 0, skill_point: 0, gold_obtain: 0}
    isWipeOut = false
    for id in _.range(1, layer)
      if not player.hasPassMark(id)
        data = table.getTableItem('pass_reward', id)
        rewards.exp_obtain += parseInt(data.exp)
        rewards.money_obtain += parseInt(data.money)
        rewards.skill_point += parseInt(data.skill_point)

        # 一定概率获得元宝，百分之5的概率获得10元宝
        if utility.hitRate(5)
          rewards.gold_obtain += 10

        # 标记为已扫荡
        player.setPassMark(id)
        isWipeOut = true

    player.increase('exp',  rewards.exp_obtain)
    player.increase('money', rewards.money_obtain)
    player.increase('gold', rewards.gold_obtain)
    player.increase('skillPoint', rewards.skill_point)

    return cb({code: 501, msg: "没有关卡可以扫荡"}) if not isWipeOut
    cb(null, player, rewards)

  @wipeOutTask: (player, cb) ->
    taskData = table.getTableItem('task', player.task.id)
    chapterId = taskData.chapter_id
    rewards = {exp_obtain: 0, money_obtain: 0, gold_obtain: 0}
    for id in _.range(1, chapterId)
      wipeOutData = table.getTableItem('wipe_out', id)
      rewards.exp_obtain += parseInt(wipeOutData.exp_obtain)
      rewards.money_obtain += parseInt(wipeOutData.money_obtain)

      # 一定概率获得元宝
      if utility.hitRate(taskRate.wipe_out_gold_rate)
        rewards.gold_obtain += taskRate.wipe_out_gold_obtain

    player.increase('exp',  rewards.exp_obtain)
    player.increase('money', rewards.money_obtain)
    player.increase('gold', rewards.gold_obtain)

    cb(null, player, rewards)

  @openBox: (player, data, cb) ->
    _obj = taskRate.open_box.star

    _rd_star = utility.randomValue(_.keys(_obj), _.values(_obj))
    if _rd_star is -1
      data.fragment = true
      return cb()
    else
      _card_table_id = randomCard(_rd_star)
      
    
    async.waterfall [
      (cb) ->
        dao.card.create data: {
          playerId: player.id, 
          tableId: _card_table_id
          star: _rd_star
        }, cb

      (card, cb) =>
        return cb(null, card) if card.star < 3

        times = card.star - 2
        @createPassiveSkillForCard card, times, cb
    ], (err, card) ->
      if err
        logger.error 'faild to create card. ' + err
        return cb(err)

      player.addCard card
      data.open_box_card = card.toJson()
      cb()

  @fightToMonster: (app, session, args, cb) ->
    app.rpc.battle.fightRemote.pve( session, args, cb )

  @obtainBattleRewards: (player, taskId, battleLog, cb) ->
    taskData = table.getTableItem 'task_config', taskId

    ### 标记为已经赢得战斗 ###
    task = _.clone(player.task)
    task.hasWin = true
    player.task = task

    # 奖励掉落卡牌
    ids = taskData.cards.split('#').map (id) ->
      _row = table.getTableItem 'task_card', id
      _row.card_id

    _cards = getRewardCards(ids, taskData.max_drop_card_number)
    
    saveCardsInfo player.id, _cards, (results) ->
      battleLog.rewards.cards = results.map (card) -> card.toJson()

      # 将掉落的卡牌添加到玩家信息
      player.addCards results
      cb()

  @countExploreResult: (player, data, taskId, cb) ->
    taskData = table.getTableItem('task', player.task.id)
    exp_to_upgrade = table.getTableItem('player_upgrade', player.lv)

    _.extend data, {
      power_consume: taskData.power_consume
      exp_obtain: taskData.exp_obtain
      money_obtain: taskData.coins_obtain
    }

    # 更新玩家money
    player.increase('money', taskData.coins_obtain)

    # 更新任务的进度信息
    # 参数points为没小关所需要探索的层数
    if taskId == player.task.id
      task = _.clone(player.task)
      task.progress += 1
      if task.progress > taskData.points
        task.progress = 0
        task.id += 1
        task.hasWin = false
      player.set('task', task)

    # 判断是否升级
    if (player.exp + taskData.exp_obtain) >= exp_to_upgrade.exp
      player.set('exp', 0)
      player.increase('lv')
      player.resumePower('power', MAX_POWER) 
      data.upgrade = true
    else
      player.increase('exp', taskData.exp_obtain)
      player.consumePower(taskData.power_consume)

    cb(null, data)

  @createPassiveSkillForCard: (card, times, cb) ->
    async.times times
      , (n, next) ->
        ps_data = require('../domain/entity/passiveSkill').born()
        ps_data.cardId = card.id
        dao.passiveSkill.create data: ps_data, (err, ps) ->
          if err
            logger.error 'faild to create passiveSkill, ', + err
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
  index = _.random(0, ids.length)
  ids[index]

bornPassiveSkill = () ->
  born_rates = psConfig.BORN_RATES
  name = utility.randomValue _.key(born_rates), _.value(born_rates)
  value = _.random(100, psConfig.INIT_MAX * 100)
  return {
    name: name
    value: parseFloat (value/100).toFixed(1)
  }

getRewardCards = (cardIds, count) ->
  countCardId = (id, star) ->
    _card = table.getTableItem 'cards', id
    if _card.star isnt star
      _card_id = if _card.star > star then (id - 1) else (id + 1)
      return _card_id
    else
      return id

  cd = taskRate.card_drop
  _cards = []
  for i in [1..count]
    _id = utility.randomValue cardIds
    _star = utility.randomValue _.keys(cd.star), _.values(cd.star)
    _level = utility.randomValue _.keys(cd.level), _.values(cd.level)

    _id = countCardId(parseInt(_id), parseInt(_star))
    _cards.push {
      id: _id
      star: parseInt(_star)
      lv: parseInt(_level)
    }
  
  _cards

saveCardsInfo = (playerId, cards, cb) ->
  results = []
  async.each cards
    , (card, callback) ->
      dao.card.create(
        data: {
          playerId: playerId, 
          tableId: card.id, 
          star: card.star,
          lv: card.lv
        }, 
        (err, card) ->
          if err and not card
            return callback(err)

          results.push card
          if card.star >= 3
            createPassiveSkillForCard card, card.star - 2, callback
          else 
            callback()
      )
    , (err) ->
      if err
        console.log err

      cb(results)

module.exports = Manager