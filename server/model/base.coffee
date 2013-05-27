Memcached = require 'memcached'
_ = require 'underscore'

_key = '_b_'
start_time = new Date().getTime();
host = '127.0.0.1'
port = '11211'
mc = new Memcached("#{host}:#{port}")

mc.get _key, (err, data) ->
  if not data
    mc.add _key, [start_time], -1, (err, res) ->
      if err
        console.log err
    return 

  if _.isString data
    data = JSON.parse data

  data.push start_time
  mc.set _key, data, -1, (err, res) ->
    if err
      console.log err

DbBase =
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
      try
        if _.isString(data)
          data = JSON.parse data
        cb(err, data)
      catch error
        cb(error, data)

  gets: (keys, cb) ->
    mc.getMulti keys, (err, data) -> cb(err, data)

  del: (key, cb) ->
    mc.del key, (err, data) -> cb(err, data)

  inc: (key, cb) ->
    mc.inc key, 1, cb

module.exports = DbBase


