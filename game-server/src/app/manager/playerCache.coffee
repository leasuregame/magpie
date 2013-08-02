Cache = require '../common/cache'

cache = new Cache()

class PlayerCache

  @put = (player) ->
  	cache.put(player.id, player)

  @get = (key) ->
  	cache.get(key)

  @del = (key) ->
  	cache.del(key)

  @clear = ->
  	cache.clear()

  @size = ->
  	cache.size()

 module.exports = PlayerCache