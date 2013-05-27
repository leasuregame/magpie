db = require './base'
Module = require '../common/module'
uuid = require 'node-uuid'
_ = require 'underscore'

class ModelBase extends Module
  @extend db

  init: (id, attributes)->
    @id = id

    if attributes?
      @attr attributes

    @

  create: (data, cb) ->
    @id = uuid.v1()
    @add @id, data, (err, item) =>
      if err? and item
        @attr data
        cb err, data
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
      return @
    if arguments.length == 1
      if  _.isObject(name)
        for k, v of name
          @[k] = v
        return @
      else
        return @[name]
  ###
  static methods
  ###
  @create: (data, cb) ->
    id = uuid.v1()
    console.log 'create: ', id
    data.id = id
    do (id, data, cb) =>
      _cb = (err, item) =>
        if not err and item  
          cb err, new @(id, data)
        else
          cb err, data
      @add id, data, _cb

  @remove: (id, cb) ->
    @del id, cb

  @fetch: (id, cb) ->
    do (id, cb) =>
      @getJson id, (err, item) =>
        console.log 'fetch callback...'
        if err? and item
          cb err, new @(id, item)

        cb(err, item)

  @fetchMany: (ids, cb) ->
    @gets ids, cb


exports = module.exports = ModelBase

      
  


