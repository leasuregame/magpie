pomelo = require 'pomelo'
Player = require '../domain/coffee/player'
uuid = require 'node-uuid'
_ = require 'underscore'


class ModelBase
  _.extend ModelBase, pomelo.app.get('ttclient')

  @create: (data, cb) ->
    if data.id?
      id = data.id
    else
      id = uuid.v1()
      data.id = id
      
    do (id, data, cb) =>
      _cb = (err, item) =>
        if not err and item
          cb err, new @Entity({attributes:data}) if cb?
        else
          cb err, item if cb?
      @add id, data, _cb

  @remove: (id, cb) ->
    @del id, cb

  @update: (id, data, cb) ->
    @fetch id, (err, res) =>
      if err
        throw new Error('can not find data with id: ' + id)

      # update attributes
      res.set(data)

      @set id, res, (err, item) ->
        if err
          console.log err

        cb err, item

  @fetch: (id, cb) ->
    do (id, cb) =>
      @getJson id, (err, item) =>
        if err
          console.log err
          cb err, null
          return
        cb err, new @Entity({attributes: item})

  @fetchMany: (ids, cb) ->
    @gets ids, (err, items) =>
      if err
        console.log err
        cb err, items
        return

      _res = {}
      for k, data of items
        data = JSON.parse(data) if _.isString(data)
        _res[k] = new @Entity({attributes:data})

      cb err, _res

generateManager = (entity) ->
  class Ent extends ModelBase
    @Entity = entity

  return Ent

exports = module.exports = {
  player: generateManager(Player)
}

      
  


