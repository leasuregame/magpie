db = require './base'
Module = require '../common/module'
uuid = require 'node-uuid'
_ = require 'underscore'

class ModelBase extends Module
  @extend db
  @attributes: []

  @configure: (name, attributes...) ->
    @className = name
    @attributes = attributes if attributes.length
    @attributes and= _.toArray(@attributes)
    @attributes or= []
    @

  ###
  static methods
  ###
  @create: (data, cb) ->
    if data.id?
      id = data.id
    else
      id = uuid.v1()
      data.id = id
      
    do (id, data, cb) =>
      _cb = (err, item) =>
        if not err and item  
          cb err, new @(id, data) if cb?
        else
          cb err, item if cb?
      @add id, data, _cb

  @remove: (id, cb) ->
    @del id, cb

  @update: (id, data, cb) ->
    @fetch id, (err, res) =>
      if err
        throw new Error('can not find data with id: ' + id)

      res.attr data

      @set id, res, (err, item) ->
        if err
          console.log err

        cb err, item

  @fetch: (id, cb) ->
    do (id, cb) =>
      @getJson id, (err, item) =>
        if err
          console.log err
          cb err, item
          return
          
        cb err, new @(id, item)

  @fetchMany: (ids, cb) ->
    @gets ids, (err, items) =>
      if err
        console.log err
        cb err, item
        return

      _res = {}
      for k, data of items
        data = JSON.parse(data) if _.isString(data)
        _res[k] = new @(k, data)

      cb err, _res
  ###
  Instance
  ###
  constructor: (id, atts)->
    @id = id
    @attr atts if atts

  create: (data, cb) ->
    @id = uuid.v1()
    @add @id, data, (err, item) =>
      if err and not item
        console.log err
      
      @attr data
      cb err, item
    @

  update: (data, cb) ->
    @set @id, data, (err, item) =>
      if err? and item
        @attr data
        cb err, @
    @

  remove: (cb) ->
    @del @id, cb

  fetch: (cb) ->
    @getJson @id, (err, item) =>
      if err? and item
        cb err, item
      @attr item
      cb err, @
    @

  attr: (name, value) ->
    if arguments.length == 2
      @[name] = value
      return this
    if arguments.length == 1
      if  _.isObject(name)
        attrs = name
        if attrs.id then @id = attrs.id
        for k, v of attrs
          if attrs.hasOwnProperty(k) and typeof @[k] is 'function'
            @[k](v)
          else
            @[k] = v
        return this
      else
        return @[name]
  


exports = module.exports = ModelBase

      
  


