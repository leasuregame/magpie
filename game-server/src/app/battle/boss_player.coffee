Player = require './player'
Boss = require './boss_hero'
_ = require 'underscore'
table = require '../manager/table'
logger = require('pomelo-logger').getLogger(__filename)
battleLog = require './battle_log'

class BossPlayer extends Player
  init: (boss, options) ->
    bossInfo = table.getTableItem('boss', boss.tableId)

    if not bossInfo
      throw new Error('can not find boss info for tableId: ', boss.tableId)

    cards = parseCards bossInfo.card_ids, boss
    super {
      cards: cards
      lineUp: genLineUp cards, bossInfo.formation
    }, options
    @is_monster = true
    @updateCardsInfo(boss)

  updateCardsInfo: (boss)->
    for hero in @heros
      idx = @matrix.positionToNumber(hero.pos)
      if boss and boss.hp and boss.hp[idx+1]
        hero.init_hp = hero.hp = boss.hp[idx+1].hp

  loadHeros: ->
    @heros = if @cards? then new Boss(c, @) for c in @cards else []

  setCards: ->
    cobj = {}
    for c in @heros
      cobj[c.idx] = {
        id: c.id
        tableId: c.card_id
        hp: c.init_hp
        atk: c.init_atk
        hpLeft: if c.hp > 0 then c.hp else 0
        totalHp: c.total_hp
      }
    cobj
    @cards_for_bl = cobj
    
    battleLog.addCards cobj
    battleLog.addStep {
      go: battleLog.get('cards').length - 1
    }

parseCards = (cardIds, boss) ->
  cards = []

  realId = 1
  cardIds.split('#').forEach (tid) ->
    cards.push {
      id: realId++
      tableId: parseInt(tid)
      hpInfo: boss.hp
    }
  cards

genLineUp = (cards, formation) ->
  if formation is null or typeof formation is 'undefined'
    return ''

  _cards = _.clone(cards)
  lu = {}
  formation.split(',').forEach (item) =>
    [pos, _tableId] = item.split(':')
    _card = _.findWhere _cards, {tableId: parseInt(_tableId)}
    _cards.splice(_cards.indexOf(_card), 1)
    _card_id = _card.id
    lu[pos] = _card_id

  [lu]

module.exports = BossPlayer