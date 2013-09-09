dao = require('pomelo').app.get('dao')
playerManager = require '../../../manager/playerManager'
msgConfig = require '../../../../config/data/message'
logger = require('pomelo-logger').getLogger(__filename)
async = require 'async'
achieve = require '../../../domain/achievement'

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

changeGroupNameAndSort = (messages) ->
  results = {}
  for k, v of messages
    name = msgConfig.TYPE_MAP[k]
    if typeof results[name] is 'undefined'
      results[name] = v
    else
      results[name].push v

  for n, items of results
    items.sort (x, y) -> x.createTime < y.createTime

  results

sendMessage = (app, target, msg, next) ->
  callback = (err, res) ->
    if err
      code = 500
    else if res
      code = res
    else 
      code = 200
    next(null, {code: code}) if next?

  if target isnt null
    app.get('messageService').pushByPid target, msg, callback
  else 
    app.get('messageService').pushMessage msg, callback

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::sysMsg = (msg, session, next) ->
  content = msg.content
  options = msg.options or {}

  dao.message.create data: {
    options: options
    sender: SYSTEM
    receiver: SYSTEM
    content: content
    type: msgConfig.MESSAGETYPE.SYSTEM
    status: msgConfig.MESSAGESTATUS.UNHANDLED
  }, (err, res) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    sendMessage @app, null, {
      route: 'onMessage'
      msg: res.toJson()
    }, next

Handler::handleSysMsg = (msg, session, next) ->
  playerId = session.get('playerId')
  msgId = msg.msgId

  dao.message.fetchOne where: id: msgId, (err, message) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    if message.type isnt msgConfig.MESSAGETYPE.SYSTEM
      return next(null, {code: 501, msg: '消息类型不匹配'})

    # do something 
    next(null, {code: 200})

Handler::leaveMessage = (msg, session, next) ->
  playerId = session.get('playerId')
  playerName = session.get('playerName')
  friendId = msg.friendId
  content = msg.content

  dao.message.create data: {
    type: msgConfig.MESSAGETYPE.MESSAGE
    sender: playerId
    options: {playerName: playerName}
    receiver: friendId
    content: content
    status: msgConfig.MESSAGESTATUS.NOTICE
  }, (err, res) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    sendMessage @app, friendId, {
      route: 'OnMessage'
      msg: res.toLeaveMessage()
    }, next

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
    messages = messages.map (m) -> 
      if m.type is msgConfig.MESSAGETYPE.MESSAGE then m.toLeaveMessage?() else m.toJson?()
    messages = _.groupBy messages, (item) -> item.type
    messages = changeGroupNameAndSort(messages)
    next(null, {code: 200, msg: messages})

Handler::deleteFriend = (msg, session, next) ->
  playerId = session.get('playerId')
  friendId = msg.friendId

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
  friendName = msg.friendName

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
      dao.message.fetchOne where: {
        type: msgConfig.MESSAGETYPE.ADDFRIEND
        sender: playerId
        receiver: friend.id
      }, (err, res) ->
        if not err and !!res
          cb(null, true)
        else 
          cb(null, false)

    (exist, cb) ->
      if not exist
        dao.message.create data: {
          type: msgConfig.MESSAGETYPE.ADDFRIEND
          sender: playerId
          receiver: friend.id
          content: "#{playerName}请求加你为好友！"
          status: msgConfig.MESSAGESTATUS.ASKING
        }, cb
      else 
        cb()
  ], (err, msg) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    sendMessage @app, friend.id, {
      route: 'onMessage'
      msg: msg.toJson()
    }, next if msg?

