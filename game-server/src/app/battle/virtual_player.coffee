Player = require './player'
VHero = require './virtual_hero'
_ = require 'underscore'
logger = require('pomelo-logger').getLogger(__filename)
battleLog = require './battle_log'

class VirtualPlayer extends Player
  init: (data) ->
    @data = data
    cards = parseCards data

    if data.is_random? and data.is_random is 1
      lineUp = randomLineUp cards
    else if data.formation?
      lineUp = genLineUp cards, data.formation
    else
      lineUp = defaultLineUp cards
      
    super(
      cards: cards
      lineUp: lineUp
    )
    @is_monster = true

  loadHeros: ->
    @heros = if @cards? then new VHero(c, @) for c in @cards else []

  # bindCards: ->
  #   _hero = (id) =>
  #     for h in @heros
  #       return if h.id is parseInt(id) then h
  #     null
    
  #   if @lineUp? and @lineUp != ''
  #     @parseLineUp().forEach (item) =>
  #       [pos, id] = item 
  #       _h = _hero(id)      

  #       if _h
  #         @matrix.set(pos, _h)
  #       else
  #         logger.info 'you have not such card with id is ' + id
  #   else
  #     logger.warn 'there is not line up for player ' + @name
    
  #   @matrix.reset()

  setCards: ->
    cobj = {}
    for c in @heros
      cobj[c.idx] = {
        tableId: c.card_id
        hp: c.init_hp
        atk: c.init_atk
        boss: true if c.boss?
      }
    cobj

    @cards_for_bl = cobj
    
    battleLog.addCards cobj
    battleLog.addStep {
      go: battleLog.get('cards').length - 1
    }

parseCards = (data) ->
  cards = []
  card_ids = data.cards.split('#')
  realId = 1
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
        atk_inc: data.atk_inc
        hp_inc: data.hp_inc
        boss_crit: data.boss_crit
        boss_dodge: data.dodge
      }
      hasOneBoss = true

    cards.push _obj
  cards

randomLineUp = (cards) ->
  ids = _.map cards, (c) -> c.id
  pos = [1,2,3,4,5,6]
  pos_copy = _.clone(pos)

  _res = []
  for i in ids
    r = _.random(0, pos_copy.length-1)
    _res.push pos_copy[r]
    pos_copy.splice(r, 1)

  lu = {}
  for i in [0...ids.length]
    lu[_res[i]] = ids[i]

  [lu]

genLineUp = (cards, formation) ->
  if formation is null or typeof formation is 'undefined'
    return []

  _cards = _.clone(cards)
  lu = {}
  formation.split(',').forEach (item) =>
    [pos, _tableId] = item.split(':')
    _card = _.findWhere _cards, {tableId: parseInt(_tableId)}
    _cards.splice(_cards.indexOf(_card), 1)
    _card_id = _card.id
    lu[pos] = _card_id

  [lu]

defaultLineUp = (cards) ->
  lu = {}
  for c in cards
    lu[c.id] = c.id
  [lu]

module.exports = VirtualPlayer