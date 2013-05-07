class Skill
  constructor: ->
    @id = 0
    @name = 'skill'
    @rate = 30
    @limit = 3 # 每次战斗最高触发次数限制
    @condition = '被动' # 触发条件
    @magic = '' # 魔法技能效果，如： 提供攻击、免疫暴击、不能攻击
    @when = '' # 触发时机， 立即生效、下回合生效、永久生效
    @target = '' #作用方, 自身、对方
    @impact_cards = [] #'影响的卡牌', # 自身卡牌，前排所有，后排所有，纵向所有，所有卡牌，随机N张卡牌 等
    @atk_max = [] #攻击最高卡
    @atk_min = [] #攻击最低卡
    @hp_max = [] #生命最高卡
    @hp_min = [] #生命最低卡
    @star3 = '10%:5%' #三星1级效果，每级增幅 5%
    @star4 = '15%:5%'
    @star5 = '20%:10%'

condition = 
  'passive': '被动'
  'rate_trigger': '概率触发'
  
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
