Module = require '../common/module'
Events = require '../common/events'
db = require '../model/db'
util = require 'util'

class Hero extends Module
  @extend Events

  @table: 'hero'

  constructor: (id)->
    @id = null
    @hp = 0
    @atk = 0
    @level = 0
    @skill = ''
    @effects = ''

    @slots = []
    @magic = []
    @load(id) if id?
    
    super

  load: (id) ->
    # load hreos data from db
    model = db.find(@constructor.table, id)
    
    if not model
      throw new Error('Can not find Hero with id ' + id)

    for key, value of model
      if model.hasOwnProperty(key) and typeof @[key] is 'function'
        @[key](value)
      else
        @[key] = value
        
    this

  laodSkill: ->


  attack: (enemys, cb) ->
    enemys = [enemys] if not util.isArray(enemys)
    enemys.forEach (enemy) =>
      enemy.hp -= @atk

    cb(enemys) if cb

  death: ->
    @hp <= 0

exports = module.exports = Hero