dao = require('pomelo').app.get('dao')
playerManager = require('pomelo').app.get('playerManager')
configData = require '../../../../config/data'
logger = require('pomelo-logger').getLogger(__filename)
async = require 'async'
achieve = require '../../../domain/achievement'
_ = require 'underscore'
utility = require '../../../common/utility'
eUtil = require '../../../util/entityUtil'
table = require '../../../manager/table'


resData = table.getTableItem('resource_limit', 1)
MAX_POWER_VALUE = resData.power_value

SYSTEM = -1
ADD_FRIEND_MESSAGE = 1
DELETE_FRIEND_MESSAGE = 2

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::messageList = (msg, session, next) ->
  playerId = session.get('playerId')

  today = utility.dateFormat new Date(), 'yyyy-MM-dd'
  async.parallel [
    (cb) ->
      dao.message.fetchMany {
        limit: 20,
        orderby: ' createTime DESC ',
        where: {
          sender: -1
          receiver: -1
          type: configData.message.MESSAGETYPE.SYSTEM
          msgId: null
          validDate__date_ge: today # 小于等于
        }
      }, cb

    (cb) -> 
      dao.message.fetchMany {
        where: {
          receiver: playerId
          type: configData.message.MESSAGETYPE.BATTLENOTICE
        },
        limit: 20,
        orderby: ' createTime DESC '
      }, cb

    (cb) ->
      dao.message.fetchMany {
        where: " receiver = #{playerId} and (
          (type = #{configData.message.MESSAGETYPE.SYSTEM} and DATE(validDate) >= '#{today}') or 
          (type = #{configData.message.MESSAGETYPE.MESSAGE})
        )"
        orderby: ' createTime DESC '
      }, cb

    (cb) ->
      dao.message.fetchMany {
        where: {
          receiver: playerId,
          type: configData.message.MESSAGETYPE.ADDFRIEND,
          status: configData.message.MESSAGESTATUS.ASKING
        },
        limit: 20,
        orderby: ' createTime DESC '
      }, cb
  ], (err, results) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    systemMessages = results[0]
    blMessages = results[1]
    friendMessages = results[2]
    unhandledMessage = results[3]

    messages = mergeMessages(friendMessages, systemMessages, blMessages, unhandledMessage)
    messages = messages.map (m) -> m.toJson?()
    messages = _.groupBy messages, (item) -> item.type
    msgs = changeGroupNameAndSort(messages)
    next(null, {code: 200, msg: msgs})

Handler::sysMsg = (msg, session, next) ->
  content = msg.content
  options = msg.options
  validDate = msg.validDate

  if msg.playerId and _.isNumber(msg.playerId) and msg.playerId > 0
    receiver = msg.playerId
  else
    receiver = SYSTEM

  async.waterfall [
    (cb) ->
      checkSystemOptions(options, cb)
    (cb) ->
      if receiver isnt SYSTEM
        playerManager.getPlayerInfo pid: receiver, (err, res) ->
          if err
            return cb({code: 501, msg: '找不到指定玩家'})
          else
            cb()
      else 
        cb()
    (cb) ->
      dao.message.create data: {
        options: options
        sender: SYSTEM
        receiver: receiver
        content: content
        type: configData.message.MESSAGETYPE.SYSTEM
        status: configData.message.MESSAGESTATUS.UNHANDLED
        validDate: validDate
      }, cb
  ], (err, res) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    sendMessage @app, (if receiver is -1 then null else receiver), {
      route: 'onMessage'
      msg: res.toJson()
    }, '邮件发送成功', (err, data) ->
      data.msg = {msgId: res.id, tip: data.msg} if not err
      next(err, data)

checkSystemOptions = (options, cb) ->
  isObject = _.isObject(options)
  hasRightProperties = _.has(options, 'title') and _.has(options, 'sender') and _.has(options, 'rewards')
  isAcceptLength = JSON.stringify(options).length <= 1024 if isObject

  rewardTypes = ['gold', 'money', 'spirit', 'skillPoint', 'energy',
    'fragments', 'elixir', 'superHonor', 'powerValue', 'cardArray'
    'speaker', 'honor']
  wrongKeys = _.keys(options.rewards).filter (k) -> k not in rewardTypes
  hasRightRewards = wrongKeys.length == 0 if isObject and hasRightProperties
  
  if isObject and hasRightProperties and hasRightRewards and isAcceptLength
    cb()
  else 
    cb({code: 501, msg: '消息奖励内容格式不正确'})

Handler::handleSysMsg = (msg, session, next) ->
  playerId = session.get('playerId')
  msgId = msg.msgId
  
  incValues = (obj, options, done) ->
    data = options.rewards or options
    obj.increase(k, data[k]) for k in _.keys(data) when obj.hasField k 
    obj.addPower(data.powerValue) if _.has(data, 'powerValue')
    obj.incSpirit(data.spirit) if _.has(data, 'spirit')
    # todo add exp card with entityUtil
    if _.has(data, 'cardArray') and data.cardArray.length > 0
      data.cardArray.forEach (c) -> c.playerId = obj.id
      eUtil.createCards data.cardArray, (err, cards) ->
        if err
          done(err)
        else
          obj.addCards cards
          data.cardArray = cards.map (c) -> c.toJson()
          done(null, data)
    else
      done(null, data)

  player = null
  async.waterfall [
    (cb)->
      dao.message.fetchOne where: id: msgId, (err, message) ->
        if err
          return cb({code: err.code or 500, msg: err.msg or err})

        else if message.type isnt configData.message.MESSAGETYPE.SYSTEM
          return cb({code: 501, msg: '消息类型不匹配'})

        else if message.status is configData.message.MESSAGESTATUS.HANDLED
          return cb({code: 501, msg: '该邮件已领取过'})

        else
          cb(null,message)
    (message,cb)->
      dao.message.fetchOne where: {msgId: message.id,receiver: playerId},(err,res) ->
        if res isnt null
          return cb({code: 501, msg: '该邮件已领取过'})
        else
          cb(null,message)

    (message,cb)->  
      playerManager.getPlayerInfo {pid: playerId},(err,res)->
        if err
          return cb({code: err.code or 500, msg: err.msg or err})

        player = res
        cb(null, message)

    (message,cb)->
      if message.receiver is playerId
        dao.message.update {
            data: {status: configData.message.MESSAGESTATUS.HANDLED}
            where: {id: msgId}
        }, (err, res) ->
          cb(err, message.options)
      else
        data = {}
        data[k] = message[k] for k in _.keys(message.attributes) when k isnt 'id'
        data.status = configData.message.MESSAGESTATUS.HANDLED
        data.msgId = message.id
        data.receiver = playerId
        data.validDate = utility.dateFormat(data.validDate, 'yyyy-MM-dd hh:mm:ss')

        dao.message.create {
          data:data
        },(err, res) ->
          cb(err, res.options)

    (options, cb) ->
      incValues(player, options, cb)

    (data, cb) ->
      if _.isArray(data.cardArray) and data.cardArray.length > 0
        data.cardArray.forEach (c) ->
          achieve.star5card(player) if c.star is 5
          achieve.star6card(player) if c.star is 6
          achieve.star7card(player) if c.star is 7

      cb(null, data)
  ],(err, data)->
    if err
      next(null, {code: err.code or 500, msg: err.msg or err})

    player.save()
    next(null, {code: 200, msg: data})

Handler::leaveMessage = (msg, session, next) ->
  playerId = session.get('playerId')
  playerName = session.get('playerName')
  friendId = msg.friendId
  content = msg.content

  if playerId is friendId
    return next null,{code: 501,msg: '不能给自己留言'}

  dao.message.create data: {
    type: configData.message.MESSAGETYPE.MESSAGE
    sender: playerId
    options: {playerName: playerName}
    receiver: friendId
    content: content[0...50]
    status: configData.message.MESSAGESTATUS.UNHANDLED
  }, (err, res) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    sendMessage @app, friendId, {
      route: 'onMessage'
      msg: res.toLeaveMessage()
    }, null, next

Handler::setAsRead = (msg, session, next) ->
  msgId = msg.msgId
  dao.message.update {
    where: id: msgId
    data: status: configData.message.MESSAGESTATUS.HANDLED
  }, (err, res) ->
    if err
      logger.error('can not update message status with id', msgId )
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200})

