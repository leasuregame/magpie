player = require '../domain/entity/player'
card = require '../domain/entity/card'
Player = require '../battle/player'
Battle = require '../battle/battle'
battleLog = require '../battle/battle_log'

simBattle = (attack,defend) ->
  attack.cards = (new card(c) for c in attack.cards)
  #console.log(attack.cards)
  attack = new player(attack)
  attacker = new Player(attack)


  defend.cards = (new card(c) for c in defend.cards)
  #console.log(defend.cards)
  defend = new player(defend)
  defender = new Player(defend)

  battleLog.clear()
  battle = new Battle(attacker, defender)
  battle.process()

  battleLog

module.exports = simBattle;



