dao = require('pomelo').app.get('dao')
Cache = require '../common/cache'
async = require 'async'
_ = require 'underscore'

playerList = new Cache()

class Manager 

  @createPlayer: (uid, name, params, cb) ->
    dao.player.createPlayer uid, name, params, (err, player) ->
      if err isnt null
        cb(err, null)
        return

      cb(null, player)

  @getPlayerInfo: (params, cb) ->
    _player = playerList.get(params.pid)
    return cb(null, _player) if _player?

    dao.player.getPlayerInfo params.pid, (err, player) ->
      if err isnt null
        cb(err, null)
        return

      playerList.put(player.id, player)
      cb(null, player)

  @getPlayers: (ids, cb) ->
    results = {}
    _ids = _.clone(ids)
    for id, i in _ids
      _player = playerList.get(id)
      if _player?
        results[id] = _player
        ids.splice(i, 1)

    return cb(null, results) if ids.length is 0

    async.each( 
      ids, 
      (id, done) ->
        dao.player.getPlayerInfo id, (err, player) ->
          if err isnt null
            return done(err)

          playerList.put player.id, player
          results[id] = player
          done()
      , 
      (err) ->
        if (err) 
          cb(err, null)
        else
          cb(null, results)
    )

  @selectPlayers: (condition, cb) ->
    dao.player.getPlayers condition, cb

  @top10: (cb) ->
    async.waterfall [
      (callback) ->
        dao.rank.top10 callback

      (ranks, callback) ->
        _ids = ranks.map (r)-> r.playerId
        Manager.selectPlayers " id in (#{_ids.toString()}) ", (err, results) ->
          callback(err, results, ranks)

    ], (err, players, ranks) ->
      if err isnt null
        return cb(err, null)

      addRankInfo(players, ranks)
      cb(null, players)

  @rankingList: (rankings, cb) ->
    async.waterfall [
      (callback) ->
        dao.rank.select " ranking in (#{rankings.toString()}) ", callback

      (ranks, callback) ->
        _ids = ranks.map (r)-> r.playerId
        Manager.selectPlayers " id in (#{_ids.toString()}) ", (err, results) ->
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

getActivatedCards = (params, cb) ->
  dao.card.getCardByPlayersId params.pid, {activated: 1}, (err, cards) ->
    if err isnt null
      cb(err, null)
      return

    cb(null, cards)

module.exports = Manager