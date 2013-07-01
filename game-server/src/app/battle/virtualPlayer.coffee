Player = require './player'

class VirtualPlayer extends Player
  init: (data) ->
    @data = data
    @cards = []
    @lineUp = data.formation

    card_ids = data.cards.split('#')
    for id in card_ids
      cards.push {id: id}

  loadHeros: ->
    @heros = if @cards? then new Hero(id, @) for id in cards else []


