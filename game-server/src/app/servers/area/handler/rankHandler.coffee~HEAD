playerManager = require '../../../manager/playerManager'
rankManager = require '../../../manager/rankManager'
table = require '../../../manager/table'
async = require 'async'

INTERVALS = 
  10000: 100
  7000: 80
  5000: 60
  3000: 40
  1000: 20
  700: 15
  300: 10
  199: 5
  1: 1

STATUS_NORMAL = 0
STATUS_CHALLENGE = 1
STATUS_COUNTER_ATTACK = 2

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::rankingList = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  async.waterfall [
    (cb) =>
      @app.get('dao').rank.fetchOne where:{playerId: playerId}, cb

    (rank, cb) ->
      rankings = genRankings(rank.ranking)
      playerManager.rankingList _.keys(rankings), (err, players) ->
        cb(err, players, rankings)

  ], (err, players, rankings) ->
    if err
      return next(null, {code: err.code, msg: err.message})

    rankings[p.rank.ranking] = STATUS_COUNTER_ATTACK \
      for p in players when playerId in p.rank.counts.recentChallenger

    players = filterPlayersInfo(players, rankings)
    players.sort (x, y) -> x.ranking - y.ranking
    next(null, {code: 200, msg: players})

Handler::challenge = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  targetId = msg.targetId

  player = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      if player.lv < 20
        return cb({code: 501, msg: '20级开放'})
      cb()

    (cb) =>
      @app.rpc.battle.fightRemote.pvp session, {playerId: playerId, targetId: targetId}, cb

    (bl, cb) =>
      rankData = table.getTableItem 'rank', player.lv
      _results = if bl.winner is 'own' then 'win' else 'lose'
      
      rewards = {
        exp: rankData[_results + '_exp']
        money: rankData[_results + '_money']
        honorPoint: rankData[_results + '_honor_point']
      }

      player.increase('exp', rewards.exp)
      player.increase('money', rewards.money)

      isWin = _results == 'win'
      rankManager.exchangeRankings player, targetId, rankData, isWin, (err, res) ->
        if err and not res
          return cb(err)
        else
          return cb(null, rewards, bl)

  ], (err, rewards, bl) ->
      if err
        return next(null, {code: err.code, msg: err.msg or err.message})

      bl.rewards = rewards
      console.log player.rank
      next(null, {code: 200, msg: {battleLog: bl, counts: player.rank?.counts}})

Handler::grantTitle = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  honnorPoint = msg.honnorPoint

  rankManager.getRank playerId, (err, rank) ->
    if err
      return next(null, {code: 500, msg: err.msg})

    titleConfig = table.getTableItem 'title', rank.rank + 1
    if honnorPoint < parseInt(titleConfig.honnorPoint_need)
      return next(null, {code: 501, msg: '荣誉点不够'})

    rank.grantTitle titleConfig.title, honnorPoint
    rank.save()

    next null, {code: 200}


genRankings = (ranking) ->
  top10 = {}
  for r in [1..10]
    top10[r] = if ranking > 10 then STATUS_NORMAL else STATUS_CHALLENGE

  return top10 if ranking <= 10

  keys = Object.keys(INTERVALS)
  step = 1
  for k in keys.reverse()
    if ranking >= k
      step = INTERVALS[k]
      break

  _results = {}
  _results[ranking - step * i] = STATUS_CHALLENGE for i in [0...10]

  _.extend(top10, _results)

filterPlayersInfo = (players, rankings) ->
  players.map (p) -> 
    {
      playerId: p.id
      name: p.name
      ability: p.ability
      lv: p.lv
      ranking: p.rank.ranking
      cards: p.activeCards().map (c) -> c.toJson()
      type: rankings[p.rank.ranking]
    }
    
