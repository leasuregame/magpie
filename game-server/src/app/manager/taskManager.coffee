table = require './table'
taskRate = require '../../config/data/taskRate'
_ = require 'underscore'

class Manager
  @explore: (player, cb) ->
    [task_id, progress] = parseTask(player.task)
    task = table.getTableItem('task', task_id)
    exp_to_upgrade = table.getTableItem('player_upgrade', player.lv)

    res = {
      result: 'none'
      power_consume: task.power_consume
      exp_obtain: task.exp_obtain
      coins_obtain: task.coins_obtain
      upgrade: false
      card_id: null
      battle_log: null
    }
    rd = _.random(0, 100)
    # 检查是否进入战斗
    if rd <= taskRate.fight
      res.result = 'fight'
    else if taskRate.fight < rd <= (taskRate.fight + taskRate.precious_box)
      # 检查是否获得宝箱
      res.result = 'box'
      res.card_id = openBox()?.id
    else
      res.result = 'none'

    # 更新玩家信息
    player.consumePower(task.power_consume)
    player.increase('money', task.coins_obtain)

    # 判断是否升级
    if (player.exp + task.exp_obtain) >= exp_to_upgrade
      player.exp = 0
      player.increase('lv')
      res.upgrade = true
    else
      player.increase('exp', task.exp_obtain)

    player.save()

    cb(null, player, task_id, res)

parseTask = (mark) ->
  mark.split('#')

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
    if (star.one + star.two + star.three) rd <= 100
      return 4

    return 1

  randomCard(getStar(rd))

randomCard = (star) ->
  ids = _.range(star, 250, 5)
  index = _.random(0, ids.length)
  table.getTableItem('cards', ids[index])

module.exports = Manager