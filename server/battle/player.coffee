Module = require '../common/module'
Hero = require './hero'
Matrix = require './matrix'
db = require '../model/db'
tab = require '../model/table'
_ = require 'underscore'
utility = require '../common/utility'

class Player extends Module
  @table: 'player'

  constructor: (id = null, lineUp = '') ->
    @id = id
    @lv = 0
    @hero_ids = []
    @heros = []
    @lineUp = lineUp

    @load(id) if id?
    @matrix = new Matrix()
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

    @loadHeros()

    @

  loadHeros: ->
    @heros = if @hero_ids? then (new Hero(id) for id in @hero_ids) else []

  bindCards: ->
    if @lineUp != ''
      @parseLineUp().forEach (item) =>
        [pos, card_id] = item 
        #console.log 'bind cards: ', [pos, card_id]
        #console.log @heros
        _hero = (id) =>
          for h in @heros
            return if h.card_id is parseInt(id) then h
          null

        @matrix.set(pos, _hero(card_id))

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

  attack: (enemy, callback) ->
    hero = @currentHero()
    ##console.log 'hero:', hero

    if hero and not hero.death()
      condition = hero.skill_setting?.trigger_condition
      rate = hero.skill_setting?.trigger_rate

      if rate? and utility.hitRate(rate)
        hero.skillAttack( enemy.currentHerosToBeAttacked(@), callback)
      else
        hero.normalAttack( enemy.herosToBeAttacked('default'), callback )

  currentHero: ->
    @matrix.current()

  nextHero: ->
    @matrix.next()

  currentIndex: ->
    @matrix.curIndex

  currentHerosToBeAttacked: (enemy)->
    enemyHero = enemy.currentHero()

    if enemyHero?.skill_setting?.scope?
      atk_scope = enemyHero.skill_setting.scope 
    else
      atk_scope = 'default'

    @herosToBeAttacked atk_scope

  herosToBeAttacked: (scope) ->
    @matrix.attackElement scope

  reset: ->
    @matrix.reset()

  aliveHeros: ->
    res = @heros.filter (h) ->
      h.hp > 0
    res || []

exports = module.exports = Player