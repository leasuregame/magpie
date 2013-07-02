dao = require('pomelo').app.get('dao')
Cache = require '../common/cache'
async = require 'async'

playerList = new Cache()

class Manager 

  @createPlayer: (uid, name, params, cb) ->
    dao.player.createPlayer uid, name, params, (err, player) ->
      if err isnt null
        cb(err, null)
        return
      
      playerList.put(player.id, player)
      cb(null, player)

  @getPlayer: (params, cb) ->
    if params.pid?
      _player = playerList.get(params.pid)
      if player?
        cb(null, _player)
        return

      dao.player.getPlayerById params.pid, (err, player) ->
        if err isnt null
          cb(err, null)
          return

        playerList.put(player.id, player)
        cb(null, player)
        return

    if params.name?
      return

  @getPlayerInfo: (params, cb) ->
    player = null
    dao.player.getPlayerInfo params.id, (err, player) ->
      if err isnt null
        cb(err, null)
        return

      playerList.put(player.id, player)
      cb(null, player)

  @getPlayers: (ids, cb) ->
    results = {}
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