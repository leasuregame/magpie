Player = require './player'
VHero = require './virtual_hero'
_ = require 'underscore'
logger = require('pomelo-logger').getLogger(__filename)

class VirtualPlayer extends Player
  init: (data) ->
    @data = data
    cards = []
    lineUp = data.formation or ''

    card_ids = data.cards.split('#')
    realId = 0
    hasOneBoss = false
    for id in card_ids
      _obj = {
        id: realId++
        tableId: parseInt(id)
        sectionId: data.sectionId
      }
      if not hasOneBoss and data.boss_id? and parseInt(id) is parseInt(data.boss_id)
        _obj.boss = {
          id: data.boss_id
          skill_trigger_rate: data.trigger_rate
          attr_inc: data.boss_attr
          point_atk_inc: data.atk_inc
          point_hp_inc: data.hp_inc
        }
        hasOneBoss = true

      cards.push _obj

    _cards = _.clone(cards)
    arr = lineUp.split(',').map (item) =>
      [pos, _tableId] = item.split(':')
      _card = _.findWhere _cards, {tableId: parseInt(_tableId)}
      _cards.splice(_cards.indexOf(_card), 1)
      _card_id = _card.id
      "#{pos}:#{_card_id}"

    lineUp = arr.join(',')
    
    super(
      cards: cards
      lineUp: lineUp
    )
    @is_monster = true

  loadHeros: ->
    @heros = if @cards? then new VHero(c, @) for c in @cards else []

  bindCards: ->
    if @lineUp? and @lineUp != ''
      @parseLineUp().forEach (item) =>
        [pos, id] = item 
        
        _hero = (id) =>
          for h in @heros
            return if h.id is parseInt(id) then h
          null
        _h = _hero(id)

        if _h
          @matrix.set(pos, _h)
        else
          logger.info 'you have not such card with id is ' + id
    else
      logger.warn 'there is not line up for player ' + @name
    
    @matrix.reset()

  getCards: ->
    cobj = {}
    cobj[c.idx] = {
      tableId: c.card_id
      hp: c.hp
      boss: true if c.boss?
    } for c in @heros
    cobj

module.exports = VirtualPlayer