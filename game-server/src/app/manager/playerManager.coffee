Cache = require '../common/cache'
async = require 'async'
area = require('../domain/area/area')
_ = require 'underscore'

class Manager 
  constructor: (@app) ->

  createPlayer: (uid, name, params, cb) ->
    @app.get('dao').player.create data: {userId: uid, name: name, areaId: areaId}, (err, player) ->
      if err isnt null
        cb(err, null)
        return

      cb(null, player)

  getPlayerInfo: (params, cb) ->
    _player = @getPlayerFromCache(params.pid)
    return cb(null, _player) if _player?

    sync = params.sync? and params.sync or true
    @app.get('dao').player.getPlayerInfo {
      where: {id:params.pid}, 
      sync: sync
    }, (err, player) ->
      if err isnt null
        err.msg = '找不到玩家' if err.code is 404
        cb(err, null)
        return
      cb(null, player)

  getPlayerFromCache: (id) ->
    return area.getPlayer(id)

  getPlayer: (params, cb) ->
    @app.get('dao').player.fetchOne where: params, (err, player) ->
      if err
        return cb(err, null)
      cb(null, player)

  getPlayers: (ids, cb) ->
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
      
    @app.get('dao').player.getPlayerDetails leftIds, (err, res) ->
      if err isnt null
        return cb(err, null)

      res.map (r) -> results[r.id] = r
      return cb(null, results)

  rankingList: (rankings, cb) ->
    async.waterfall [
      (callback) =>
        @app.get('dao').rank.getPidsByRankings rankings,callback

      (ranks, callback) =>
        _ids = ranks.map (r)-> r.playerId

        results = []
        leftIds = []
        for id in _ids 
          cache = @getPlayerFromCache(id)          
          if cache
            results.push {
              id: cache.id
              name: cache.name
              ability: cache.ability
              cards: cache.activeCards().map (c) -> playerId: c.playerId, tableId: c.tableId, star: c.star
            }
          else 
            leftIds.push id

        if leftIds.length == 0
          return callback(null, results, ranks)
          
        @app.get('dao').player.getLineUpInfoByIds leftIds, (err, plys) ->
          results = results.concat plys if plys.length > 0
          callback(err, results, ranks)
          
    ], (err, players, ranks) ->
      if err isnt null
        return cb(err, null)

      _ranks = {}
      _ranks[r.playerId] = r.ranking for r in ranks
      cb(null, players, _ranks)

  addExpCardFor: (player, qty, cb) ->
    async.times(
      qty
    , (n, callback) =>
      @app.get('dao').card.createExpCard data: {
        playerId: player.id,
        lv: 7,
        exp: 19
      }, callback
    , (err, cards) ->
      if err
        logger.error '[fail to create exp card]' + err
        return cb({code: err.code or 500, msg: err.msg or err})

      player.addCards cards
      cb(null, cards.map (c) -> c.toJson())
    )

  addFriendIfOnline: (pid, friend) ->
    ply = @getPlayerFromCache pid
    ply.addFriend friend if ply

  delFriendIfOnline: (pid, fid) ->
    ply = @getPlayerFromCache pid
    ply.delFriend fid if ply

  updatePlayerBossFoundIfOnline: (pid) ->
    ply = @getPlayerFromCache pid
    ply.setBossFound(false) if ply

module.exports = Manager