util = require 'util'
Event = (require 'events').EnventEmitter

'''
Battle log steps 格式:
  [攻击方]:[承受方,一个或多个]:[技能]:[技能产生的效果]
'''
class BattleLog
  constructor: ->
    @result = {}
    @steps = []
    @print = []

  set: (key, value) ->
    @result[key] = value

  setWinner: (winner) ->
    @set('winner', winner)

  addPrint: (atker, dfder, hero, enemys)->
    ids = enemys.map((e)-> e.id)
    @print.push "玩家#{atker.id}的英雄#{hero.id} =攻击=》玩家#{dfder.id}的英雄#{ids}, #{hero.skill}:#{hero.effects}"
    
    @print.push " -- 攻击方：英雄#{hero.id}剩余血量: #{hero.hp}, 攻击伤害：#{hero.atk}"
    for emy in enemys
      @print.push " -- 承受方：英雄#{emy.id}剩余血量: #{emy.hp}, 攻击伤害：#{emy.atk}"

    enemys.forEach (e) =>
      if e.death()
        @print.push "英雄#{e.id} 被 英雄#{hero.id} 杀死"

    if dfder.death()
      @print.push "玩家#{dfder.id} 被 玩家#{atker.id} 击败"


  addStep: (atk_id, def_ids, skill, effects) ->
    @steps.push( @pattern.apply(@, arguments) )

  pattern: (atk_id, def_ids, skill, effects) ->
    "#{atk_id}:#{def_ids}:#{skill}:#{effects}"

  reports: ->
    @set('steps', @steps)
    @result

class Base #extends Event
  constructor: (attacker, defender) ->
    @attacker = attacker
    @defender = defender
    @isStop = false
    @battleLog = null

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

    @battleLog = new BattleLog()
    @battleLog.set('enemy', @defender)
    @round.battleLog = @battleLog

  execute: ->
    while not @isOver()
      @round.execute()
      @round.increase_round_num()

    @battleLog.setWinner( if @defender.death() then @attacker else @defender )

class Round extends Base
  constructor: ->
    super

  init: ->
    @round_num = 1
    @setShootCount()
    @attack = new Attack(@attacker, @defender)
    @attack.battleLog = @battleLog

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

      @battleLog.addStep(
        hero.id, 
        enemys.map((e)-> e.id),
        hero.skill,
        hero.effects
      )

      @battleLog.addPrint(atker, dfder, hero, enemys)
    
    _attack( @attacker, @defender ) if @attacker.shootCount > 0
    _attack( @defender, @attacker ) if @defender.shootCount > 0
    

    '''
    Player定义一个round_num变量，表示当前处在哪个回合，round_num的值可能为1,2,3...
    找出所以的出触发时间的时间点，在所有时间点触发对应的事件
    在对应的事件注册对应的技能处理函数，当事件触发时，执行函数
    这个事件触发机制可以参考侠客天下战斗模型的实现
    '''

exports = module.exports = Battle