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

getActivatedCards = (params, cb) ->
  dao.card.getCardByPlayersId params.pid, {activated: 1}, (err, cards) ->
    if err isnt null
      cb(err, null)
      return

    cb(null, cards)

module.exports = Manager