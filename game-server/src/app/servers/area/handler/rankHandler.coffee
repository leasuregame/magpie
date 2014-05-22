app = require('pomelo').app
playerManager = require('pomelo').app.get('playerManager')
rankManager = require '../../../manager/rankManager'
fightManager = require '../../../manager/fightManager'
table = require '../../../manager/table'
async = require 'async'
logger = require('pomelo-logger').getLogger(__filename)
configData = require '../../../../config/data'
achieve = require '../../../domain/achievement'
_ = require 'underscore'
Cache = require '../../../common/cache'
utility = require '../../../common/utility'
entityUtil = require '../../../util/entityUtil'

rankingConfig = table.getTableItem('ranking_list',1)

INTERVALS = 
  10000: 106
  7000: 83
  5000: 62
  3000: 26
  1000: 15
  700: 7
  300: 3
  199: 2
  1: 1

STATUS_NORMAL = 0  # 正常状态，可查看 ###
STATUS_CHALLENGE = 1  # 可挑战状态 ###
STATUS_COUNTER_ATTACK = 2  # 可反击状态 ###
STATUS_DISPLAYE = 3  # 可显示状态，不显示查询按钮 ###

BusyRankings = new Cache()

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
      fdata = table.getTableItem('function_limit', 1)
      if player.lv < fdata.rank
        return cb({code: 501, msg: fdata.rank+'级开放'})
      
      if not player.rank? or _.isEmpty(player.rank)
        ### first time enter ranking list ###
        app.get('dao').rank.initRankingInfo player.id, (err, rank) -> 
          if err
            cb(err)
          else 
            player.rank = rank
            cb()
        #return cb({code: 501, msg: '找不到竞技信息'})
      else
        cb()

    (cb)->
      if player.rank?.recentChallenger?.length > 0
        rankManager.getRankings(player.rank.recentChallenger,cb)
      else
        cb(null,[])

    (beatBackRankings, cb) ->
      rankings = genRankings(player.rank.ranking)
      for ranking in beatBackRankings
        if ranking < player.rank.ranking
          rankings[ranking] = STATUS_COUNTER_ATTACK
      playerManager.rankingList _.keys(rankings), (err, players, ranks) -> cb(err, players, ranks, rankings)

  ], (err, players, ranks, rankings) ->
    if err
      return next(null, {code: err.code or 501, msg: err.msg or err.message})

    players = filterPlayersInfo(players, ranks, rankings)
    players.sort (x, y) -> x.ranking - y.ranking
    r = player.getRank()
    rank = {
      ranking: r.ranking,
      canGetReward: r.canGetReward,
      notCanGetReward: r.notCanGetReward,
      challengeCount: player.dailyGift.challengeCount,
      rankList: players,
      rankStats: r.stats
    }
    next(null,{code: 200, msg: {rank: rank}})

Handler::challenge = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  playerName = session.get('playerName')
  targetId = msg.targetId
  ranking = msg.ranking

  if BusyRankings.get(ranking)?
    return next null, {code: 501, msg: '对方正在战斗中'}
  BusyRankings.put(ranking, ranking, 5000)

  player = null
  target = null
  isWin = false
  async.waterfall [
    (cb) ->
      if playerId is targetId
        return cb({code: 501, msg: '不能挑战自己'})
      else
        cb()
    (cb) ->
      playerManager.getPlayers [playerId, targetId], cb

    (res, cb) ->
      player = res[playerId]
      target = res[targetId]

      if target.rank.ranking isnt ranking
        return cb({code: 501, msg: '对方排名已发生改变'})

      fightManager.pvp player, target, cb

    (bl, cb) =>
      isWin =  bl.winner == 'own'
      if isWin and isV587(bl)
        achieve.v587(player)

      rankManager.exchangeRankings player, target, isWin, (err, res, rewards, upgradeInfo, level9Box) ->
        if err and not res
          return cb(err)
        else
          return cb(null, rewards, bl, upgradeInfo, level9Box)

  ], (err, rewards, bl, upgradeInfo, level9Box) ->
      if err
        BusyRankings.del(ranking)
        return next(null, {code: err.code, msg: err.msg or err.message})
        
      firstTime = false
      if player.rank?.startCount is 1
        firstTime = true

      bl.rewards = rewards
      
      BusyRankings.del(ranking)

      next(null, {code: 200, msg: {
        battleLog: bl
        upgradeInfo: upgradeInfo if upgradeInfo
        level9Box: level9Box if level9Box
        exp: player.exp
        firstTime: firstTime if firstTime
      }})

      saveBattleLog(bl, playerName, ranking, target.rank.ranking)

Handler::fight = (msg, session, next) ->
  playerId = session.get('playerId')
  targetId = msg.targetId

  async.waterfall [
    (cb) ->
      playerManager.getPlayers [playerId, targetId], cb

    (res, cb) ->
      player = res[playerId]
      target = res[targetId]
      cb(null, player, target)

    (player, target, cb) ->
      fightManager.pvp player, target, cb
  ], (err, bl) ->
    if err
      return next(null, {code: 501, msg: err.msg or err})

    next(null, {code: 200, msg: battleLog: bl})

