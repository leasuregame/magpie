EventEmitter = require('events').EventEmitter
_ = require 'underscore'

id = 1

class Entity extends EventEmitter
  constructor: (opts) ->
    @_attributes = {}
    @entityId = id++

    setAttr @, opts.attributes if opts.attributes?
    @init?(arguments...)

  getEntityId: ->
    @entityId

  getAttributes: ->
    @_attributes

  sets: (attrs) ->
    setAttr @, attrs

  set: (name, value) ->
    setAttr @, name, value

  get: (name) ->
    setAttr @, name

  increase: (name, val) ->
    @set name, @get(name) + val

  decrease: (name, val) ->
    @set name, @get(nme) - val

setAttr = (self, name, value) ->
  if arguments.length == 3
    self._attributes[name] = value
    return this
  if arguments.length == 2
    if  _.isObject(name)
      attrs = name
      if attrs.id then self.id = attrs.id
      for k, v of attrs
        if attrs.hasOwnProperty(k) and typeof self[k] is 'function'
          self[k](v)
        else
          self._attributes[k] = v
      return this
    else
      return self._attributes[name]

exports = module.exports = Entity