Memcached = require 'memcached'

host = '127.0.0.1'
port = '11211'
mc = new Memcached("#{host}:#{port}")

class DbBase
  # store data, but only if the server do not 
  # already hold data for this key
  add: (key, value, cb) ->
    mc.add key, value, 0, cb

  # store data
  set: (key, value, cb) ->
    mc.set key, value, 0, cb

  get: (key, cb) ->
    mc.get key, (err, data) -> cb(err, data)

  getJson: (key, cb) ->
    mc.get key, (err, data) ->
      if _.isString(data)
        data = JSON.parse data
      cb(err, data)

  gets: (keys, cb) ->
    mc.getMulti keys, (err, data) -> cb(err, data)

  del: (key, cb) ->
    mc.del key, (err, data) -> cb(err, data)

exports = module.exports = new DbBase()


