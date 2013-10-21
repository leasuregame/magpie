dao = require('pomelo').app.get('dao')
playerManager = require '../../../manager/playerManager'
msgConfig = require '../../../../config/data/message'
logger = require('pomelo-logger').getLogger(__filename)
async = require 'async'
achieve = require '../../../domain/achievement'
_ = require 'underscore'
utility = require '../../../common/utility'
table = require '../../../manager/table'

resData = table.getTableItem('resource_limit', 1);
MAX_POWER_VALUE = resData.power_value;

SYSTEM = -1
ADD_FRIEND_MESSAGE = 1
DELETE_FRIEND_MESSAGE = 2

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
    continue if not msgConfig.TYPE_MAP[k]?
    name = msgConfig.TYPE_MAP[k]
    if typeof results[name] is 'undefined'
      results[name] = v
    else
      results[name] = results[name].concat(v)

  for n, items of results
    items.sort (x, y) -> x.createTime < y.createTime

  results

sendMessage = (app, target, msg, data, next) ->
  callback = (err, res) ->
    if err
      code = 500
    else 
      code = 200
    next(null, {code: code, msg: data if data}) if next?

  if target?
    app.get('messageService').pushByPid target, msg, callback
  else 
    app.get('messageService').pushMessage msg, callback

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::sysMsg = (msg, session, next) ->
  console.log("msg = ",msg);
  content = msg.content
  options = msg.options or {}
  receiver = msg.playerId or SYSTEM
 # msgId = msg.msgId or 0
  dao.message.create data: {
  #  msgId:msgId
    options: options
    sender: SYSTEM
    receiver: receiver
    content: content
    type: msgConfig.MESSAGETYPE.SYSTEM
    status: msgConfig.MESSAGESTATUS.UNHANDLED
  }, (err, res) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    sendMessage @app, null, {
      route: 'onMessage'
      msg: res.toJson()
    }, '邮件发送成功', next

Handler::handleSysMsg = (msg, session, next) ->
  playerId = session.get('playerId')
  msgId = msg.msgId
  player = null
  incValues = (obj, data) ->
    obj.increase(k, data[k]) for k in _.keys(data) when obj.hasField k 
    obj.addPower(data.powerValue) if _.has(data, 'powerValue')

  async.waterfall [
    (cb)->
      dao.message.fetchOne where: id: msgId, (err, message) ->
        if err
          return next(null, {code: err.code or 500, msg: err.msg or err})

        else if message.type isnt msgConfig.MESSAGETYPE.SYSTEM
          return next(null, {code: 501, msg: '消息类型不匹配'})

        else if message.status is msgConfig.MESSAGESTATUS.HANDLED
          return next(null, {code: 501, msg: '该邮件已领取过'})

        else
          cb(null,message)
    (message,cb)->
      dao.message.fetchOne where: {msgId: message.id,receiver: playerId},(err,res) ->
        if res isnt null
          return next(null, {code: 501, msg: '该邮件已领取过'})
        else
          cb(null,message)

    (message,cb)->
      playerManager.getPlayerInfo {pid: playerId},(err,res)->
        if err
          cb({code: err.code or 500, msg: err.msg or err})
        player = res
        if player.power.value >= MAX_POWER_VALUE and message.options['powerValue']
          cb {code: 501, msg: "体力已达上限"}
        else
          cb(null,message)

    (message,cb)->
      if message.receiver is playerId
        dao.message.update {
            data: {status: msgConfig.MESSAGESTATUS.HANDLED}
            where: {id: msgId}
        }, (err, res) ->
          cb(err, message.options)
      else
        data = {}
        data[k] = message[k] for k in _.keys(message.attributes) when k isnt 'id'
        data.status = msgConfig.MESSAGESTATUS.HANDLED
        data.msgId = message.id
        data.receiver = playerId

        dao.message.create {
          data:data
        },(err, res) ->
          cb(err,res.options)

    (options, cb) ->
      incValues(player, options)
      player.save()
      cb(null, options)

  ],(err, data)->
    if err
      next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200, msg: data})

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
    content: content[0...50]
    status: msgConfig.MESSAGESTATUS.NOTICE
  }, (err, res) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    sendMessage @app, friendId, {
      route: 'onMessage'
      msg: res.toLeaveMessage()
    }, null, next

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
    sendMessage @app, friendId, {
      route: 'onFriendAction'
      msg: {
        type: DELETE_FRIEND_MESSAGE
        friend: id: playerId
      }
    }

