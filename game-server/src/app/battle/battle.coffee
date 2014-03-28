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
    updateBossInfo(battleLog, @defender)
    
updateBossInfo = (bl, player) ->
  return if not player.is_boss 

  for cards in bl.cards
    do (cards) ->
      _.each cards, (card, pos) ->
        if pos > 6
          hero = _.findWhere player.heros, card_id: card.tableId
          card.hpLeft = hero.hp
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
    
class Attack extends Base
  execute: () ->
    _attack = (atker, dfder) ->
      atker.attack (heros) ->
        return if not heros

        # fix bug, 当卡牌出手后，被秒了，出手次数比实际要出手的次数少了一次
        for hero in heros
          dfder.shootCount -= 1 if hero.death() and not hero.isAttacked()
        return

      atker.nextHero()

    if @attacker.shootCount > 0
      @attacker.shootCount -= 1
      _attack( @attacker, @defender ) 

    if @defender.shootCount > 0
      @defender.shootCount -= 1
      _attack( @defender, @attacker ) 

  end: ->
    @attacker.bindCards() if @attacker.death()
    @defender.bindCards() if @defender.death()


    # if @attacker.shootCount > 0
    #   @attacker.shootCount -= 1
    #   @attacker.attack (hero) ->
    #     if hero.death() and not hero.isAttacked()
    #       @defender.shootCount -= 1

    #     if @defender.shootCount > 0
    #       @defender.shootCount -= 1
    #       @defender.attack (hero) ->
    #         if hero.death() and not hero.isAttacked()
    #           @attacker.shootCount -= 1


    # self = this
    # async.series [
    #   (cb) ->
    #     if self.attacker.shootCount > 0
    #       self.attacker.shootCount -= 1
    #       self.attacker.attack (hero) ->
    #         if hero.death() and not hero.isAttacked()
    #           self.defender.shootCount -= 1
            
    #         self.attacker.nextHero()
    #         cb(null)

    #   (cb) ->
    #     if self.defender.shootCount > 0
    #       self.defender.shootCount -= 1
    #       self.defender.attack (hero) ->
    #         if hero.death() and not hero.isAttacked()
    #           self.attacker.shootCount -= 1
    #         self.defender.nextHero()
    # ]

exports = module.exports = Battle