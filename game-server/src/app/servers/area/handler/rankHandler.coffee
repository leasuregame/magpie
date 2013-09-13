app = require('pomelo').app
playerManager = require '../../../manager/playerManager'
rankManager = require '../../../manager/rankManager'
table = require '../../../manager/table'
async = require 'async'
logger = require('pomelo-logger').getLogger(__filename)
msgConfig = require '../../../../config/data/message'
_ = require 'underscore'

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
  playerId = msg.playerId or session.get('playerId')
  
  player = null
  async.waterfall [
    (cb) =>
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      rankings = genRankings(player.rank.ranking)
      playerManager.rankingList _.keys(rankings), (err, players) ->
        cb(err, players, rankings)

  ], (err, players, rankings) ->
    if err
      return next(null, {code: err.code, msg: err.message})

    rankings[p.rank.ranking] = STATUS_COUNTER_ATTACK \
      for p in players when p.id isnt playerId and p.id in player.rank.counts.recentChallenger

    players = filterPlayersInfo(players, rankings)
    players.sort (x, y) -> x.ranking - y.ranking
    next(null, {code: 200, msg: players})

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
      if player.lv < 20
        return cb({code: 501, msg: '20级开放'})
      cb()

    (cb) =>
      @app.rpc.battle.fightRemote.pvp session, {playerId: playerId, targetId: targetId}, cb

    (bl, cb) =>
      isWin =  bl.winner == 'winner'
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
        counts: player.rank?.counts,
        power: player.power,
        lv: player.lv,
        exp: player.exp
      }})

      saveBattleLog(bl, playerName)

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


isV587 = (bl) ->
  ownCardCount = (_.values(bl.own.cards).filter (c) -> _.isObject(c)).length
  enemyCardCount = (_.values(bl.enemy.cards).filter (c) -> _.isObject(c)).length
  return ownCardCount is 1 and enemyCardCount is 5

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
    
saveBattleLog = (bl, playerName) ->
  playerId = bl.own.id
  targetId = bl.enemy.id

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
      content: "玩家#{playerName}在竞技场中挑战了你，" + result 
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
