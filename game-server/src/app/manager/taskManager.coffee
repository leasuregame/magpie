table = require './table'
taskRate = require '../../config/data/taskRate'
utility = require '../common/utility'
dao = require('pomelo').app.get('dao')
_ = require 'underscore'

MAX_POWER = 100

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

    # 检查是否体力充足
    if player.power < taskData.power_consume
      return cb({msg: '体力不足'}, null, null)

    data.result = utility.randomValue( 
      ['fight','box', 'none'],
      [taskRate.fight, taskRate.precious_box, (100 - taskRate.fight - taskRate.precious_box)]
    )

    cb(null, data, taskData.chapter_id)

  @wipeOut: (player, type, cb) ->
    funs = {task: @wipeOutTask, pass: @wipeOutPass}
    funs[type](player, cb)

  @wipeOutPass: (player, cb) ->
    pass = player.pass

    rewards = {exp_obtain: 0, money_obtain: 0, skill_point: 0, gold_obtain: 0}
    isWipeOut = false
    for id in _.range(1, pass)
      if not player.getPassMarkByIndex(id)
        data = table.getTableItem('pass_reward', id)
        rewards.exp_obtain += parseInt(data.exp)
        rewards.money_obtain += parseInt(data.money)
        rewards.skill_point += parseInt(data.skill_point)

        # 一定概率获得元宝，百分之5的概率获得10元宝
        if utility.hitRate(5)
          rewards.gold_obtain += 10

        # 标记为已扫荡
        player.setPsssMarkByIndex(id)
        isWipeOut = true

    player.increase('exp',  rewards.exp_obtain)
    player.increase('money', rewards.money_obtain)
    player.increase('gold', rewards.gold_obtain)
    player.increase('skillPoint', rewards.skill_point)

    return cb(null, player, "没有关卡可以扫荡") if not isWipeOut
    cb(null, player, rewards)

  @wipeOutTask: (player, cb) ->
    taskData = table.getTableItem('task', player.task.id)
    chapterId = taskData.chapter_id
    console.log player.task, chapterId
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

    _res = randomCard(utility.randomValue(_.keys(_obj), _.values(_obj)))
    data.open_box_card = _res if _res > 0
    data.fragment = true if _res is -1
    dao.card.createCard {playerId: player.id, tableId: data.open_box_card}, (err, card) ->
      if err
        cb(err)
      else    
        player.addCard card
        cb(null)

  @fightToMonster: (app, session, args, cb) ->
    app.rpc.battle.fightRemote.pve( session, args, cb )

  @countExploreResult: (player, data, cb) ->
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
    task = _.clone(player.task)
    task.progress += 1
    if task.progress > taskData.points
      task.progress = 0
      task.id += 1
    player.set('task', task)

    # 判断是否升级
    if (player.exp + taskData.exp_obtain) >= exp_to_upgrade.exp
      player.set('exp', 0)
      player.increase('lv')
      player.set('power', MAX_POWER) 
      data.upgrade = true
    else
      player.increase('exp', taskData.exp_obtain)
      player.consumePower(taskData.power_consume)

    cb(null, data)

randomCard = (star) ->
  ids = _.range(star, 250, 5)
  index = _.random(0, ids.length)
  ids[index]

module.exports = Manager