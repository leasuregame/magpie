battleLog = require './battle_log'
async = require 'async'
_ = require 'underscore'
log = require('pomelo-logger').getLogger(__filename)

class Base
  constructor: (attacker, defender) ->
    @attacker = attacker
    @defender = defender
    @isStop = false

    @init?(arguments...)

  isOver: ->
    @attacker.death() or @defender.death()

  process: ->
    @start()
    !@isStop && @execute()
    @end()

  start: ->
  execute: ->
  end: ->

class Battle extends Base
  init: ->
    @attacker.setEnemy(@defender)
    @defender.setEnemy(@attacker)
    @round = new Round(@attacker, @defender)

  isOver: ->
    @attacker.death() or @defender.death() or @round.round_num >= 30

  start: ->    
    battleLog.set('ownId', @attacker.id)
    battleLog.set('enemyId', @defender.id)
    battleLog.set('ownName', @attacker.name)
    battleLog.set('enemyName', @defender.name)
    
  execute: ->
    while not @isOver()
      @round.process()
      @round.increase_round_num()

  end: ->
    battleLog.setWinner( 'own' ) if @defender.death()
    battleLog.setWinner( 'enemy' ) if @attacker.death()
    battleLog.set('round_num',@round.round_num - 1)
    # update boss hp remaining
    updateBossInfo(@defender)
    
updateBossInfo = (player) ->
  return if not player.is_boss 

  for cards in battleLog.get('cards')
    do (cards) ->
      _.each cards, (card, pos) ->
        if pos > 6
          hero = _.findWhere player.heros, id: card.id
          card.hpLeft = if hero.hp > 0 then hero.hp else 0
          delete card.id
  return

class Round extends Base
  init: ->
    @round_num = 1
    @attack = new Attack(@attacker, @defender)

  increase_round_num: ->
    @round_num++

  setShootCount: ->
    @attacker.shootCount = @attacker.aliveHeros().length
    @defender.shootCount = @defender.aliveHeros().length

  isOver: ->
    (@attacker.shootCount <= 0 and @defender.shootCount <= 0) or \
    #(@attacker.bulletOut() and @defender.bulletOut()) or \
    @attacker.death() or @defender.death()

  start: ->
    @setShootCount()

  execute: () ->
    count = 0
    while not @isOver() or count < 6
      @attacker.round_num = @defender.round_num = @round_num
      @attack.process()
      count++
    return

  end: ->
    @setShootCount()
    @attacker.reset()
    @defender.reset()

DEFAULT_ORDER = 0
REVERSE_ORDER = 1

class Attack extends Base
  init: ->
    @order = DEFAULT_ORDER

  execute: () ->
    _attack = (atker, dfder) ->
      atker.attack (heros) ->
        return if not heros

        # fix bug, 当卡牌出手后，被秒了，出手次数比实际要出手的次数少了一次
        for hero in heros
          dfder.shootCount -= 1 if hero.death() and not hero.isAttacked()
        return

      atker.nextHero()

    if @order is DEFAULT_ORDER

      if @attacker.shootCount > 0
        @attacker.shootCount -= 1
        _attack( @attacker, @defender ) 

      if @defender.shootCount > 0
        @defender.shootCount -= 1
        _attack( @defender, @attacker ) 

    else 
    
      if @defender.shootCount > 0
        @defender.shootCount -= 1
        _attack( @defender, @attacker ) 

      if @attacker.shootCount > 0
        @attacker.shootCount -= 1
        _attack( @attacker, @defender )      

  end: ->
    if @attacker.death()
      @attacker.bindCards()
      @attacker.shootCount = 0
      @defender.shootCount = 0

      @order = DEFAULT_ORDER

    if @defender.death()
      @defender.bindCards()
      @attacker.shootCount = 0
      @defender.shootCount = 0

      @order = REVERSE_ORDER

exports = module.exports = Battle