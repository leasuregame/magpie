dao = require('pomelo').app.get('dao')
playerManager = require '../../../manager/playerManager'
msgConfig = require '../../../../config/data/message'
logger = require('pomelo-logger').getLogger(__filename)
async = require 'async'

isFinalStatus = (status) ->
  _.contains msgConfig.FINALSTATUS, status

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::leaveMessage = (msg, session, next) ->
  playerId = session.get('playerId')
  friendId = msg.friendId
  content = msg.content

  dao.message.create data: {
    type: msgConfig.MESSAGETYPE.MESSAGE
    sender: playerId
    receiver: friendId
    content: content
    status: msgConfig.MESSAGESTATUS.NOTICE
  }, (err, res) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200})

Handler::readMessage = (msg, session, next) ->
  playerId = session.get('playerId')
  msgId = msg.msgId

  dao.message.fetchOne where: id: msgId, (err, res) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200, msg: res.content})

Handler::messageList = (msg, session, next) ->
  playerId = session.get('playerId')

  dao.message.fetchMany where: receiver: playerId, (err, res) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    res = res.map (r) -> r.toJson?()
    results = _.groupBy res, (item) -> item.type
    next(null, {code: 200, msg: results})

Handler::addFriend = (msg, session, next) ->
  playerId = session.get('playerId')
  playerName = session.get('playerName')
  friendName = msg.name

  async.waterfall [
    (cb) ->
      playerManager.getPlayer name: friendName, cb

    (friend, cb) ->
      dao.message.create data: {
        type: msgConfig.MESSAGETYPE.ADDFRIEND
        sender: playerId,
        receiver: friend.id,
        content: "#{playerName}请求加你为好友！"
        status: msgConfig.MESSAGESTATUS.ASKING
      }, cb
  ], (err, msg) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    channel = @app.get('channelService').getChannel('message', false)
    console.log 'send message: ', channel.getMembers()
    channel.pushMessage({route: 'onMessage', msg: msg.content})
    next(null, {code: 200})

Handler::accept = (msg, session, next) ->
  playerId = session.get('playerId')
  msgId = msg.msgId

  async.waterfall [
    (cb) ->
      dao.message.fetchOne where: id: msgId, cb

    (message, cb) ->
      if isFinalStatus(message.status)
        return cb({code: 200, msg: '已处理'})

      dao.friend.create {
        data: 
          playerId: message.sender 
          friendId: message.receiver
      }, cb

    (res, cb) ->      
      dao.message.update {
        where: id: msgId
        data: status: msgConfig.MESSAGESTATUS.ACCEPT
      }, cb
  ], (err, res) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200})

Handler::reject = (msg, session, next) ->
  playerId = session.get('playerId')
  msgId = msg.msgId

  async.waterfall [
    (cb) ->
      dao.message.fetchOne where: id: msgId, cb

    (message, cb) ->
      if isFinalStatus(message.status)
        return cb({code: 200, msg: '已处理'})

      dao.message.update {
        where: id: msgId
        data: status: msgConfig.MESSAGESTATUS.REJECT
      }, cb
  ], (err, res) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200})

Handler::giveBless = (msg, session, next) ->
  playerId = session.get('playerId')
  playerName = session.get('playerName')
  friendId = msg.friendId

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb

    (player, cb) ->
      if player.dailyGift.gaveBless.count >= msgConfig.MAX_GIVE_COUNT
        return cb({code: 501, '今日你送出祝福的次数已经达到上限'})

      if _.contains player.dailyGift.gaveBless.receivers, friendId
        return cb({code: 501, '一天只能给同一位好友送出一次祝福哦'})

      player.dailyGift.gaveBless.count++
      player.dailyGift.gaveBless.receivers.push(friendId)
      player.updateGift 'gaveBless', player.dailyGift.gaveBless
      player.save()
      cb()

    (cb) ->
      playerManager.getPlayer id: friendId, (err, res) ->
        if err
          return cb(err)

        if res.dailyGift.receivedBlessCount >= msgConfig.MAX_RECEIVE_COUNT
          return cb({code: 501, '今日对方接收祝福的次数已经达到上限'})

        res.dailyGift.receivedBless.count++
        res.dailyGift.receivedBless.givers.push(playerId)
        dao.player.update {
          where: id: friendId
          data: {
            dailyGift: res.dailyGift
          }
        }, cb

    (res, cb) ->
      dao.message.create data: {
        type: msgConfig.MESSAGETYPE.BLESS
        sender: playerId
        receiver: friendId
        options: energy: 5
        content: "#{playerName}为你送来了祝福，你获得了5点的活力值"
        status: msgConfig.MESSAGESTATUS.UNHANDLED
      }, cb
  ], (err, res) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200})

Handler::receiveBless = (msg, session, next) ->
  playerId = session.get('playerId')
  msgId = msg.msgId

  message = null
  async.waterfall [
    (cb) ->
      dao.message.fetchOne where: id: msgId, cb

    (res, cb) ->
      message = res
      if isFinalStatus(message.status)
        return cb({code: 200, msg: '已处理'})
      
      playerManager.getPlayerInfo pid: playerId, cb

    (player, cb) ->
      player.increase('energy', message.options.energy)
      player.save()
      cb()

    (cb) ->
      dao.message.update {
        where: id: msgId
        data: status: msgConfig.MESSAGESTATUS.HANDLED
      }, cb
  ], (err, res) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200})



