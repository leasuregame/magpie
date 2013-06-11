fs = require 'fs'
path = require 'path'
application = require './application'

Magpie = module.exports = {}

Magpie.version = '0.1'

Magpie.events = {
  ADD_SERVERS: '__add_servers__',
  REMOVE_SERVERS: '__remove_servers__',
  NEW_REQ: '__new_request__',
  NEW_RESP: '__new_response__'
}

Magpie.components = {}

self = this
Magpie.createApp = (opts) ->
  app = new Application(opts)
  self.app = app
  app

Object.defineProperty( Magpie, 'app', {
  get: ->
    self.app
})

fs.readdirSync(__dirname + '/components').forEach (filename) ->
  if !/\.js$/.test(filename)
    return 

  name = path.basename(filename, '.js')

  load = ->
    return require './components/' + name

  Magpie.components.__defineGetter__(name, load)
  Magpie.__defineGetter__(name, load)

