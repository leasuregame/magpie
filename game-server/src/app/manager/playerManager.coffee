app = require('pomelo').app
dao = app.get('dao')
Cache = require '../common/cache'
async = require 'async'
area = require('../domain/area/area')
_ = require 'underscore'

class Manager 

  @createPlayer: (uid, name, params, cb) ->
    dao.player.create data: {userId: uid, name: name, areaId: areaId}, (err, player) ->
      if err isnt null
        cb(err, null)
        return

      cb(null, player)

  @getPlayerInfo: (params, cb) ->
    _player = @getPlayerFromCache(params.pid)
    console.log '-get player form area cache-', _player != null
    return cb(null, _player) if _player?

    sync = params.sync? and params.sync or true
    dao.player.getPlayerInfo {
      where: {id:params.pid}, 
      sync: sync
    }, (err, player) ->
      if err isnt null
        cb(err, null)
        return

      cb(null, player)

  @getPlayerFromCache: (id) ->
    return area.getPlayer(id)

  @getPlayer: (params, cb) ->
    dao.player.fetchOne where: params, (err, player) ->
      if err
        return cb(err, null)
      cb(null, player)

  @getPlayers: (ids, cb) ->
    results = {}
    leftIds = []
    for id in ids
      cache = @getPlayerFromCache(id) 
      if cache 
        results[cache.id] = cache 
      else
        leftIds.push id

    if leftIds.length == 0
      return cb(null, results)
      
    dao.player.getPlayerDetails leftIds, (err, res) ->
      if err isnt null
        return cb(err, null)

      res.map (r) -> results[r.id] = r
      return cb(null, results)

  @rankingList: (rankings, cb) ->
    async.waterfall [
      (callback) ->
        dao.rank.getPidsByRankings rankings,callback

      (ranks, callback) ->
        _ids = ranks.map (r)-> r.playerId
        dao.player.getLineUpInfoByIds _ids, (err, results) ->
          callback(err, results, ranks)
          
    ], (err, players, ranks) ->
      if err isnt null
        return cb(err, null)

      results = {}

      results[r.playerId] = r.ranking for r in ranks

      #addRankInfo(players, ranks)

      cb(null, players, results)

  @addExpCardFor: (player, qty, cb) ->
    async.times(
      qty
    , (n, callback) ->
      dao.card.createExpCard data: {
        playerId: player.id,
        lv: 6,
        exp: 29
      }, callback
    , (err, cards) ->
      if err
        logger.error '[fail to create exp card]' + err
        return cb({code: err.code or 500, msg: err.msg or err})

      player.addCards cards
      cb(null, cards.map (c) -> c.toJson())
    )

  @addFriendIfOnline: (pid, friend) ->
    ply = @getPlayerFromCache pid
    ply.addFriend friend if ply

  @delFriendIfOnline: (pid, fid) ->
    ply = @getPlayerFromCache pid
    ply.delFriend fid if ply

addRankInfo = (players, ranks) ->
  for p in players
    r = _.findWhere(ranks, {playerId: p.id})
    p.set('rank', r) if r?

module.exports = Manager