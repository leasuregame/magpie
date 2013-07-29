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
      _results = if bl.winner is 'own' then 'lose' else 'win'
      
      rewards = {
        exp: rankData[_results + '_exp']
        money: rankData[_results + '_money']
        honorPoint: rankData[_results + '_honor_point']
      }

      player.increase('exp', rewards.exp)
      player.increase('money', rewards.money)

      isWin = _results == 'win'
      rankManager.exchangeRankings player, targetId, rewards, isWin, (err, res) ->
        console.log 'exchange result: ', err, res
        if err and not res
          return cb(err)
        else
          return cb(null, rewards, bl)

  ], (err, rewards, bl) ->
      if err
        return next(null, {code: err.code, msg: err.msg or err.message})

      bl.rewards = rewards
      next(null, {code: 200, msg: {battleLog: bl, counts: player.counts}})

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
    p = p.toJson()
    {
      playerId: p.id
      name: p.name
      ability: p.ability
      lv: p.lv
      ranking: p.rank.ranking
      cards: p.cards
      type: rankings[p.rank.ranking]
    }
    
