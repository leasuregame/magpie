table = require './table'
taskRate = require '../../config/data/taskRate'
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

    rd = _.random(0, 100)
    # 检查是否进入战斗
    if rd <= taskRate.fight
      res.result = 'fight'
    else if taskRate.fight < rd <= (taskRate.fight + taskRate.precious_box)
      # 检查是否获得宝箱
      res.result = 'box'
      res.open_box_card = openBox()
    else
      res.result = 'none'

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

updateTask = (player, poins) ->
  # 更新任务的进度信息
  # 参数poins为没小关所需要探索的层数
  task = player.task
  task.progress += 1
  if task.progress > poins
    task.progress = 0
    task.id += 1

  player.set('task', task)

openBox = () ->
  star = taskRate.open_box.star
  rd = _.random(0, 100)

  getStar = (rd) ->
    if rd <= star.one
      return 1
    if star.one < rd <= (star.one + star.two)
      return 2
    if (star.one + star.two) < rd < (star.one + star.two + star.three)
      return 3
    if (star.one + star.two + star.three) < rd <= 100
      return 4

    return 1

  randomCard(getStar(rd))

randomCard = (star) ->
  ids = _.range(star, 250, 5)
  index = _.random(0, ids.length)
  ids[index]

module.exports = Manager