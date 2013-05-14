util = require 'util'
Event = (require 'events').EnventEmitter
battleLog = require './battle_log'

class Base #extends Event
  constructor: (attacker, defender) ->
    @attacker = attacker
    @defender = defender
    @isStop = false

    @init?(arguments...)


  isOver: ->
    @attacker.death() or @defender.death()

  process: ->
    @start()
    #@emit('before_execute')
    !@isStop && @execute()
    #@emit('after_execute')
    @end()

  start: ->
  execute: ->
  end: ->  

class Battle extends Base
  constructor: ->
    super

  init: ->
    @round = new Round(@attacker, @defender)
    battleLog.set('enemy', @defender)

  execute: ->
    while not @isOver()
      @round.execute()
      @round.increase_round_num()

    battleLog.setWinner( if @defender.death() then @attacker else @defender )

class Round extends Base
  constructor: ->
    super

  init: ->
    @round_num = 1
    @setShootCount()
    @attack = new Attack(@attacker, @defender)

  increase_round_num: ->
    @round_num++

  reset_round_num: ->
    @round_num = 1

  setShootCount: ->
    @attacker.shootCount = @attacker.aliveHeros().length
    @defender.shootCount = @defender.aliveHeros().length

  isOver: ->
    @attacker.shootCount is 0 and @defender.shootCount is 0

  execute: () ->
    while not @isOver()
      @attacker.round_num = @defender.round_num = @round_num
      @attack.execute()

    @setShootCount()
    @attacker.reset()
    @defender.reset()
    
class Attack extends Base
  constructor: ->
    super

  execute: () ->

    _attack = (atker, dfder) =>
      hero = atker.currentHero()
      enemys = dfder.currentHerosToBeAttacked(atker)

      hero.attack enemys, (enemy)->
        dfder.shootCount -= 1 if enemy.death()

      atker.shootCount -= 1
      atker.moveNextHero()

      battleLog.addStep(
        hero.id, 
        enemys.map((e)-> e.id),
        hero.skill,
        hero.effects
      )

      battleLog.addPrint(atker, dfder, hero, enemys)
    
    _attack( @attacker, @defender ) if @attacker.shootCount > 0
    _attack( @defender, @attacker ) if @defender.shootCount > 0

exports = module.exports = Battle