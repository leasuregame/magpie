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

checkBossStatus = (items, cb) ->
  console.log items
  timeOutItems = items.filter((i) -> i.timeLeft <= 0)
  ids = timeOutItems.map (i) -> i.bossId
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