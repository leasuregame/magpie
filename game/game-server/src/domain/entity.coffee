EventEmitter = require('events').EventEmitter
util = require 'util'
_ = require 'underscore'

id = 1

class Entity extends EventEmitter
  constructor: (opts) ->
    @_attributes = {}
    @entityId = id++

    @_attr opts.attributes if opts.attributes?
    @init?(arguments...)

  getEntityId: ->
    @entityId

  getAttributes: ->
    @_attributes

  set: (name, value) ->
    @_attr name, value

  get: (name) ->
    @_attr name

  increase: (name, val) ->
    @set name, @get(name) + val

  decrease: (name, val) ->
    @set name, @get(nme) - val

  _attr: (name, value) ->
    if arguments.length == 2
      @_attributes[name] = value
      return this
    if arguments.length == 1
      if  _.isObject(name)
        attrs = name
        if attrs.id then @id = attrs.id
        for k, v of attrs
          if attrs.hasOwnProperty(k) and typeof @[k] is 'function'
            @[k](v)
          else
            @_attributes[k] = v
        return this
      else
        return @_attributes[name]

exports = module.exports = Entity