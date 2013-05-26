db = require './base'
Module = require '../common/module'
uuid = require 'node-uuid'

class ModelBase extends Module
  @include db

  new: (data, cb) ->
    id = uuid.v1()
    @add id, data, cb

  update: (id, data, cb) ->
    @set id, data, cb

  delete: (id, cb) ->
    @del id, cb

  fetch: (id, cb) ->
    @getJson id, cb

  fetchMany: (ids, cb) ->
    @gets ids, cb
  


