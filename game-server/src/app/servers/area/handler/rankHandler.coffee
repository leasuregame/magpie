app = require('pomelo').app
playerManager = require '../../../manager/playerManager'
rankManager = require '../../../manager/rankManager'
fightManager = require '../../../manager/fightManager'
table = require '../../../manager/table'
async = require 'async'
logger = require('pomelo-logger').getLogger(__filename)
msgConfig = require '../../../../config/data/message'
_ = require 'underscore'

INTERVALS = 
  10000: 106
  7000: 83
  5000: 62
  3000: 41
  1000: 19
  700: 14
  300: 11
  199: 5
  1: 1

STATUS_NORMAL = 0
STATUS_CHALLENGE = 1
STATUS_COUNTER_ATTACK = 2

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::rankingList = (msg, session, next) ->
  playerId = msg.playerId or session.get('playerId')
  
  player = null
  async.waterfall [
    (cb) =>
      playerManager.getPlayerInfo {pid: playerId}, cb
    (res, cb) ->
      player = res
      cb()
    (cb) ->
      rankings = genRankings(player.rank.ranking)
      playerManager.rankingList _.keys(rankings), (err, players) ->
        cb(err, players, rankings)

    (players,rankings,cb) ->

      flag = []

      for p in players when p.id isnt playerId and p.id in player.rank.recentChallenger
        rankings[p.rank.ranking] = STATUS_COUNTER_ATTACK
        flag.push p.id

      plys = _.difference(player.rank.recentChallenger,flag)


      playerManager.getPlayers plys, (err, ply) ->
        rank = {}

        for key , value of ply
          players.push value
          rank[value.rank.ranking] = STATUS_COUNTER_ATTACK

        cb(err, players, _.extend(rankings,rank))


  ], (err, players, rankings) ->

    if err
      return next(null, {code: err.code, msg: err.message})

    players = filterPlayersInfo(players, rankings)
    players.sort (x, y) -> x.ranking - y.ranking
    rank = {
      ranking: player.getRank().ranking,
      rankReward: player.getRank().rankReward,
      challengeCount: player.dailyGift.challengeCount,
      rankList: players
    }
    next(null,{code: 200, msg: {rank: rank}})
    #next(null, {code: 200, msg: players})

Handler::challenge = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  playerName = session.get('playerName')
  targetId = msg.targetId

  player = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      fdata = table.getTableItem('function_limit', 1)
      if player.lv < fdata.rank
        return cb({code: 501, msg: fdata.rank+'级开放'})
      cb()

    (cb) =>
      fightManager.pvp {playerId: playerId, targetId: targetId}, cb

    (bl, cb) =>
      isWin =  bl.winner == 'own'
      if isWin and isV587(bl)
        achieve.v587(player)

      rankManager.exchangeRankings player, targetId, isWin, (err, res, rewards) ->
        if err and not res
          return cb(err)
        else
          return cb(null, rewards, bl)

  ], (err, rewards, bl) ->
      if err
        return next(null, {code: err.code, msg: err.msg or err.message})

      bl.rewards = rewards
      next(null, {code: 200, msg: {
        battleLog: bl,
        lv: player.lv,
        exp: player.exp
      }})

      saveBattleLog(bl, playerName)

Handler::fight = (msg, session, next) ->
  playerId = session.get('playerId')
  targetId = msg.targetId

  fightManager.pvp {playerId: playerId, targetId: targetId}, (err, bl) ->
    if err
      return next(null, {code: 501, msg: err.msg or err})

    next(null, {code: 200, msg: battleLog: bl})

Handler::getRankingReward = (msg, session, next) ->
  playerId = session.get('playerId')
  ranking = msg.ranking

  playerManager.getPlayerInfo {pid: playerId}, (err, player) ->
    if err
      return next(null, {code: err.code, msg: err.msg or err.message})

    rank = player.rank
    if rank.historyRanking is 0 or rank.historyRanking > ranking
      return next(null, {code: 501, msg: '不能领取该排名奖励'})

    rank.getRankingReward(ranking)
    rewardData = table.getTableItem('ranking_reward', ranking)
    if not rewardData
      return next(null, {code: 501, msg: "找不到#{ranking}的排名奖励"})
    player.increase('elixir', rewardData.elixir)
    player.save()
    next(null, {code: 200, msg: rankingRewards: player.rank?.rankingRewards()})

isV587 = (bl) ->
  ownCardCount = enemyCardCount = 0
  
  for k, v of bl.cards
    if k <= 6 and _.isObject(v)
      ownCardCount += 1
    
    if k > 6 and _.isObject(v)
      enemyCardCount += 1

  return ownCardCount is 1 and enemyCardCount is 5

genRankings = (ranking) ->
  top10 = {}
  for r in [1..10]
    top10[r] = if ranking > 10 then STATUS_NORMAL else STATUS_CHALLENGE

  _results = {}

  if ranking <= 10
    _results[11] = STATUS_CHALLENGE

  else
    keys = Object.keys(INTERVALS)
    step = 1
    for k in keys.reverse()
      if ranking >= k
        step = INTERVALS[k]
        break

    _results[ranking - step * i] = STATUS_CHALLENGE for i in [1...11]

  _results[ranking] = STATUS_NORMAL
  _.extend(top10, _results)

filterPlayersInfo = (players, rankings) ->
  players.map (p) -> 
    {
      playerId: p.id
      name: p.name
      ability: p.ability
      lv: p.lv
      ranking: p.rank.ranking
      cards: p.activeCards().map (c) -> c.tableId
      type: rankings[p.rank.ranking]
    }
    
saveBattleLog = (bl, playerName) ->
  playerId = bl.ownId
  targetId = bl.enemyId

  if bl.winner is 'own'
    result = '你输了'
  else
    result = '你赢了'

  app.get('dao').battleLog.create data: {
    own: playerId
    enemy: targetId
    battleLog: bl
  }, (err, res) ->
    if err
      logger.error '[fail to save battleLog]' + err

    app.get('dao').message.create data: {
      sender: playerId
      receiver: targetId
      content: "#{playerName}挑战了你，" + result 
      type: msgConfig.MESSAGETYPE.BATTLENOTICE
      status: msgConfig.MESSAGESTATUS.NOTICE
      options: {battleLogId: res.id}
    }, (err, message) ->
      if err
        logger.error '[fail to create message]' + err

      app.get('messageService').pushByPid targetId, {
        route: 'onMessage'
        msg: message.toJson()
      }, (err, res) ->
        if err
          logger.error "[fail to send message to #{targetId}]" + err
