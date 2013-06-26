EventEmitter = require('events').EventEmitter
_ = require 'underscore'

id = 1

class Entity extends EventEmitter
  constructor: (opts) ->
    @entityId = id++

    setAttr @, opts if opts
    @init?(arguments...)

  getEntityId: ->
    @entityId

  sets: (attrs) ->
    setAttr @, attrs

  set: (name, value) ->
    setAttr @, name, value

  get: (name) ->
    setAttr @, name

  increase: (name, val=1) ->
    @set name, @get(name) + val

  decrease: (name, val=1) ->
    @set name, @get(nme) - val

  save: ->
    @emit('save', @)

setAttr = (self, name, value) ->
  if arguments.length == 3
    self[name] = value
    return this
  if arguments.length == 2
    if  _.isObject(name)
      attrs = name
      if attrs.id then self.id = attrs.id
      for k, v of attrs
        if attrs.hasOwnProperty(k) and typeof self[k] is 'function'
          self[k](v)
        else
          self[k] = v
      return this
    else
      return self[name]

exports = module.exports = Entity