Handler::addFriend = (msg, session, next) ->
  playerId = session.get('playerId')
  playerName = session.get('playerName')
  friendName = msg.friendName

  friend = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, (err, ply) ->
        return cb(err) if err
        if _.filter(ply.friends,(f) -> f.name is friendName).length > 0
          cb({code: 501, msg: '对方已经是你的好友'})
        else if ply.friends.length >= ply.friendsCount
          cb({code: 501, msg: '您的好友已达上限'})
        else
          cb()
    (cb) ->
      playerManager.getPlayer name: friendName, cb

    (res, cb) ->
      friend = res
      dao.friend.getFriends friend.id, (err, senderFriends) ->
        if err
          return next(null, {code: err.code or 500, msg: err.msg or err})
        else if senderFriends.length >= friend.friendsCount
          cb({code: 501, msg: '对方好友已达上限'})
        else
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
          content: "#{playerName}发来请求"
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
    }, null, next

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

    (res, cb) ->
      player = res
      if player.friends.length >= player.friendsCount
        return cb({code: 501, msg: '您的好友已达上限'})
      else
        cb();
    (cb) ->
      playerManager.getPlayerInfo pid:message.sender, cb
    (res, cb) ->
      dao.friend.getFriends res.id, (err, senderFriends) ->
        if err
          return next(null, {code: err.code or 500, msg: err.msg or err})
        else if senderFriends.length >= res.friendsCount
          cb({code: 501, msg: '对方好友已达上限'})
        else
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

    sendMessage @app, message.sender, {
      route: 'onFriendAction'
      msg:
        type: ADD_FRIEND_MESSAGE 
        friend : {
          id: playerId
          name: playerName
          lv: player.lv
          ability: player.ability
        }
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
    return next(null, {code: 501, msg: '不能给自己送祝福'})

  ENERGY = 5
  player = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb

    (res, cb) ->
      player = res
      if player.dailyGift.gaveBless.count <= 0
        return cb({code: 501, msg: '今日你送出祝福的次数已经达到上限'})

      if _.contains player.dailyGift.gaveBless.receivers, friendId
        return cb({code: 501, msg: '一天只能给同一位好友送出一次祝福哦'})

      cb()

    (cb) ->
      playerManager.getPlayerInfo {pid: friendId}, (err, ply) ->
        if err
          return cb(err)

        if ply.dailyGift.receivedBlessCount <= 0
          return cb({code: 501, msg: '今日对方接收祝福的次数已经达到上限'})

        ply.dailyGift.receivedBless.count--
        ply.dailyGift.receivedBless.givers.push(playerId)
        ply.receiveBlessOnce()
        ply.save()
        cb()

    (cb) ->
      dao.message.create data: {
        type: msgConfig.MESSAGETYPE.BLESS
        sender: playerId
        receiver: friendId
        options: energy: ENERGY
        content: "#{playerName}为你送来了祝福，你获得了5点的活力值"
        status: msgConfig.MESSAGESTATUS.UNHANDLED
      }, cb
  ], (err, res) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    player.dailyGift.gaveBless.count--
    player.dailyGift.gaveBless.receivers.push(friendId)
    player.updateGift 'gaveBless', player.dailyGift.gaveBless
    player.increase('energy', ENERGY)
    player.giveBlessOnce()
    player.save()

    sendMessage @app, friendId, {
      route: 'onBless'
      msg: {id: res.id, sender: res.sender}
    }, {energy: ENERGY}, next

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

    next(null, {code: 200, msg: {energy: message.options.energy}})




