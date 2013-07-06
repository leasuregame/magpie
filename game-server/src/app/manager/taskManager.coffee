table = require './table'
taskRate = require '../../config/data/taskRate'
utility = require '../common/utility'
_ = require 'underscore'

MAX_POWER = 100

class Manager
  @explore: (player, cb) ->
    task_id = player.task.id
    progress = player.task.progress
    taskData = table.getTableItem('task', task_id)
    exp_to_upgrade = table.getTableItem('player_upgrade', player.lv)

    res = {
      result: 'none'
      power_consume: taskData.power_consume
      exp_obtain: taskData.exp_obtain
      coins_obtain: taskData.coins_obtain
      upgrade: false
      open_box_card: null
      battle_log: null
    }

    # 检查是否体力充足
    if player.power < taskData.power_consume
      return cb({msg: '体力不足'}, null, null)

    res.result = utility.randomValue( 
      ['fight','box', 'none'],
      [taskRate.fight, taskRate.precious_box, (100 - taskRate.fight - taskRate.precious_box)]
    )

    if res.result is 'box'
      res.open_box_card = Manager.openBox()

    # 更新玩家信息
    player.increase('money', taskData.coins_obtain)
    updateTask(player, taskData.poins)

    # 判断是否升级
    if (player.exp + taskData.exp_obtain) >= exp_to_upgrade.exp
      player.set('exp', 0)
      player.increase('lv')
      player.set('power', MAX_POWER) 
      res.upgrade = true
    else
      player.increase('exp', taskData.exp_obtain)
      player.consumePower(taskData.power_consume)

    cb(null, player, res)

  @openBox: (cb)->
    stars = [1,2,3,4]
    rates = _.values(taskRate.open_box.star)
    randomCard(utility.randomValue(stars, rates))


  @fightToMonster: (app, session, args, cb) ->
    app.rpc.battle.fightRemote.pve( session, args, cb )

  @countExploreResult: (player, result, cb) ->
    taskData = table.getTableItem('task', player.task.id)
    exp_to_upgrade = table.getTableItem('player_upgrade', player.lv)

    # 更新玩家money
    player.increase('money', taskData.coins_obtain)

    # 更新任务的进度信息
    # 参数poins为没小关所需要探索的层数
    task = _.clone(player.task)
    task.progress += 1
    if task.progress > taskData.poins
      task.progress = 0
      task.id += 1
    player.set('task', task)

    # 判断是否升级
    if (player.exp + taskData.exp_obtain) >= exp_to_upgrade.exp
      player.set('exp', 0)
      player.increase('lv')
      player.set('power', MAX_POWER) 
      result.upgrade = true
    else
      player.increase('exp', taskData.exp_obtain)
      player.consumePower(taskData.power_consume)

    cb(null, player, res)

randomCard = (star) ->
  ids = _.range(star, 250, 5)
  index = _.random(0, ids.length)
  ids[index]

module.exports = Manager