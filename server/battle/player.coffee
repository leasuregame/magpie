Module = require '../common/module'
Hero = require './hero'
Matrix = require './matrix'
manager = require '../model/player'
tab = require '../model/table'
_ = require 'underscore'
utility = require '../common/utility'

class Player extends Module
  @table: 'player'

  constructor: (model) ->
    #@objects = model

    if model and model.constructor.attributes?
      for attr in model.constructor.attributes
        @[attr] = model[attr] if model[attr]?

    @initAttrs() if not model
    
    @heros = []
    @lineUp = ''
    @enemy = null
    @is_attacker = false
    @matrix = new Matrix()
    @loadHeros()
    @bindCards()
    @setAttackCount()
    console.log 'heros: ', @heros
    super

  initAttrs: ->
    @id = 0
    @lv = 0
    @exp = 0
    @power = 0
    @money = 0
    @hero_ids = []

  setEnemy: (enm, is_attacker = false) ->
    @enemy = enm
    @is_attacker = is_attacker
    @heros.forEach (h) =>
      h.setIdx @matrix.positionToNumber(h.pos), is_attacker

  loadHeros: ->
    @heros = if @hero_ids? then (new Hero(id, @) for id in @hero_ids) else []

  bindCards: ->
    if @lineUp? and @lineUp != ''
      @parseLineUp().forEach (item) =>
        [pos, card_id] = item 
        
        _hero = (id) =>
          for h in @heros
            return if h.card_id is parseInt(id) then h
          null
        _h = _hero(card_id)

        if _h
          @matrix.set(pos, _h)
        else
          #throw new Error('you have not such card with id is ' + card_id)
          console.log 'you have not such card with id is ' + card_id

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

  cards: ->
    _.map @matrix.scope('all'), (c) -> c.init_hp
    
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