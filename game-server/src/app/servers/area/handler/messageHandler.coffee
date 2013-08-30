dao = require('pomelo').app.get('dao')
playerManager = require '../../../manager/playerManager'
logger = require('pomelo-logger').getLogger(__filename)
async = require 'async'

MESSAGETYPE = {
  ADDFRIEND: 1
  BLESS: 2
  BATTLENOTICE: 3
  SYSTEM: 4
}

MESSAGESTATUS = {
  ASKING: 1,
  ACCEPT: 2,
  REJECT: 3,
  BLESSING: 4,
  HANDLED: 5,
  UNHANDLED: 6,
  NOTICE: 7
}

FINALSTATUS = [
  MESSAGESTATUS.ACCEPT,
  MESSAGESTATUS.REJECT,
  MESSAGESTATUS.HANDLED,
  MESSAGESTATUS.NOTICE
]

isFinalStatus = (status) ->
  _.contains FINALSTATUS, status


module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::messageList = (msg, session, next) ->
  playerId = session.get('playerId')

  dao.message.fetchMany where: playerId : playerId, (err, res) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200, msg: res.map (r) -> r.toJson?()})

Handler::addFriend = (msg, session, next) ->
  playerId = session.get('playerId')
  playerName = session.get('playerName')
  friendName = msg.name

  async.waterfall [
    (cb) ->
      playerManager.getPlayer name: friendName, cb

    (friend, cb) ->
      dao.message.create data: {
        type: MESSAGETYPE.ADDFRIEND
        playerId: playerId
        options: friendId: friend.id
        content: "#{playerName}请求加你为好友！"
        status: MESSAGESTATUS.ASKING
      }, cb
  ], (err, msg) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

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
          playerId: message.playerId 
          friendId: message.options.friendId
      }, cb

    (res, cb) ->      
      dao.message.update {
        where: id: msgId
        data: status: MESSAGESTATUS.ACCEPT
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
        data: status: MESSAGESTATUS.REJECT
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
      if player.dailyGift.gaveBlessCount >= 15
        return cb({code: 501, '今日你送出祝福的次数已经达到上限'})

      player.updateGift 'gaveBlessCount', player.dailyGift.gaveBlessCount + 1
      player.save()
      cb()

    (cb) ->
      playerManager.getPlayer id: friendId, (err, res) ->
        if err
          return cb(err)

        if res.dailyGift.receivedBlessCount >= 15
          return cb({code: 501, '今日对方接收祝福的次数已经达到上限'})

        res.dailyGift.receivedBlessCount++
        dao.player.update {
          where: id: friendId
          data: {
            dailyGift: res.dailyGift
          }
        }, cb

    (res, cb) ->
      dao.message.create data: {
        type: MESSAGETYPE.BLESS
        playerId: friendId
        options: friendId: playerId, energy: 5
        content: "#{playerName}为你送来了祝福，你获得了5点的活力值"
        status: MESSAGESTATUS.UNHANDLED
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
        data: status: MESSAGESTATUS.HANDLED
      }, cb
  ], (err, res) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200})



