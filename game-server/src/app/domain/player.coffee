Entity = require './entity'
_ = require 'underscore'

class Player extends Entity
  create: (uid, name) ->
    @set(
      'uid': uid
      'name': name
      'money': 1000
      'exp': 0
      'power': 120
    )

  consumePower: (val) ->
    _power = @get('power') - val
    @set 'power', _.max([_power, 0])

  increasePower: (val) ->
    _power = @get('power') + val
    @set 'power', _.min([_power, @get('max_power')])

  fullPower: ->
    @set 'power', @get('max_power')

  liveUp: ->
    @increase 'lv', 1

  addCards: (cards) ->
    if not cards or cards.length < 1
      return

    for c in cards
      @addCard(c)

  addCard: (card) ->
    @get('cards')?[card.id] = card

  # update card attributes
  # @params data, should be an object that contains the updating attributes
  # e.g {lv: 20, atk: 20050, hp: 238848}
  updateCard: (cardId, data) ->
    _.extend @get('cards')?[cardId], data

  removeCard: (cardId) ->
    if @get('cards')?[cardId]?
      delete @get('cards')[cardId]

  # increaseExp: (val) ->
  #   @exp += val
  #   if @exp >= @max_exp
  #     @liveUp()
  #     @exp = @max_exp - @exp

  # acceptRewards: (rewards)->
  #   increaseExp rewards.exp
  #   @addCards rewards.cards

  # addCards: (cards) ->
  #   cards = if _.isArray(cards) then cards else [cards]
  #   @heros.concat cards

module.exports = Player


