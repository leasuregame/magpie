Module = require '../common/module'
Hero = require './hero'
Matrix = require './matrix'
db = require '../model/db'
tab = require '../model/table'
_ = require 'underscore'

class Player extends Module
  @table: 'player'

  constructor: (id, lineUp = '') ->
    @id = null
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

        _hero = (id) =>
          for h in @heros
            return if h.card_id is parseInt(id) then h else null

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

  currentHero: ->
    @matrix.current()

  currentIndex: ->
    @matrix.curIndex

  currentHerosToBeAttacked: (enemy)->
    enemyHero = enemy.currentHero()
    
    if( 'skill_setting' of enemyHero and enemyHero.skill_setting? and 'scope' of enemyHero.skill_setting and enemyHero.skill_setting.scope? )
      atk_scope = enemyHero.skill_setting.scope 
    else
      atk_scope = 'default'
    res = @matrix.attackElement(atk_scope)

    return if not _.isArray(res) then [res] else res

  moveNextHero: ->
    @matrix.moveToNext()

  reset: ->
    @matrix.reset()

  aliveHeros: ->
    res = @heros.filter (h) ->
      h.hp > 0
    res || []

exports = module.exports = Player