Handler::accept = (msg, session, next) ->
  playerId = session.get('playerId')
  playerName = session.get('playerName')
  msgId = msg.msgId

  message = null
  player = null
  async.waterfall [
    (cb) ->
      dao.message.fetchOne where: id: msgId, cb

    (res, cb) ->
      message = res

      if message.receiver isnt playerId
        return cb({code: 501, msg: '你没有权限处理此消息'})

      if message.type isnt msgConfig.MESSAGETYPE.ADDFRIEND
        return cb({code: 501, msg: '消息类型不匹配'})

      if isFinalStatus(message.status)
        return cb({code: 200, msg: '已处理'})

      cb()

    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb

    (res) ->
      player = res
      if player.friends.length >= 20
        return cb({code: 501, msg: 'friend count is the max'})
      
      dao.friend.create {
        data: 
          playerId: message.sender
          friendId: message.receiver
      }, cb

    (friend, cb) ->
      message.status = msgConfig.MESSAGESTATUS.ACCEPT
      dao.message.update {
        where: id: msgId
        data: status: msgConfig.MESSAGESTATUS.ACCEPT
      }, cb

    (updated, cb) ->
      dao.player.fetchOne {
        where: id: message.sender
        sync: true
      }, cb
  ], (err, sender) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    _result = {
      id: sender.id
      name: sender.name
      lv: sender.lv
      ability: sender.ability
    }
    next(null, {code: 200, msg: _result})

    player.friends.push _result

    achieve.friends(player, player.friends.length)
    dao.friend.getFriends sender.id, (err, senderFriends) ->
      if err
        return next(null, {code: err.code or 500, msg: err.msg or err})

      achieve.friends(sender, senderFriends.length)

    _message = message.toJson()
    _message.friend = {
      id: playerId
      name: playerName
      lv: player.lv
      ability: player.ability
    }
    sendMessage @app, message.sender, {
      route: 'onMessage'
      msg: _message
    }

Handler::reject = (msg, session, next) ->
  playerId = session.get('playerId')
  playerName = session.get('playerName')
  msgId = msg.msgId

  async.waterfall [
    (cb) ->
      dao.message.fetchOne where: id: msgId, cb

    (message, cb) ->
      if message.receiver isnt playerId
        return cb({code: 501, msg: '你没有权限处理此消息'})

      if message.type isnt msgConfig.MESSAGETYPE.ADDFRIEND
        return cb({code: 501, msg: '消息类型不匹配'})

      if isFinalStatus(message.status)
        return cb({code: 200, msg: '已处理'})

      dao.message.update {
        where: id: msgId
        data: status: msgConfig.MESSAGESTATUS.REJECT
      }, cb
  ], (err, res) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200})
    # sendMessage @app, message.sender, {
    #   route: 'onMessage'
    #   msg: "#{playerName}拒绝了你的好友请求"
    # }

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
      if player.dailyGift.gaveBless.count <= 0
        return cb({code: 501, '今日你送出祝福的次数已经达到上限'})

      if _.contains player.dailyGift.gaveBless.receivers, friendId
        return cb({code: 501, '一天只能给同一位好友送出一次祝福哦'})

      player.dailyGift.gaveBless.count--
      player.dailyGift.gaveBless.receivers.push(friendId)
      player.updateGift 'gaveBless', player.dailyGift.gaveBless
      player.giveBlessOnce()
      player.save()
      cb()

    (cb) ->
      playerManager.getPlayer id: friendId, (err, res) ->
        if err
          return cb(err)

        if res.dailyGift.receivedBlessCount <= 0
          return cb({code: 501, '今日对方接收祝福的次数已经达到上限'})

        res.dailyGift.receivedBless.count--
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

    sendMessage @app, friendId, {
      route: 'onMessage'
      msg: res.toJson()
    }, next

Handler::receiveBless = (msg, session, next) ->
  playerId = session.get('playerId')
  msgId = msg.msgId

  message = null
  async.waterfall [
    (cb) ->
      dao.message.fetchOne where: id: msgId, cb

    (res, cb) ->
      message = res
      if message.receiver isnt playerId
        return cb({code: 501, msg: '你没有权限处理此消息'})

      if message.type isnt msgConfig.MESSAGETYPE.BLESS
        return cb({code: 501, msg: '消息类型不匹配'})
      
      if isFinalStatus(message.status)
        return cb({code: 200, msg: '已处理'})
      
      playerManager.getPlayerInfo pid: playerId, cb

    (player, cb) ->
      player.increase('energy', message.options.energy)
      player.receiveBlessOnce()
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