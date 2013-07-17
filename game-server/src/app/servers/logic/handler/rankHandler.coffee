playerManager = require '../../../manager/playerManager'
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

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::top10 = (msg, session, next) ->
  playerManager.top10 (err, players) ->
    if err
      return next(null, {code: err.code, msg: err.message?})

    next(null, {code: 200, msg: players.map (p)-> p.toJson()})

Handler::rankingList = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId

  async.waterfall [
    (cb) =>
      @app.get('dao').rank.getRank {playerId: playerId}, cb

    (rank, cb) ->
      rankings = genRankings(rank.ranking)
      playerManager.rankingList rankings, cb
  ], (err, players) ->
    if err
      return next(null, {code: err.code, msg: err.message})

    next(null, {code: 200, msg: players.map (p)-> p.toJson()})

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
      exchangeRanking @app, playerId, targetId, isWin, rewards.honorPoint, (err) ->
        if err
          return cb(err, null)
        else
          cb(null, rewards, bl)

  ], (err, rewards, bl) ->
      if err
        return next(null, {code: err.code, msg: err.msg})

      next(null, {code: 200, msg: { rewards: rewards, battleLog: bl}})
  

exchangeRanking = (app, playerId, targetId, isWin, honorPoint, cb) ->
  app.get('dao').rank.select " playerId in (#{[playerId, targetId].toString()}) ", (err, ranks) ->
    if err
      return cb(err)

    if ranks[0].playerId is playerId
      rank1 = ranks[0]
      rank2 = ranks[1]
    else
      rank1 = ranks[1]
      rank2 = ranks[0]

    if isWin
      ranking1 = rank1.ranking
      ranking2 = rank2.ranking
      rank2.set('ranking', ranking1)
      rank1.set('ranking', ranking2)

    rank1.increase('honorPoint', honorPoint)

    rank1.save()
    rank2.save()
    cb()

genRankings = (ranking) ->
  if ranking <= 10
    return [1..10]

  keys = Object.keys(INTERVALS)
  step = 1
  for k in keys.reverse()
    if ranking >= k
      step = INTERVALS[k]
      break

  _results = []
  for i in [0...10]
    _results.push ranking - step * i
  _results.reverse()
