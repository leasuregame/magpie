players = require '../../manager/playerCache'

Area = module.exports

Area.init = (opts) ->
  
Area.addPlayer = (player) ->
  players.put player

Area.removePlayer = (playerId) ->
  players.del playerId

Area.getPlayer = (playerId) ->
  players.get playerId

Area.getPlayers = ->
  players.all()

