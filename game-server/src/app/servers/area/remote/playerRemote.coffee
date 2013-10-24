app = require('pomelo').app
dao = app.get('dao')
area = require '../../../domain/area/area'
messageService = app.get('messageService')
async = require('async')

module.exports = (app) ->
  new Remote(app)

Remote = (@app) ->

Remote::createPlayer = (args, callback) ->
  name = args.name
  userId = args.userId
  areaId = args.areaId
  serverId = args.serverId
  uid = userId + '*' + areaId
  self = this

  dao.player.fetchOne where: {name: name}, (err, player) ->
    if not err and player
      return callback({code: 501, msg: "player exists."})
    
    async.waterfall [
      (cb) ->
        dao.player.create {
          sync: true
          data: {userId: userId, name: name, areaId: areaId}, 
        }, cb

      (player, cb) ->
        initPlayer player, cb
    ], (err, player) ->
      if err
        return callback({code: 500, msg: err})
      
      ### 每天重置一次玩家的部分数据 ###
      player.resetData() if not player.isReset()

      ### 缓存登陆的玩家信息 ###
      area.addPlayer player
      messageService.add(uid, serverId, player.id, player.name)
      callback(null, player.toJson())

Remote::getPlayerByUserId = (userId, serverId, callback) ->
  dao.player.getPlayerInfo {sync: true, where: userId: userId}, (err, player) =>
    if err and not player
      return callback {code: 501, msg: 'can not find player by user id: ' + userId}

    ### 每天重置一次玩家的部分数据 ###
    player.resetData() if not player.isReset()

    ### 缓存登陆的玩家信息 ###
    area.addPlayer player
    
    uid = userId + '*' + player.areaId
    messageService.add(uid, serverId, player.id, player.name)
    return callback null, player.toJson()

Remote::playerLeave = (playerId, uid, serverId, callback) ->
  area.removePlayer playerId
  messageService.leave(uid, serverId)
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