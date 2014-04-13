app = require('pomelo').app
dao = app.get('dao')
playerManager = require('pomelo').app.get('playerManager')
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

  dao.player.fetchOne where: {name: name}, (err, player) ->
    if not err and player
      return callback({code: 501, msg: "该玩家已存在"})
    
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

Remote::getPlayerByUserId = (args, callback) ->
  userId = args.userId
  serverId = args.serverId
  
  dao.player.getPlayerInfo {sync: true, where: userId: userId}, (err, player) =>
    console.log 'get player by userId: ', userId, player?.name
    if err and not player
      return callback {code: 501, msg: '找不到玩家'}

    ### 每天重置一次玩家的部分数据 ###
    player.resetData() if not player.isReset()

    ### 缓存登陆的玩家信息 ###
    area.addPlayer player
    
    uid = userId + '*' + player.areaId
    messageService.add(uid, serverId, player.id, player.name)
    console.log '-end get player-'
    return callback null, _.extend(player.toJson(), serverTime: Date.now())

Remote::playerLeave = (playerId, uid, serverId, callback) ->
  area.removePlayer playerId
  messageService.leave(uid, serverId)

  callback()

initPlayer = (player, callback) ->
  return callback(null, player)
  
  # playerManager.addExpCardFor player, 2, (err, res) ->
  #   if err
  #     return callback(err)

  #   callback(null, player)