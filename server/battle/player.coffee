Module = require('../common/module')
Hero = require './hero'
Matrix = require('./matrix')
db = require '../model/db'
util = require 'util'

class Player extends Module
  @table: 'player'

  constructor: (id, lineUp = '') ->
    @id = null
    @lv = 0
    @hero_ids = []
    @heros = []
    @lineUp = lineUp

    @load(id) if id?
    @cards = new Matrix()
    @bindCards()

    super

  load: (id) ->
    # load hreos data from db
    model = db.find(@constructor.table, id)

    if not model
      throw new Error('Can not find Player with id ' + id)

    for key, value of model
      if model.hasOwnProperty(key) and typeof @[key] is 'function'
        @[key](value)
      else
        @[key] = value

    @heros = if @hero_ids? then (new Hero(id) for id in @hero_ids) else []

    @

  bindCards: ->
    if @lineUp != ''
      @parseLineUp().forEach (item) =>
        [pos, hero_id] = item

        _hero = (id) =>
          for h in @heros
            return if h.id is parseInt(id) then h else null

        @cards.set(pos, _hero(hero_id))

  parseLineUp: (lineUp)->
    _str = lineUp || @lineUp
    pos_hero = _str.split(',')
    pos_hero.map (item)-> item.split(':')

  setLineUp: (lineUp)->
    # line up formation: 
    # saparator is : and ,
    # [position]:[hero_id],[position]:[hero_id]...
    @lineUp = lineUp
    @bindCards()
    @
    
  death: ->
    res = @heros.filter (hero) ->
      hero.hp > 0

    res.length is 0

  currentHero: ->
    @cards.current()

  currentHerosToBeAttacked: ->
    _heros = @cards.attackElement(@cards.curIndex)
    return [_heros] if not util.isArray(_heros)
    _heros

  moveNextHero: ->
    @cards.moveToNext()

  reset: ->
    @cards.reset()

  aliveHeros: ->
    res = @heros.filter (h) ->
      h.hp > 0
    res || []

exports = module.exports = Player