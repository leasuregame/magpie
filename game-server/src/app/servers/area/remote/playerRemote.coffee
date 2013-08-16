dao = require('pomelo').app.get('dao')
area = require '../../../domain/area/area'
async = require('async')

exports.createPlayer = (args, callback) ->
  name = args.name
  userId = args.userId
  areaId = args.areaId

  dao.player.fetchOne where: {name: name}, (err, player) ->
    if not err and player
      return callback({code: 501, msg: "player exists."})
    
    async.waterfall [
      (cb) ->
        dao.player.create data: {userId: userId, name: name, areaId: areaId}, cb

      (player, cb) ->
        initPlayer player, cb
    ], (err, player) ->
      if err
        return callback({code: 500, msg: err})
      
      area.addPlayer player
      callback(null, player.toJson())

exports.getPlayerByUserId = (userId, callback) ->
  dao.player.getPlayerInfo where: userId: userId, (err, player) ->
    console.log err, player
    if err and not player
      return callback {code: 501, msg: 'can not find player by user id: ' + userId}

    area.addPlayer player
    callback null, player.toJson()

exports.playerLeave = (playerId, callback) ->
  area.removePlayer player
  callback()

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