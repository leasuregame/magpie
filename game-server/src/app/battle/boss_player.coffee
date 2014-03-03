Player = require './player'
Boss = require './boss_hero'
_ = require 'underscore'
table = require '../manager/table'
logger = require('pomelo-logger').getLogger(__filename)

class BossPlayer extends Player
  init: (boss) ->
    bossInfo = table.getTableItem('boss', boss.tableId)
    if not bossInfo
      throw new Error('can not find boss info for tableId: ', boss.tableId)

    cards = parseCards bossInfo.card_ids, boss
    super {
      cards: cards
      lineUp: genLineUp cards, bossInfo.formation
    }
    @is_monster = true

  loadHeros: ->
    @heros = if @cards? then new Boss(c, @) for c in @cards else []
  
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


parseCards = (cardIds, boss) ->
  cards = []

  realId = 1
  cardIds.split('#').forEach (tid) ->
    cards.push {
      id: realId++
      tableId: parseInt(tid)
      hpInfo: boss.hp
    }

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
  cards

module.exports = BossPlayer