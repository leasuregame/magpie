Module = require '../common/module'
Hero = require './hero'
Matrix = require './matrix'
manager = require '../model/player'
tab = require '../model/table'
_ = require 'underscore'
utility = require '../common/utility'

class Player extends Module
  @table: 'player'

  constructor: (id, lineUp) ->
    @id = id
    @lv = 0
    @hero_ids = []
    @heros = []
    @lineUp = lineUp or ''
    @enemy = null

    @load() if id?
    @matrix = new Matrix()
    @bindCards()
    @setAttackCount()

    super

  setEnemy: (enm) ->
    @enemy = enm

  load: ->
    # load hreos data from db
    manager.fetch @id, (err, model) => 

      if err or not model
        throw new Error('Can not find Player with id ' + @id)

      console.log model, model.constructor.attributes
      for attr in model.constructor.attributes
        console.log model[attr]
        @[attr] = model[attr] if model[attr]?

      @loadHeros()

      console.log @
    @

  loadHeros: ->
    @heros = if @hero_ids? then (new Hero(id, @) for id in @hero_ids) else []

  bindCards: ->
    #console.log @heros
    if @lineUp? and @lineUp != ''
      @parseLineUp().forEach (item) =>
        [pos, card_id] = item 
        console.log 'bind cards: ', [pos, card_id]
        
        _hero = (id) =>
          for h in @heros
            return if h.card_id is parseInt(id) then h
          null
        _h = _hero(card_id)
        @matrix.set(pos, _h)
        _h.pos = pos


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

  attack: (callback) ->
    @currentHero().attack(callback)

  currentHero: ->
    @matrix.current()

  nextHero: ->
    res = @matrix.next()
    # console.log 'player ', @id, 'next card:', res.name
    res

  currentIndex: ->
    @matrix.curIndex

  herosToBeAttacked: (scope, args) ->
    @matrix.attackElement scope, args

  reset: ->
    @matrix.reset()
    @setAttackCount()

  aliveHeros: ->
    res = @heros.filter (h) ->
      h.hp? and h.hp > 0
    res || []

  setAttackCount: ->
    @attack_count = @aliveHeros().length

exports = module.exports = Player