Handler::getRankingReward = (msg, session, next) ->
  playerId = session.get('playerId')
  ranking = msg.ranking

  playerManager.getPlayerInfo {pid: playerId}, (err, player) =>
    if err
      return next(null, {code: err.code, msg: err.msg or err.message})

    rewardData = table.getTableItem('ranking_reward', ranking)
    if not rewardData
      return next(null, {code: 501, msg: "找不到#{ranking}的排名奖励"})

    rank = player.rank
    if rank.historyRanking is 0 or rank.historyRanking > ranking
      return next(null, {code: 501, msg: '不能领取该排名奖励'})

    if rank.hasGotReward(ranking)
      return next(null, {code: 501, msg: "不能重复领取#{ranking}的排名奖励"})

    rank.getRankingReward(ranking)
    @app.get('dao').rank.update {
      data: rank.getSaveData()
      where: id: rank.id
    }, (err, res) -> 
      if err
        return next(null, {code: 501, msg: err.message or err.msg})
        
      player.increase('elixir', rewardData.elixir)
      player.save()
      next(null, {
        code: 200, 
        msg: elixir: rewardData.elixir
      })
  
Handler::thisWeek = (msg, session, next) ->
  playerId = session.get('playerId')

  async.parallel [
    (cb) =>
      @app.get('dao').elixirOfRank.thisWeekElixirRank cb
    (cb) =>
      @app.get('dao').elixirOfRank.getRank playerId, utility.thisWeek(), cb
  ], (err, results) ->
    if err
      return next(null, {code: 501, msg: err.message or err.msg})

    orderList = results[0]
    thisWeekRank = results[1]

    next(null, {code: 200, msg:{
      elixirs: orderList, 
      thisWeek: thisWeekRank
    }})

Handler::lastWeek = (msg, session, next) ->
  playerId = session.get('playerId')

  async.parallel [
    (cb) =>
      @app.get('dao').elixirOfRank.lastWeekElixirRank cb
    (cb) =>
      @app.get('dao').elixirOfRank.getRank playerId, utility.lastWeek(), cb
    (cb) =>
      @app.get('dao').elixirOfRank.fetchOne {
        fields: ['got']
        where: playerId: playerId, week: utility.lastWeek()
      }, (err, res) ->
        if err and err.code is 404
          cb(null, null)
        else
          cb(null, res)
  ], (err, results) ->
    if err
      return next(null, {code: 501, msg: err.message or err.msg})

    orderList = results[0]
    lastWeekRank = results[1]
    got = results[2]?.got
    
    next(null, {code: 200, msg:{
      elixirs: orderList, 
      lastWeek: lastWeekRank,
      isGet: !!got
    }})

Handler::getElixirRankReward = (msg, session, next) ->
  playerId = session.get('playerId')
  week = utility.lastWeek()
  rank = null
  dao = @app.get('dao')
  async.waterfall [
    (cb) ->
      dao.elixirOfRank.getRank playerId, week, cb
    (res, cb) ->
      rank = res
      if not rank
        return cb({code: 501, msg: '上周不够努力，没奖励可领哦'})
      cb(null)
    (cb) ->    
      dao.elixirOfRank.fetchOne {
        where: {
          playerId: playerId,
          week: week
        },
        fields: ['got']
      }, cb
    (eor, cb) ->
      if eor?.got is 1
        return cb({code: 501, msg: '不能重复领取'})
      cb()
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb
  ], (err, player) ->
    if err
      return next(null, {code: 501, msg: err.message or err.msg})  

    data = rewardOfRank(rank?.rank)

    entityUtil.getReward player, data, (err, cards) ->
      return next(null, {code: 501, msg: err.message or err.msg}) if err

      dao.elixirOfRank.update {
        data: got: 1
        where: playerId: playerId, week: week
      }, (err, res) ->
        return next(null, {code: 501, msg: err.message or err.msg}) if err

        results = _.extend {}, data, {
          card: cards[0] if cards.length > 0
          cardIds: cards.map (c) -> c.id
        }
        delete results.exp_card
        delete results.id
        player.save()
        next(null, {code: 200, msg: results})

rewardOfElixirRank = (rank) ->
  return if not rank
  rewardOfRank(rank)

rewardOfRank = (rank) ->
  row = table.getTableItem('elixir_ranking_reward', rank)
  if row
    row
  else 
    money50 = table.getTableItem('elixir_ranking_reward', 50)?.money or 330500
    gap = table.getTableItem('values', 'elixirOfRankMoneyGap')?.value or 0
    money = parseInt (money50-gap)*(1-Math.ceil((rank-50)/20)*0.003)
    if money < 50000
      money = 50000
    money: money

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
  if ranking > rankingConfig.top
    for j in [1..rankingConfig.add_count]
      _results[ranking+j] = STATUS_CHALLENGE
  _.extend(top, _results)

filterPlayersInfo = (players, ranks, rankings) ->
  players.map (p) -> 
    {
      playerId: p.id
      name: p.name
      ability: p.ability
      ranking: ranks[p.id]
      cards: if p.cards? then (p.cards.sort (x, y) -> y.star - x.star).map (c) -> c.tableId else []
      type: rankings[ranks[p.id]]
    }
    
saveBattleLog = (bl, playerName, oldRank, curRank) ->
  playerId = bl.ownId
  targetId = bl.enemyId

  isWin = bl.winner is 'own'
  if isWin
    result = '你输了'
  else
    result = '你赢了'

  app.get('dao').battleLog.create data: {
    type: 'pvp'
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
      type: configData.message.MESSAGETYPE.BATTLENOTICE
      status: configData.message.MESSAGESTATUS.NOTICE
      options: {
        battleLogId: res.id
        isWin: !isWin
        oldRank: oldRank
        curRank: curRank
        defier: playerName
      }
    }, (err, message) ->
      if err
        logger.error '[fail to create message]' + err

      app.get('messageService').pushByPid targetId, {
        route: 'onMessage'
        msg: message.toJson()
      }, (err, res) ->
        if err
          logger.error "[fail to send message to #{targetId}]" + err
