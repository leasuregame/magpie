playerManager = require '../../../manager/playerManager'
taskManager = require '../../../manager/taskManager'
table = require '../../../manager/table'
taskRate = require '../../../../config/data/taskRate'
async = require 'async'
_ = require 'underscore'
Card = require '../../../domain/card'
cardConfig = require '../../../../config/data/card'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::explore = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  rewards = null
  player = null

  getPlayer = (cb) ->
    playerManager.getPlayerInfo {pid: playerId}, cb

  executeExpolore = (player, cb) ->
    taskManager.explore player, cb

  checkFight = (_player, data, cb) =>
    player = _player
    rewards = data
    if rewards.result is 'fight'
      @app.rpc.battle.fightRemote.pve( session, {pid: player.id, tableId: player.task.id, table: 'task_config'}, cb )
    else
      cb(null, null)

  addBattleLogIfFight = (bl, cb) ->
    if bl?
      obtainBattleRewards(player, bl)
      rewards.battle_log = bl
    cb(null)

  async.waterfall([
    getPlayer,
    executeExpolore,
    checkFight,
    addBattleLogIfFight
    ], (err) ->
      if err
        next(null, {code: 500, msg: err.msg})
        return

      player.save()
      next(null, {code: 200, msg: rewards})
  )

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

    player.save()
    next(null, {code: 200, msg: bl})


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
    id = randomValue cardIds
    star = randomValue [1,2], _.values(cd.star)
    level = randomValue [1,2,3,4,5], _.values(cd.level)

    _cards.push {
      id: parseInt(id)
      star: star
      lv: level
    }
  
  _cards

randomValue = (values, rates) ->
  if rates?
    _rates = []
    _r = 0
    for r in rates
      _rates.push _r += r

    rd = _.random(0, 100)
    for r, i in _rates
      if rd <= r
        return values[i]
  else if values.length > 0
    return values[_.random(0, (values.length - 1))]
  else # default
    values[0]

addCardsToPlayer = (player, cards) ->
  for card in cards
    player.addCard( new Card
      tableId: card.id
      lv: card.lv
      star: card.star
      type: cardConfig.TYPE.MONSTER
    )
  return 