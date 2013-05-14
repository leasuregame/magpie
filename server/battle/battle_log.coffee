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


  addStep: (atk_id, def_ids, type, effect) ->
    @steps.push( 
      attacker: atk_id
      defender: def_ids
      type: type
      effect: effect
     )

  reports: ->
    @set('steps', @steps)
    @result

exports = module.exports = new BattleLog()