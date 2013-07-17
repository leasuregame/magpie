playerManager = require '../../../manager/playerManager'
taskManager = require '../../../manager/taskManager'
table = require '../../../manager/table'
taskRate = require '../../../../config/data/taskRate'
async = require 'async'
_ = require 'underscore'
Card = require '../../../domain/card'
cardConfig = require '../../../../config/data/card'
utility = require '../../../common/utility'
dao = require('pomelo').app.get('dao')

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

###
探索
###
Handler::explore = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  taskId = msg.taskId
  rewards = null
  player = null

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (_player, cb) ->
      player = _player
      taskManager.explore player, taskId, cb

    (data, chapterId, sectionId, cb) =>
      if data.result is 'fight'
        taskManager.fightToMonster(
          @app, 
          session, 
          {pid: player.id, tableId: chapterId, sectionId: sectionId, table: 'task_config'}, 
          (err, battleLog) ->
            data.battle_log = battleLog

            if battleLog.winner is 'own'
              obtainBattleRewards(player, chapterId, battleLog)
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

###
任务扫荡
###
Handler::wipeOut = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  type = msg.type or 'task'

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (player, cb) ->
      taskManager.wipeOut player, type, cb
  ], (err, player, rewards) ->
    if err
      return next(null, {code: 500, msg: err.msg})

    player.save()
    next(null, {code: 200, msg: rewards})

###
精英关卡，闯关
###
Handler::passBarrier = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  passId = msg.passId or 1
  player = null
  pass = 0

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (_player, cb) ->
      player = _player
      if player.pass < passId
        return cb({msg: '不能闯此关'})

      cb(null)

    (cb) =>
      pass = msg.pass or player.pass
      @app.rpc.battle.fightRemote.pve( session, {pid: player.id, tableId: pass, table: 'pass_config'}, cb )

    (bl, cb) ->
      if bl.winner is 'own'
        rdata = table.getTableItem 'pass_reward', pass
        rewards = 
          exp: rdata.exp
          money: rdata.coins
          skillPoint: rdata.skill_point

        bl.rewards = rewards

        player.increase('exp', rewards.exp)
        player.increase('money', rewards.money)
        player.increase('skillPoint', rewards.skillPoint)
        player.increase('pass')
        player.save()
      
      cb(null, bl)

  ], (err, bl) ->
    if err 
      return next(err, {code: 500, msg: err.msg or ''})

    next(null, {code: 200, msg: bl})

obtainBattleRewards = (player, taskId, battleLog) ->
  taskData = table.getTableItem 'task_config', taskId

  # 奖励掉落卡牌
  ids = taskData.cards.split('#').map (id) ->
    _row = table.getTableItem 'task_card', id
    _row.card_id

  _cards = getRewardCards(ids, taskData.max_drop_card_number)
  battleLog.rewards.cards = _cards

  # 将掉落的卡牌添加到玩家信息
  addCardsToPlayer(player, _cards)

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

    console.log "-id-", _id, _star
    _id = countCardId(parseInt(_id), parseInt(_star))
    console.log "=id=", _id
    _cards.push {
      id: _id
      star: parseInt(_star)
      lv: parseInt(_level)
    }
  
  _cards

addCardsToPlayer = (player, cards) ->
  async.each cards, (card) ->
    dao.card.createCard(
      {
        playerId: player.id, 
        talbeId: card.id, 
        star: card.star,
        lv: card.lv
      }, 
      (err, card) ->
        if err is null and card isnt null
          player.addCard card
    )