playerManager = require '../../../manager/playerManager'
async = require 'async'

INTERVALS = 
  100000: 100
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
      return next(null, {code: err.code, msg: err.message})

    next(null, {code: 200, msg: players.map (p)-> p.toJson()})

Handler::rankingList = (msg, session, next) ->
  playerId = session.get('playerId')

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (player, cb) ->
      ranking = player.ranking
      rankings = genRankings(ranking)

      playerManager.getPlayers " ranking in (#{rankings.toString()}) ", cb
  ], (err, players) ->
    if err
      return next(null, {code: err.code, msg: err.message})

    next(null, {code: 200, msg: players.map (p)-> p.toJson()})

Handler::challenge = (msg, session, next) ->
  @app.rpc.battle.fightRemote.pve session, {playerId: session.get('playerId'), targetId: msg.targetId}, (err, result) ->
    if err
      return next(null, {code: err.code, msg: err.message})

    # chedk pvp result, win or lose
    # and update player infomation

    next(null, {code: 200, msg: result})

genRankings = (ranking) ->
  keys = Object.keys(INTERVALS)
  step = 1
  for k in keys
    if ranking >= k
      step = INTERVALS[k]
      break

  _results = [ranking]
  for i in [0..10]
    _results.push ranking - step
  _results.reverse()
