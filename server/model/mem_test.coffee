Memcached = require 'memcached'

memcached = new Memcached('127.0.0.1:1978')

memcached.set 'hello', 'test data', 10000, (err, result) ->
  if err
    console.log err

  console.log result
  memcached.end()

memcached.get 'hello', (err, result) ->
  if err
    console.error 'error:', err

  console.log result
  memcached.end()

# memcached.connect '127.0.0.1:1978', (err, conn) ->
#   if err
#     throw new Error(err)

#   console.log conn.server

# memcached.on 'failure', (details) ->
#   sys.error "server #{details.server} went down due to: #{details.messages.join('')}"

