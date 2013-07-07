playerManager = require '../../../manager/playerManager'
taskManager = require '../../../manager/taskManager'
table = require '../../../manager/table'
taskRate = require '../../../../config/data/taskRate'
async = require 'async'
_ = require 'underscore'
Card = require '../../../domain/card'
cardConfig = require '../../../../config/data/card'
utility = require '../../../common/utility'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::explore = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  rewards = null
  player = null

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (_player, cb) ->
      player = _player
      taskManager.explore player, cb

    (data, cb) =>
      if data.result is 'fight'
        taskManager.fightToMonster(
          @app, 
          session, 
          {pid: player.id, tableId: player.task.id, table: 'task_config'}, 
          (err, battleLog) ->
            data.battle_log = battleLog

            if battleLog.winner is 'own'
              obtainBattleRewards(player, battleLog)
              taskManager.countExploreResult player, data, cb
            else
              cb(null, data)
        )
      else if data.result is 'box'
        taskManager.openBox player, data, (err) ->
          if err
            cb(err, null)
          else
            taskManager.countExploreResult player, data, cb
      else
        taskManager.countExploreResult player, data, cb
  ], (err, data) ->
    if err
      return next(null, {code: 500, msg: err.msg})

    player.save()
    next(null, {code: 200, msg: data})

Handler::passBarrier = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  player = null
  pass = 0

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (_player, cb) =>
      player = _player
      pass = msg.pass or player.pass
      @app.rpc.battle.fightRemote.pve( session, {pid: player.id, tableId: pass, table: 'pass_config'}, cb )

    (bl, cb) ->
      if bl.winner is 'own'
        rdata = table.getTableItem 'pass_reward', pass
        rewards = 
          exp: rdata.exp
          money: rdata.coins
          skillPoins: rdata.skill_poins

        bl.rewards = rewards

        player.increase('exp', rewards.exp)
        player.increase('money', rewards.money)
        player.increase('skillPoins', rewards.skillPoins)
        player.save()
      
      cb(null, bl)

  ], (err, bl) ->
    if err 
      return next(err, {code: 500})

    next(null, {code: 200, msg: bl})

Handler::luckyCard = (msg, session, next) ->
  


obtainBattleRewards = (player, battleLog) ->
  taskData = table.getTableItem 'task_config', player.task.id
  
  # 奖励掉落卡牌
  _cards = getRewardCards(taskData.cards.split('#'), taskData.max_drop_card_number)
  battleLog.rewards.cards = _cards

  # 将掉落的卡牌添加到玩家信息
  addCardsToPlayer(player, _cards)

getRewardCards = (cardIds, count) ->
  cd = taskRate.card_drop
  
  _cards = []
  for i in [1..count]
    id = utility.randomValue cardIds
    star = utility.randomValue [1,2], _.values(cd.star)
    level = utility.randomValue [1,2,3,4,5], _.values(cd.level)

    _cards.push {
      id: parseInt(id)
      star: star
      lv: level
    }
  
  _cards

addCardsToPlayer = (player, cards) ->
  async.each cards, (card) ->
    dao.card.createCard(
      {
        playerId: player.id, 
        talbeId: card.id, 
        star: card.star,
        lv: card.lv,
        type: cardConfig.TYPE.MONSTER
      }, 
      (err, card) ->
        if err is null and card isnt null
          player.addCard card
    )