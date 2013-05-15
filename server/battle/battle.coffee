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

  start: ->
    battleLog.set('enemy', @defender)

  execute: ->
    for i in [0..5]
    #while not @isOver()
      @round.process()
      @round.increase_round_num()
      console.log 'round: ', @round.round_num


  end: ->
    battleLog.setWinner( @attacker ) if @defender.death()
    battleLog.setWinner( @defender ) if @attacker.death()

class Round extends Base
  constructor: ->
    super

  init: ->
    @round_num = 1
    @attack = new Attack(@attacker, @defender)

  increase_round_num: ->
    @round_num++

  reset_round_num: ->
    @round_num = 1

  setShootCount: ->
    @attacker.shootCount = @attacker.aliveHeros().length
    @defender.shootCount = @defender.aliveHeros().length

  isOver: ->
    (@attacker.shootCount is 0 and @defender.shootCount is 0) or \
    @attacker.death() or @defender.death()

  start: ->
    @setShootCount()

  execute: () ->
    for i in [0..5]
    #while not @isOver()
      console.log 'b', @attacker.shootCount, @defender.shootCount
      @attacker.round_num = @defender.round_num = @round_num
      @attack.process()

  end: ->
    @setShootCount()
    @attacker.reset()
    @defender.reset()
    
class Attack extends Base
  constructor: ->
    super

  execute: () ->    
    _attack = (atker, dfder) ->
      console.log "#{atker.id} attack"
      atker.attack dfder, (hero) ->
        dfder.shootCount -= 1 if hero.death() and dfder.shootCount > 0

      atker.shootCount -= 1 if atker.shootCount > 0
      atker.nextHero()

    _attack( @attacker, @defender ) if @attacker.shootCount > 0 #and not @defender.death()
    _attack( @defender, @attacker ) if @defender.shootCount > 0 #and not @attacker.death()

exports = module.exports = Battle