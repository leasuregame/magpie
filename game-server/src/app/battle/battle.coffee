battleLog = require './battle_log'
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
    @attacker.setEnemy(@defender, true)
    @defender.setEnemy(@attacker)
    @round = new Round(@attacker, @defender)

  start: ->
    _enm = {
      id: @defender.id
      name: @defender.name
      lv: @defender.lv
      cards: @defender.getCards()
    }
    battleLog.set('enemy', _enm)
    battleLog.set('own', {cards: @attacker.getCards()})
    log.info '    >>> 战斗开始 <<<    '

  execute: ->
    while not @isOver()
      @round.process()
      @round.increase_round_num()

  end: ->
    battleLog.setWinner( 'own' ) if @defender.death()
    battleLog.setWinner( 'enemy' ) if @attacker.death()

    log.info '    >>> 战斗结束 <<<    '

class Round extends Base
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
    (@attacker.shootCount <= 0 and @defender.shootCount <= 0) or \
    #(@attacker.bulletOut() and @defender.bulletOut()) or \
    @attacker.death() or @defender.death()

  start: ->
    @setShootCount()
    log.info "*** 回合 #{@round_num} 开始 ***"

  execute: () ->
    while not @isOver()
      @attacker.round_num = @defender.round_num = @round_num
      @attack.process()

  end: ->
    @setShootCount()
    @attacker.reset()
    @defender.reset()

    log.info "*** 回合 #{@round_num} 结束 ***"
    
class Attack extends Base
  execute: () ->
    # @attacker.attack (hero) ->
    # @attacker.nextHero()

    # @defender.attack (hero) ->
    # @defender.nextHero()

    _attack = (atker, dfder) ->
      atker.attack (hero) ->
        # bug, 当卡牌出手后，没秒了，出手次数比实际要出手的次数少了一次
        if hero.death() and not hero.isAttacked()
          dfder.shootCount -= 1 

      atker.nextHero()

    if @attacker.shootCount > 0
      @attacker.shootCount -= 1
      _attack( @attacker, @defender ) 
    if @defender.shootCount > 0
      @defender.shootCount -= 1
      _attack( @defender, @attacker ) 

exports = module.exports = Battle