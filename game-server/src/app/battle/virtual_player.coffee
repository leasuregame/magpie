Player = require './player'
VHero = require './virtual_hero'
_ = require 'underscore'
logger = require('pomelo-logger').getLogger(__filename)

class VirtualPlayer extends Player
  init: (data) ->
    @data = data
    cards = parseCards data

    if data.is_random? and data.is_random is 1
      lineUp = randomLineUp cards
      console.log 'random lineup: ', lineUp
    else if data.formation?
      lineUp = genLineUp cards, data.formation
    else
      lineUp = defaultLineUp cards
      console.log 'default Line Up: ', lineUp
    console.log 'data: ', data
    
    super(
      cards: cards
      lineUp: lineUp
    )
    @is_monster = true

  loadHeros: ->
    @heros = if @cards? then new VHero(c, @) for c in @cards else []

  bindCards: ->
    _hero = (id) =>
      for h in @heros
        return if h.id is parseInt(id) then h
      null
    
    if @lineUp? and @lineUp != ''
      @parseLineUp().forEach (item) =>
        [pos, id] = item 
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
    for c in @heros
      cobj[c.idx] = {
        tableId: c.card_id
        hp: c.hp
        atk: c.atk
        boss: true if c.boss?
        skillId: c.skill_id if c.skill?
        normalAtkId: c.normal_atk_id
        effectId: c.effect_id if c.skill?
      }
    cobj

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
  pos = ['00', '01', '02', '10', '11', '12']
  pos_copy = _.clone(pos)

  _res = []
  for i in ids
    r = _.random(0, pos_copy.length-1)
    _res.push pos_copy[r]
    pos_copy.splice(r, 1)

  lu = ''
  for i in [0...ids.length]
    lu += "#{_res[i]}:#{ids[i]},"

  lu[0...-1]

genLineUp = (cards, formation) ->
  if formation is null or typeof formation is 'undefined'
    return ''

  _cards = _.clone(cards)
  arr = formation.split(',').map (item) =>
    [pos, _tableId] = item.split(':')
    _card = _.findWhere _cards, {tableId: parseInt(_tableId)}
    _cards.splice(_cards.indexOf(_card), 1)
    _card_id = _card.id
    "#{pos}:#{_card_id}"

  arr.join(',')

defaultLineUp = (cards) ->
  lu = ''
  for c in cards
    lu += "#{c.id}:#{c.id},"
  lu[0...-1]

module.exports = VirtualPlayer