Handler::readMessage = (msg, session, next) ->
  playerId = session.get('playerId')
  msgId = msg.msgId

  dao.message.fetchOne where: id: msgId, (err, res) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    dao.message.update {
      where: id: msgId
      data: status: configData.message.MESSAGESTATUS.HANDLED
    }, (err, updated) ->
      if err
        logger.error('can not update message status with id', msgId )

    next(null, {code: 200, msg: res.content})

Handler::deleteFriend = (msg, session, next) ->
  playerId = session.get('playerId')
  friendId = msg.friendId

  async.parallel [
    (cb) ->
      dao.friend.deleteFriend {
        playerId: playerId
        friendId: friendId
      }, cb

    (cb) ->
      type = configData.message.MESSAGETYPE
      condiction = " (sender=#{playerId} and receiver=#{friendId} and type in (#{type.MESSAGE}, #{type.ADDFRIEND}, #{type.BLESS})) 
        or (sender=#{friendId} and receiver=#{playerId} and type in (#{type.MESSAGE}, #{type.ADDFRIEND}, #{type.BLESS})) "
      dao.message.delete where: condiction, cb

    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb
  ], (err, results) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    player = results[2]
    player.delFriend(friendId)
    playerManager.delFriendIfOnline friendId, playerId

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

  if playerName is friendName
    return next(null, {code: 501, msg: '不能添加自己为好友'})

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
            type: configData.message.MESSAGETYPE.ADDFRIEND
            sender: playerId
            receiver: friend.id
            status: configData.message.MESSAGESTATUS.ASKING
          }, (err, res) ->
            if not err and !!res
              cb(null, true)
            else
              cb(null, false)

    (exist, cb) ->
      if not exist
        dao.message.create data: {
          type: configData.message.MESSAGETYPE.ADDFRIEND
          sender: playerId
          options: {playerName: playerName}
          receiver: friend.id
          content: "#{playerName}发来请求"
          status: configData.message.MESSAGESTATUS.ASKING
        }, cb
      else 
        cb({code: 501, msg: '不能重复发送请求'})
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
  friendExist = false
  async.waterfall [
    (cb) ->
      dao.message.fetchOne where: id: msgId, cb

    (res, cb) ->
      message = res

      if message.receiver isnt playerId
        return cb({code: 501, msg: '你没有权限处理此消息'})

      if message.type isnt configData.message.MESSAGETYPE.ADDFRIEND
        return cb({code: 501, msg: '消息类型不匹配'})

      if isFinalStatus(message.status)
        return cb({code: 501, msg: '已处理'})

      cb()

    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb

    (res, cb) ->
      player = res
      if player.friends.length >= player.friendsCount
        return cb({code: 501, msg: '您的好友已达上限'})
      else if (player.friends.filter (f) -> f.id is message.sender).length > 0
        friendExist = true
        cb()
      else
        cb()
    (cb) ->
      playerManager.getPlayerInfo pid:message.sender, cb
    (res, cb) ->
      dao.friend.getFriends res.id, (err, senderFriends) ->
        if err
          return cb({code: err.code or 500, msg: err.msg or err})
        else if (senderFriends.filter (f) -> f.id is playerId).length > 0
          friendExist = true
          cb(null, null)
        else if senderFriends.length >= res.friendsCount
          # dao.message.update {
          #   where: id: msgId
          #   data: status: configData.message.MESSAGESTATUS.REJECT
          # }, (err, res) ->
          #   if err
          #     cb(err)
          #   else
          cb({code: 501, msg: '对方好友已达上限'})
        else
          dao.friend.create {
            data:
              playerId: message.sender
              friendId: message.receiver
          }, cb

    (friend, cb) ->
      message.status = configData.message.MESSAGESTATUS.ACCEPT
      dao.message.update {
        where: id: msgId
        data: status: configData.message.MESSAGESTATUS.ACCEPT
      }, cb

    (updated, cb) ->
      dao.player.fetchOne {
        where: id: message.sender
        sync: true
      }, cb
  ], (err, sender) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    if friendExist
      return next(null, {code: 501, msg: '对方已经是你的好友'})

    newFriend = {
      id: sender.id
      name: sender.name
      lv: sender.lv
      ability: sender.ability
    }

    myInfo = {
      id: playerId
      name: playerName
      lv: player.lv
      ability: player.ability
    }
    
    next(null, {code: 200, msg: newFriend})
    
    player.addFriend newFriend
    playerManager.addFriendIfOnline sender.id, myInfo

    achieve.friends(player)
    achieve.friends(sender)

    sendMessage @app, message.sender, {
      route: 'onFriendAction'
      msg:
        type: ADD_FRIEND_MESSAGE 
        friend : myInfo
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

      if message.type isnt configData.message.MESSAGETYPE.ADDFRIEND
        return cb({code: 501, msg: '消息类型不匹配'})

      if isFinalStatus(message.status)
        return cb({code: 200, msg: '已处理'})

      dao.message.update {
        where: id: msgId
        data: status: configData.message.MESSAGESTATUS.REJECT
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

  ENERGY = 10
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
      dao.message.create data: {
        type: configData.message.MESSAGETYPE.BLESS
        sender: playerId
        receiver: friendId
        options: energy: ENERGY
        content: "#{playerName}为你送来了祝福，你获得了5点的活力值"
        status: configData.message.MESSAGESTATUS.UNHANDLED
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

    updateGiveCount(player, friendId)

    sendMessage @app, friendId, {
      route: 'onBless'
      msg: {id: res.id, sender: res.sender}
    }, {energy: ENERGY}, next

Handler::receiveBless = (msg, session, next) ->
  playerId = session.get('playerId')
  msgId = msg.msgId

  message = null
  player = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb

    (ply, cb) ->
      player = ply
      if player.dailyGift.receivedBless.count <= 0
        return cb({code: 501, msg: '今日可领祝福次数已用完'})

      dao.message.fetchOne where: id: msgId, cb

    (res, cb) ->
      message = res
      if message.receiver isnt playerId
        return cb({code: 501, msg: '你没有权限处理此消息'})

      if message.type isnt configData.message.MESSAGETYPE.BLESS
        return cb({code: 501, msg: '消息类型不匹配'})
      
      if isFinalStatus(message.status)
        return cb({code: 200, msg: '已处理'})
      cb()

    (cb) ->
      player.dailyGift.receivedBless.count--
      player.dailyGift.receivedBless.givers.push(playerId)
      player.updateGift 'receivedBless', player.dailyGift.receivedBless
      player.receiveBlessOnce()      
      player.increase('energy', message.options.energy)
      player.save()
      updateReceiveCount(player, message.sender)
      cb()

    (cb) ->
      dao.message.update {
        where: id: msgId
        data: status: configData.message.MESSAGESTATUS.HANDLED
      }, cb
  ], (err, res) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200, msg: {energy: message.options.energy}})

