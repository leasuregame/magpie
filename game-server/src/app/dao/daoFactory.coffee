path = require 'path'
fs = require 'fs'

Factory = module.exports = {}

Factory.init = (type) ->
  autoLoad(type)
  return Factory

autoLoad = (type) ->
  fs.readdirSync(__dirname + '/' + type).forEach (filename) ->
    if not /Dao\.js/.test(filename)
      return

    name = path.basename filename, '.js'
    
    load = ->
      return require "./#{type}/#{name}"

    Factory.__defineGetter__(name.slice(0, -3), load)