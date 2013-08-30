dao = require('pomelo').app.get('dao')
playerManager = require '../../../manager/playerManager'
msgConfig = require '../../../../config/data/message'
logger = require('pomelo-logger').getLogger(__filename)
async = require 'async'

SYSTEM = -1


isFinalStatus = (status) ->
  _.contains msgConfig.FINALSTATUS, status

mergeMessages = (myMessages, systemMessages) ->
  mySystems = myMessages.filter (m) -> m.sender is -1
  mySystems = mySystems.map (m) -> m.msgId

  systemMessages.forEach (m) ->
    if m.id not in mySystems
      myMessages.push m
  return myMessages

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::systemMessage = (msg, session, next) ->
  content = msg.content
  options = msg.options or {}

  dao.message.create data: {
    options: options
    sender: -1
    receiver: -1
    content: content
    type: msgConfig.MESSAGETYPE.SYSTEM
    status: msgConfig.MESSAGESTATUS.UNHANDLED
  }, (err, res) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    @app.get('messageService').pushMessage(
      {
        route: 'onMessage', msg: res.content
      }, (err, res) ->
        if err
          code = 500
        else if res
          code = res
        else 
          code = 200
        next(null, {code: code})
    )

Handler::leaveMessage = (msg, session, next) ->
  playerId = session.get('playerId')
  playerName = session.get('playerName')
  friendId = msg.friendId
  content = msg.content

  dao.message.create data: {
    type: msgConfig.MESSAGETYPE.MESSAGE
    sender: playerId
    receiver: friendId
    content: content
    status: msgConfig.MESSAGESTATUS.NOTICE
  }, (err, res) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    @app.get('messageService').pushByPid(
      friendId, 
      {
        route: 'onLeaveMessage', msg: "#{playerName}给你发你发了一条留言"
      }, (err, res) ->
        if err
          code = 500
        else if res
          code = res
        else 
          code = 200
        next(null, {code: code})
    )

Handler::readMessage = (msg, session, next) ->
  playerId = session.get('playerId')
  msgId = msg.msgId

  dao.message.fetchOne where: id: msgId, (err, res) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200, msg: res.content})

Handler::messageList = (msg, session, next) ->
  playerId = session.get('playerId')

  async.parallel [
    (cb) ->
      dao.message.fetchMany where: {
        sender: -1
        receiver: -1
        type: msgConfig.MESSAGETYPE.SYSTEM
        msgId: null
      }, cb

    (cb) ->
      dao.message.fetchMany where: receiver: playerId, cb
  ], (err, results) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    systemMessages = results[0]
    myMessages = results[1]
    messages = mergeMessages(myMessages, systemMessages)
    messages = messages.map (m) -> m.toJson?()
    messages = _.groupBy messages, (item) -> item.type
    next(null, {code: 200, msg: messages})

Handler::deleteFriend = (msg, session, next) ->
  playerId = session.get('playerId')
  friendId = msg.friendId
  console.log 'delte friend', msg
  dao.friend.deleteFriend {
    playerId: playerId
    friendId: friendId
  }, (err, res) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200})

Handler::addFriend = (msg, session, next) ->
  playerId = session.get('playerId')
  playerName = session.get('playerName')
  friendName = msg.name

  friend = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, (err, ply) ->
        return cb(err) if err
        if ply.friends.filter((f) -> f.name is friendName).length > 0
          cb({code: 501, msg: '对方已经是你的好友'})
        else
          cb()

    (cb) ->
      playerManager.getPlayer name: friendName, cb

    (res, cb) ->
      friend = res
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

    @app.get('messageService').pushByPid(
      friend.id, 
      {
        route: 'onAskingFriend', 
        msg: msg.content
      }, (err, res) ->
        if err
          code = 500
        else if res
          code = res
        else 
          code = 200
        next(null, {code: code})
    )

Handler::accept = (msg, session, next) ->
  playerId = session.get('playerId')
  playerName = session.get('playerName')
  msgId = msg.msgId

  message = null
  async.waterfall [
    (cb) ->
      dao.message.fetchOne where: id: msgId, cb

    (res, cb) ->
      message = res
      if isFinalStatus(message.status)
        return cb({code: 200, msg: '已处理'})

      dao.friend.create {
        data: 
          playerId: message.sender 
          friendId: message.receiver
      }, cb

    (friend, cb) ->      
      dao.message.update {
        where: id: msgId
        data: status: msgConfig.MESSAGESTATUS.ACCEPT
      }, cb
  ], (err, data) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    @app.get('messageService').pushByPid(
      message.sender,
      {
        route: 'onAccept',
        msg: "#{playerName}同意了你的好友请求"
      }, (err, res) ->
        if err
          code = 500
        else if res
          code = res
        else 
          code = 200
        next(null, {code: code})
    )

Handler::reject = (msg, session, next) ->
  playerId = session.get('playerId')
  playerName = session.get('playerName')
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
  ], (err, res) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    @app.get('messageService').pushByPid(
      message.sender,
      {
        route: 'onReject',
        msg: "#{playerName}同意了你的好友请求"
      }, (err, res) ->
        if err
          code = 500
        else if res
          code = res
        else 
          code = 200
        next(null, {code: code})
    )

Handler::giveBless = (msg, session, next) ->
  playerId = session.get('playerId')
  playerName = session.get('playerName')
  friendId = msg.friendId

  if friendId is playerId 
    return next(null, {code: 501, '不能给自己送祝福'})

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
  ], (err, res) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    @app.get('messageService').pushByPid(
      friendId,
      {
        route: 'onBless',
        msg: "#{playerName}为你送来了一个祝福"
      }, (err, res) ->
        if err
          code = 500
        else if res
          code = res
        else 
          code = 200
        next(null, {code: code})
    )

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