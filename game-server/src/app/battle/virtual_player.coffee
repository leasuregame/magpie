Player = require './player'
VHero = require './virtual_hero'

class VirtualPlayer extends Player
  init: (data) ->
    @data = data
    @cards = []
    @lineUp = data.formation or ''

    card_ids = data.cards.split('#')

    for id in card_ids
      @cards.push {tableId: parseInt(id)}

    super({})

  loadHeros: ->
    @heros = if @cards? then new VHero(c, @) for c in @cards else []

module.exports = VirtualPlayer