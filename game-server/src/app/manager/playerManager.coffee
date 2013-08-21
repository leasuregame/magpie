app = require('pomelo').app
dao = app.get('dao')
Cache = require '../common/cache'
async = require 'async'
area = require('../domain/area/area');
_ = require 'underscore'

class Manager 

  @createPlayer: (uid, name, params, cb) ->
    dao.player.create data: {userId: uid, name: name, areaId: areaId}, (err, player) ->
      if err isnt null
        cb(err, null)
        return

      cb(null, player)

  @getPlayerInfo: (params, cb) ->
    #if not app.get('debug')
    _player = area.getPlayer(params.pid)
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

  @getPlayers: (ids, cb) ->
    dao.player.getPlayerDetails ids, (err, res) ->
      if err isnt null
        return cb(err, null)

      results = {}
      res.map (r) -> results[r.id] = r
      return cb(null, results)

  @rankingList: (rankings, cb) ->
    async.waterfall [
      (callback) ->
        dao.rank.fetchMany where: " ranking in (#{rankings.toString()}) ", callback

      (ranks, callback) ->
        _ids = ranks.map (r)-> r.playerId
        dao.player.getPlayerDetails _ids, (err, results) ->
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