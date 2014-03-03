dao = require('pomelo').app.get('dao')
_ = require 'underscore'
async = require 'async'
playerManager = require('pomelo').app.get('playerManager')
BOSS_STATUS = require('../../../../config/data/bossStatus').STATUS

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::bossList = (msg, session, next) ->
  playerId = session.get('playerId')

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb

    (player, cb) ->
      ids = player.friends.map (f) -> f.id
      #ids.push player.id
      dao.boss.bossList playerId, ids, cb
    (items, cb) ->
      checkBossStatus(items, cb)
  ], (err, results) ->
    if err
      return next(null, {code: err.code or 501, msg: err.msg or err})

    next(null, {
      code: 200,
      msg: results.map (r) -> r.toJson()
    })

Handler::attack = (msg, session, next) ->
  playerId = session.get('playerId')
  bossId = msg.bossId
  inspireCount = msg.inspireCount or 0

  player = null
  boss = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb

    (res, cb) ->
      player = res
      if player.getCD() > 0
        return cb({code: 501, msg: '不能攻击'})
      cb()

    (cb) ->
      dao.boss.fetchOne where: id: bossId, cb
    (res, cb) ->
      boss = res
      if boss.playerId not in friendIds()
        return cb({code: 501, msg: '不能攻击陌生人的Boss哦'})

      if boss.timeLeft() <= 0 or boss.countLeft() is 0 or boss.isDisappear() 
        return cb({code: 501, msg: 'Boss已结束'})

      if boss.playerId isnt playerId and boss.status is BOSS_STATUS.SLEEP
        return cb({code: 501, msg: 'Boss未苏醒'})

      cb()

    (cb) ->
      fightManager.attackBoss player, boss, cb
  ], (err, bl) ->
    if err
      return next(null, {code: err.code or 501, msg: err.msg or err})

    next(null, {
      code: 200
      msg: 
        boss: {}
        gold: player.gold
        damage: 0
        cd: player.getCD()
        battleLog: bl
    })

checkBossStatus = (items, cb) ->
  console.log items
  timeOutItems = items.filter((i) -> i.timeLeft() <= 0)
  ids = timeOutItems.map (i) -> i.id
  console.log ids
  if ids.length is 0
    return cb(null, items)

  dao.boss.update {
    where: ' id in ('+ids.toString()+') '
    data: status: BOSS_STATUS.TIMEOUT
  }, (err, res) ->
    if err
      cb(err)
    else
      timeOutItems.forEach (i) -> i.status = BOSS_STATUS.TIMEOUT
      cb(null, items)