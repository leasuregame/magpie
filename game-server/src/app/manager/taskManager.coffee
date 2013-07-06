table = require './table'
taskRate = require '../../config/data/taskRate'
utility = require '../common/utility'
dao = require('pomelo').app.get('dao');
_ = require 'underscore'

MAX_POWER = 100

class Manager
  @explore: (player, cb) ->
    task_id = player.task.id
    taskData = table.getTableItem('task', task_id)

    data = {
      result: 'none'
      power_consume: 0
      exp_obtain: 0
      coins_obtain: 0
      upgrade: false
      open_box_card: null
      battle_log: null
    }

    # 检查是否体力充足
    if player.power < taskData.power_consume
      return cb({msg: '体力不足'}, null, null)

    data.result = utility.randomValue( 
      ['fight','box', 'none'],
      [taskRate.fight, taskRate.precious_box, (100 - taskRate.fight - taskRate.precious_box)]
    )

    cb(null, data)

  @openBox: (player, data, cb) ->
    stars = [1,2,3,4]
    rates = _.values(taskRate.open_box.star)
    data.open_box_card = randomCard(utility.randomValue(stars, rates))
    dao.card.createCard {playerId: player.id, tableId: data.open_box_card}, (err, card) ->
      if err
        cb(err)
      else
        card.set('lv', 5)
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
      coins_obtain: taskData.coins_obtain
    }

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