updateGiveCount = (player, friendId) ->
  dao.friend.updateGiveCount player.id, friendId, (err, res) -> 
    if err or not res
      logger.error(err)
    else
      player.friends?.forEach (f) ->
        if f.id is friendId
          f.giveCount += 1

updateReceiveCount = (player, friendId) ->
  dao.friend.updateReceiveCount player.id, friendId, (err, res) -> 
    if err or not res
      logger.error(err)
    else
      player.friends?.forEach (f) ->
        if f.id is friendId
          f.receiveCount += 1

isFinalStatus = (status) ->
  _.contains configData.message.FINALSTATUS, status

mergeMessages = (myMessages, systemMessages, blMessages, unhandledMessage) ->
  mySystems = myMessages.filter (m) -> m.sender is -1
  mySystems = mySystems.map (m) -> m.msgId

  systemMessages.forEach (m) ->
    if m.id not in mySystems
      myMessages.push m

  blMessages.concat(unhandledMessage).forEach (m) -> myMessages.push m
  return myMessages

changeGroupNameAndSort = (messages) ->
  results = {}
  for k, v of messages
    continue if not configData.message.TYPE_MAP[k]?
    name = configData.message.TYPE_MAP[k]
    if typeof results[name] is 'undefined'
      results[name] = v
    else
      results[name] = results[name].concat(v)

  for n, items of results
    items.sort (x, y) -> y.createTime - x.createTime
    if n is 'system'
      items.sort (x, y) -> x.status - y.status
    else if n is 'friend'
      copyItems = _.clone(items)
      newItems = []
      for i, j in items
        if i? and i.status is configData.message.MESSAGESTATUS.ASKING
          _res = copyItems.splice(j, 1)
          newItems = newItems.concat(_res)
      newItems = newItems.concat(copyItems)
      items = newItems

    results[n] = items[0...20]

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