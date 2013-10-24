app = require('pomelo').app
playerManager = require '../../../manager/playerManager'
rankManager = require '../../../manager/rankManager'
fightManager = require '../../../manager/fightManager'
table = require '../../../manager/table'
async = require 'async'
logger = require('pomelo-logger').getLogger(__filename)
msgConfig = require '../../../../config/data/message'
_ = require 'underscore'

rankingConfig = table.getTableItem('ranking_list',1)

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
  start = Date.now()
  player = null
  async.waterfall [
    (cb) =>
      playerManager.getPlayerInfo {pid: playerId}, cb
    (res, cb) ->
      player = res
      fdata = table.getTableItem('function_limit', 1)
      if player.lv < fdata.rank
        return cb({code: 501, msg: fdata.rank+'级开放'})
      
      if not player.rank?
        return cb({code: 501, msg: '找不到竞技信息'})

      cb()

    (cb)->
      if player.rank.recentChallenger.length > 0
        rankManager.getRankings(player.rank.recentChallenger,cb)
      else
        cb(null,[])

    (beatBackRankings, cb) ->

      rankings = genRankings(player.rank.ranking)
      for ranking in beatBackRankings
        if ranking < player.rank.ranking
          rankings[ranking] = STATUS_COUNTER_ATTACK

      playerManager.rankingList _.keys(rankings), (err, players, ranks) ->
        cb(err, players, ranks, rankings)

  ], (err, players, ranks, rankings) ->
    if err
      return next(null, {code: err.code or 501, msg: err.msg or err.message})

    players = filterPlayersInfo(players, ranks, rankings)
    players.sort (x, y) -> x.ranking - y.ranking
    r = player.getRank()
    rank = {
      ranking: r.ranking,
      rankReward: r.rankReward,
      challengeCount: player.dailyGift. c,
      rankList: players,
      time: Date.now()  - start
    }
    end = Date.now()
    console.log '**********get rankingList useTime = ',(end - start) / 1000
    next(null,{code: 200, msg: {rank: rank}})

Handler::challenge = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  playerName = session.get('playerName')
  targetId = msg.targetId

  if playerId is targetId
   return next null,{code: 501, msg: '不能挑战自己'}

  player = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      fightManager.pvp {playerId: playerId, targetId: targetId}, cb

    (bl, cb) =>
      isWin =  bl.winner == 'own'
      if isWin and isV587(bl)
        achieve.v587(player)

      rankManager.exchangeRankings player, targetId, isWin, (err, res, rewards, upgradeInfo) ->
        if err and not res
          return cb(err)
        else
          return cb(null, rewards, bl, upgradeInfo)

  ], (err, rewards, bl, upgradeInfo) ->
      if err
        return next(null, {code: err.code, msg: err.msg or err.message})

      bl.rewards = rewards
      next(null, {code: 200, msg: {
        battleLog: bl,
        upgradeInfo: upgradeInfo if upgradeInfo
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
    next(null, {
      code: 200, 
      msg: rankingRewards: player.rank?.rankingRewards()
      elixir: rewardData.elixir
    })

isV587 = (bl) ->
  ownCardCount = enemyCardCount = 0
  
  for k, v of bl.cards
    if k <= 6 and _.isObject(v)
      ownCardCount += 1
    
    if k > 6 and _.isObject(v)
      enemyCardCount += 1

  return ownCardCount is 1 and enemyCardCount is 5

genRankings = (ranking) ->
  top = {}
  for r in [1..rankingConfig.top]
    top[r] = if ranking > rankingConfig.top then STATUS_NORMAL else STATUS_CHALLENGE

  _results = {}

  if ranking <= rankingConfig.top
     for r in [rankingConfig.top + 1..rankingConfig.challenge_count - rankingConfig.top + 1]
        _results[r] = STATUS_CHALLENGE

  else
    keys = Object.keys(INTERVALS)
    step = 1
    for k in keys.reverse()
      if ranking >= k
        step = INTERVALS[k]
        break
        
    for i in [1..rankingConfig.challenge_count]
      r = ranking - step * i
      if r > 0
        _results[r] = STATUS_CHALLENGE 
      else 
        _results[ranking - r + 1]

  _results[ranking] = STATUS_NORMAL
  _.extend(top, _results)

filterPlayersInfo = (players, ranks, rankings) ->
  players.map (p) -> 
    {
      playerId: p.id
      name: p.name
      ranking: ranks[p.id]
      cards: p.activeCards().map (c) -> c.tableId
      type: rankings[ranks[p.id]]
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
