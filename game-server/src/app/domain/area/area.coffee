eventManager = require '../event/eventManager'
players = require '../../manager/playerCache'
timer = require './timer'
logger = require('pomelo-logger').getLogger(__filename)
Area = module.exports

Area.init = (opts) ->
  timer.run()
  
Area.addPlayer = (player) ->
  eventManager.addEventToPlayer(player)
  players.put player

Area.removePlayer = (playerId) ->
  _player = Area.getPlayer playerId
  _player.emit 'persist', (err, res) ->
    if err
      logger.error 'faild to persist player data.' + err

    players.del playerId

Area.getPlayer = (playerId) ->
  players.get playerId

Area.getPlayers = ->
  players.all()

Area.powerConsume = ->
  for p in @getPlayers()
    p.emit('power.consume')
    p.emit('power.give')
  return