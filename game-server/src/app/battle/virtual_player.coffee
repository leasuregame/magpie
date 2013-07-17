Player = require './player'
VHero = require './virtual_hero'

class VirtualPlayer extends Player
  init: (data) ->
    @data = data
    @cards = []
    @lineUp = data.formation or ''

    card_ids = data.cards.split('#')

    for id in card_ids
      @cards.push {
        tableId: parseInt(id)
        boss: {
          id: data.boss_id
          skill_trigger_rate: data.trigger_rate
          attr_inc: data.boos_attr
          point_atk_inc: data.atk_inc
          point_hp_inc: data.hp_inc
        } if id is data.boss_id
      }

    super({})

  loadHeros: ->
    @heros = if @cards? then new VHero(c, @) for c in @cards else []

module.exports = VirtualPlayer