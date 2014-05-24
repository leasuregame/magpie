_ = require 'underscore'
Code = require '../../../shared/code'
CHANNEL_NAME = 'MESSAGE'

module.exports = (app) ->
  new Service(app) 

class Service
  constructor: (@app) ->
    @uidMap = {}
    @pidMap = {}

  add: (uid, serverId, playerId, playerName) ->
    channel = @app.get('channelService').getChannel(CHANNEL_NAME, true)
    if not channel 
      return Code.MESSAGE.FA_CHANNEL_CREATE

    channel.add(uid, serverId)
    addRecord(@, uid, serverId, playerId, playerName)
    return Code.OK

  leave: (uid, serverId) ->
    channel = @app.get('channelService').getChannel(CHANNEL_NAME, true)
    channel.leave(uid, serverId) if channel
    removeRecord(@, uid, serverId)

  pushByUid: (uid, msg, cb) ->
    record = @uidMap[uid]
    if not record 
      return cb(null, Code.MESSAGE.FA_USER_NOT_ONLINE)

    @app.get('channelService').pushMessageByUids(msg.route, msg, [{uid: record.uid, sid: record.sid}], cb)

  pushByPid: (pid, msg, cb) ->
    record = @pidMap[pid]
    if not record
      return cb(null, Code.MESSAGE.FA_USER_NOT_ONLINE)

    @app.get('channelService').pushMessageByUids(msg.route, msg, [{uid: record.uid, sid: record.sid}], cb)

  pushByPids: (pids, msg, cb) ->
    pids = [pids] if not _.isArray(pids)

    records = []
    records.push v for k, v of @pidMap when parseInt(k) in pids 
    records = records.map (r) -> {uid: r.uid, sid: r.sid}
    if records.length > 0
      @app.get('channelService').pushMessageByUids(msg.route, msg, records, cb)
    else
      cb(null, Code.MESSAGE.FA_USER_NOT_ONLINE)

  pushMessage: (msg, cb) ->
    channel = @app.get('channelService').getChannel(CHANNEL_NAME)
    if not channel
      return cb(new Error('channel ' + CHANNEL_NAME + ' dose not exist'))

    channel.pushMessage(msg.route, msg, cb)

addRecord = (self, uid, sid, pid, playerName) ->
  record = {uid: uid, sid: sid, pid: pid, name: playerName}
  self.uidMap[uid] = record
  self.pidMap[pid] = record

removeRecord = (self, uid) ->
  record = self.uidMap[uid]
  if record
    delete self.uidMap[uid] 
    delete self.pidMap[record.pid]

