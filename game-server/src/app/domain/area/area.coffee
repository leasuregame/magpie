eventManager = require '../event/eventManager'
players = require '../../manager/playerCache'
timer = require './timer'
areaUtil = require('../../util/areaUtil')
logger = require('pomelo-logger').getLogger(__filename)
_ = require 'underscore'

Area = module.exports

Area.init = (opts) ->
  @app = opts.app
  timer.run()
  
Area.addPlayer = (player) ->
  eventManager.addEventToPlayer(@app, player)
  players.put player

Area.removePlayer = (playerId) ->

  _player = Area.getPlayer playerId
  data = _player.allData()
  _player.emit 'persist', data, (err, res) ->
    if err
      logger.error 'faild to persist player data.' + err

  _player.removeAllListeners()
  _.each _player.cards, (c) -> c.removeAllListeners()
  _player.rank?.removeAllListeners()
  players.del playerId

Area.getPlayer = (playerId) ->
  players.get playerId

Area.getPlayers = ->
  players.all()

Area.powerConsume = ->
  areaUtil.doGivePower(@app)

  for p in @getPlayers()
    p.emit('power.resume')
  return

Area.resetDate = ->
  for p in @getPlayers()
    p.emit('data.reset')
  return