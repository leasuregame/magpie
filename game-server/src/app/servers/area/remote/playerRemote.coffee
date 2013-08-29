dao = require('pomelo').app.get('dao')
area = require '../../../domain/area/area'
async = require('async')

module.exports = (app) ->
  new Remote(app)

Remote = (@app) ->

Remote::createPlayer = (args, callback) ->
  name = args.name
  userId = args.userId
  areaId = args.areaId
  serverId = args.serverId
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
      
      area.addPlayer player
      addPlayerToChannel(self.app, userId, serverId)
      callback(null, player.toJson())

Remote::getPlayerByUserId = (userId, serverId, callback) ->
  dao.player.getPlayerInfo {sync: true, where: userId: userId}, (err, player) =>
    if err and not player
      return callback {code: 501, msg: 'can not find player by user id: ' + userId}

    area.addPlayer player
    addPlayerToChannel(@app, userId, serverId)
    return callback null, player.toJson()

Remote::playerLeave = (playerId, uid, serverId, callback) ->
  area.removePlayer playerId
  removePlayerFromChannel(@app, uid, serverId)
  callback()

addPlayerToChannel = (app, uid, serverId) ->
  channel = app.get('channelService').getChannel('message', true)
  channel.add(uid, serverId) if not channel.getMember(uid)
  console.log 'add user to channel', uid, serverId, channel.getMembers()

removePlayerFromChannel = (app, uid, serverId) ->
  channel = app.get('channelService').getChannel('message', true)
  channel.leave(uid, serverId)

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