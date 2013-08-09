playerManager = require '../../../manager/playerManager'
taskManager = require '../../../manager/taskManager'
table = require '../../../manager/table'
taskRate = require '../../../../config/data/taskRate'
async = require 'async'
_ = require 'underscore'
Card = require '../../../domain/entity/card'
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
          {pid: player.id, tableId: chapterId, sectionId: sectionId, table: 'task_config'}
        , (err, battleLog) ->
          data.battle_log = battleLog

          if battleLog.winner is 'own'
            async.parallel [
              (callback) ->
                obtainBattleRewards(player, chapterId, battleLog, callback)

              (callback) ->
                taskManager.countExploreResult player, data, callback
            ], (err, results) ->
              cb(err, results[1])
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
      return next(null, {code: err.code or 500, msg: err.msg})

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
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    player.save()
    next(null, {code: 200, msg: {rewards: rewards, pass: player.pass}})

###
精英关卡，闯关
###
Handler::passBarrier = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  layer = msg.layer
  player = null

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (_player, cb) ->
      player = _player
      layer = if layer? then layer else player.pass.layer + 1
      if layer > 100 or layer < 1 or layer > (player.pass.layer + 1)
        return cb({code: 501, msg: '不能闯此关'})

      cb(null)

    (cb) =>
      @app.rpc.battle.fightRemote.pve( session, {pid: player.id, tableId: layer, table: 'pass_config'}, cb )

    (bl, cb) ->
      if bl.winner is 'own'
        rdata = table.getTableItem 'pass_reward', layer
        rewards = 
          exp: rdata.exp
          money: rdata.coins
          skillPoint: rdata.skill_point

        bl.rewards = rewards

        player.increase('exp', rewards.exp)
        player.increase('money', rewards.money)
        player.increase('skillPoint', rewards.skillPoint)
        player.incPass() if player.pass.layer is layer-1
        player.setPassMark(layer)
        player.save()
      
      cb(null, bl)

  ], (err, bl) ->
    if err 
      return next(err, {code: err.code or 500, msg: err.msg or ''})
    
    next(null, {code: 200, msg: {battleLog: bl, pass: player.pass}})

obtainBattleRewards = (player, taskId, battleLog, cb) ->
  taskData = table.getTableItem 'task_config', taskId

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
          callback()
      )
    , (err) ->
      if err
        console.log err

      cb(results)
