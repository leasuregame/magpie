dao = require('pomelo').app.get('dao')
Cache = require '../common/cache'

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

module.exports = Manager