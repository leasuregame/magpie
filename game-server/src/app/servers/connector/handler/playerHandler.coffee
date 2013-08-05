dao = require('pomelo').app.get('dao')
Player = require('../../../domain/player')
async = require('async')

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::createPlayer = (msg, session, next) ->
  name = msg.name
  areaId = msg.areaId
  uid = session.uid

  dao.player.fetchOne where: {name: name}, (err, player) ->
    if not err and player instanceof Player
      return next(null, {code: 501, msg: "player exists."})
    
    async.waterfall [
      (cb) ->
        dao.player.create data: {userId: uid, name: name, areaId: areaId}, cb

      (player, cb) ->
        initPlayer player, cb
    ], (err, player) ->
      if err
        next(null, {code: 500, msg: err})
    
      afterCreatePlayer(session, uid, player, next)

afterCreatePlayer = (session, uid, player, next) ->
  async.waterfall [
    (cb) ->
      session.bind uid, cb

    (cb) ->
      session.set('playerId', player.id)
      session.set('areaId', player.areaId)
      session.set('playerName', player.name)
      session.on('closed', onUserLeave)
      session.pushAll(cb)

    (cb) ->
      cb()
  ], (err) ->
    if err
      logger.error('创建玩家失败，' + err.stack)
      return next(null, {code: 500, msg: err.msg or ''})

    next(null, {code: 200, msg: {player: player?.toJson()}})

onUserLeave = (session, reason) ->
  if not session or not session.uid
    return

  # do something

initPlayer = (player, callback) ->
  # 添加初始卡牌信息
  async.parallel [
    (cb) ->
      dao.card.create data: {
        playerId: player.id
        tableId: 3
        lv: 5
        star: 3
        }, cb
    (cb) ->
      dao.card.create data: {
        playerId: player.id
        tableId: 6
        lv: 1
        star: 1
        }, cb
    (cb) ->
      dao.card.create data: {
        playerId: player.id
        tableId: 12
        lv: 1
        star: 2
        }, cb
  ], (err, results) ->
    if err
      return callback(err)

    player.addCards results
    callback(null, player)