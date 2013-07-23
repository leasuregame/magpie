dao = require('pomelo').app.get('dao')
Cache = require '../common/cache'
async = require 'async'
_ = require 'underscore'

playerList = new Cache()

class Manager 

  @createPlayer: (uid, name, params, cb) ->
    dao.player.create data: {userId: uid, name: name, areaId: areaId}, (err, player) ->
      if err isnt null
        cb(err, null)
        return

      cb(null, player)

  @getPlayerInfo: (params, cb) ->
    _player = playerList.get(params.pid)
    return cb(null, _player) if _player?

    sync = params.sync or true
    dao.player.getPlayerInfo {
      where: {id:params.pid}, 
      sync: sync
    }, (err, player) ->
      if err isnt null
        cb(err, null)
        return

      playerList.put(player.id, player)
      cb(null, player)

  @getPlayers: (ids, cb) ->
    results = {}
    # _ids = _.clone(ids)
    # for id, i in _ids
    #   _player = playerList.get(id)
    #   if _player?
    #     results[id] = _player
    #     ids.splice(i, 1)

    # return cb(null, results) if ids.length is 0

    dao.player.fetchMany where: "id in (#{ids.toString()})", (err, players) ->
      if (err) 
        cb(err, null)
      else
        for p in players
          # playerList.put p.id, p
          results[p.id] = p
        cb(null, results)

  @rankingList: (rankings, cb) ->
    async.waterfall [
      (callback) ->
        dao.rank.fetchMany where: " ranking in (#{rankings.toString()}) ", callback

      (ranks, callback) ->
        _ids = ranks.map (r)-> r.playerId
        dao.player.fetchMany where: " id in (#{_ids.toString()}) ", (err, results) ->
          callback(err, results, ranks)
          
    ], (err, players, ranks) ->
      if err isnt null
        return cb(err, null)

      addRankInfo(players, ranks)
      cb(null, players)
    

addRankInfo = (players, ranks) ->
  for p in players
    r = _.findWhere(ranks, {playerId: p.id})
    p.set('rank', r) if r?

module.exports = Manager