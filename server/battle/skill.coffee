defautls = 


class Skill
  constructor: (hero, attrs)->
    @hero = hero
    @_attrs = attrs or defautls
    for key, value of @_attrs
      @[key] = value

    @hero.bind @trigger_condition, @

  execute: ->
    targets = @get_targets()
    magic = Magic[@magic_id].create()
    magic.activate(@hero, targets, @_attrs)
    magic.execute()
    magic.inactivate()

  get_targets: ->
    @target()?.herosToBeAttacked @scope, @random_num

  target: ->
    return @hero.player if @target is 'own'
    return @hero.player.enemy if @target is 'enemy'
    throw new Error("Skill: can't get target with '#{@target}' ")

  get_round_num: ->
    @target()?.round_num

  check: ->
    @rate or -1



condition = 
  'passive': '被动'
  'passive_rate': '概率触发'
  
  'before_attack': '攻击之前触发'
  'on_attack': '攻击的时候触发'
  'after_attack': '攻击之后触发'
  'on_damage': '受到伤害'
  'on_dodge': '闪避'
  'on_crit': '暴击之后'
  'on_hp_reduce_to': '生命值降低到N%以下时'
  'on_self_death': '自身阵亡'
  'on_self_card_death': '己方卡牌阵亡'
  'on_enemy_card_death': '敌方卡牌阵亡'

magic = 
  'atk_lengthways': '纵向群体攻击'
  'atk_crossways_front': '横向前排群体攻击'
  'atk_crossways_back': '横向后排群体攻击'
  
  'damage_share': '伤害分摊'
  'damage_rebound': '伤害反弹'
  'damage_reduce': '降低所受伤害'
  
  'atk_improve': '攻击力提升'
  'atk_reduce': '攻击降低'
  'atk_steal': '攻击偷取'
  'atk_multiple': '连击'
  'atk_self_card': '攻击己方卡牌'
  'atk_forbid': '不能攻击'
  'atk_hp_promote': '同时提升攻击和生命'
  'atk_one_more': '额外攻击一次'
  
  'hp_improve': '生命值提升'
  'hp_reduce': '生命值降低'
  'hp_steal': '生命值偷取'
 
  'dodge_improve': '提高闪避率'
  'dodge_ignore': '忽视闪避'
  
  'crit_ignore': '免疫暴击'
  'crit_improve_rate': '提高暴击率'
  'crit_improve_damage': '提高暴击伤害'
  
  'resurrection': '复活'
