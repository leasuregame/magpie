Module = require '../common/module'
Events = require '../common/events'
tab = require '../model/table'
Magic = require './magic'
battleLog = require './battle_log'
Skill = require './skill'

util = require 'util'
_ = require 'underscore'
utility = require '../common/utility'

ATTACK_TYPE = 
  normal:           'normal'
  crit:             'crit'
  multiple_hit:     'multiple_hit'
  lengthways:       'lengthways'
  crossways_front:  'crossways_front'
  crossways_back:   'crossways_back'
  charm:            'charm' # 魅惑
  stun:             'stun' # 晕眩
  dodge:            'dodge' # 闪避
  damage_share:     'damage_share' # 伤害分摊
  damage_rebound:   'damage_rebound' # 伤害反弹
  hp_steal:         'hp_steal' # 生命值偷取
  atk_steal:        'atk_steal' # 攻击力偷取 
  resurrection:     'resurrection' # 复活

class Hero extends Module
  @include Events

  @table: 'cards'

  init: (attrs)->
    @id = attrs.id
    @lv = attrs.lv
    @star = attrs.star
    @card_id = attrs.card_id
    @skill_lv = attrs.skill_lv or 1
    
    @is_crit = false
    @is_dodge = false
    @cant_miss = false
    @cant_be_crit = false
    @dmg = 0 # 每次所受伤害的值，默认值为0
    @crit_factor = 1.5 # crit damage factor
    @pos = 0

    @loadCardInfo()
    @loadSkill() if @star > 2
    # 被动触发，永久生效
    

    ##console.log 'hero: ', @

  loadCardInfo: ->
    card = tab.getTableItem('cards', @card_id)
    if not card
      throw new Error("配置表错误：不能从表 #{@constructor.table} 中找到卡牌信息，卡牌id为 #{@card_id}")

    @name = card.name
    @init_crit_rate = @crit_rate = card.init_crit
    @init_dodge_rate = @dodge_rate = card.init_dodge
    @init_atk = @atk = card.init_atk + card.grow_atk * @lv
    @init_hp = @hp = card.init_hp + card.grow_hp * @lv
    @skill_id = card.skill_id

  loadSkill: ->
    
    @skill_setting = tab.getTableItem('skills', @skill_id)
    @skill = if @skill_setting? then new Skill(@, @skill_setting) else null
    #@magic = if @skill_setting? then Magic[@skill_setting.magic_id]?.create() else null
    #@magic.activate(@, @, @skill_setting) if @magic?
    @trigger 'passive', @

    console.log 'skill id', @skill_id
    console.log 'atk,', @atk

  attack: (enemys, callback) ->
    #console.log 'attack hero: ', enemys
    enemys = [enemys] if not _.isArray(enemys)
    
    # 发起进攻之前触发
    @trigger 'before_attack', @
    enemys.forEach (enemy) =>
      if not @cant_miss and enemy.isDodge()
        enemy.dodge()
        @log(enemy, ATTACK_TYPE.dodge, '')
        return

      if not enemy.cant_be_crit and @isCrit()
        @crit()
        enemy.dmg = @atk * @crit_factor
        enemy.suffer_crit()
        @log(enemy, ATTACK_TYPE.crit, @atk * @crit_factor)
      else
        enemy.dmg = @atk
        enemy.damage()
        @log(enemy, ATTACK_TYPE.normal, @atk)

      #敌方卡牌阵亡之后触发
      @trigger 'on_enemy_card_death', @ if enemy.death()

      callback enemy

    # 发起进攻之后触发
    @trigger 'after_attack', @

  skillAttack: (enemys, callback) ->
    @attack enemys, callback    

  normalAttack: (enemy, callback) ->
    @attack enemy, callback

  suffer_crit: ->
    @damage()
    # 自身卡牌受到暴击之后触发
    @trigger 'on_suffer_crit', @
    # 己方任意一张卡牌受到暴击之后触发
    @trigger 'on_card_suffer_crit', @

  crit: (enemy)->
    # 自身造成暴击之后触发
    @trigger 'on_crit', @
    # 己方任意一张卡牌对敌方卡牌造成暴击之后触发
    @trigger 'on_card_crit', @
    @is_crit = true

  dodge: ->
    # 闪避触发
    @trigger 'on_dodge', @
    @is_dodge = true

  damage: (value) ->
    # 自身卡牌受到伤害之前触发
    @trigger 'before_damage', @
    @hp -= @dmg
    # 自身卡牌受到伤害后触发
    @trigger 'after_damage', @
    # 生命值降低之后触发
    @trigger 'after_hp_reduce', @
    # 自身卡牌受到攻击后触发
    @trigger 'on_attack', @
    
    # 自身卡牌阵亡后触发
    if @death()
      @trigger 'on_self_death', @
      @trigger 'on_self_card_death', @
      #@log('', 'death', "#{@.name} is death")

  log: (enemy, type, value)->
    battleLog.addStep(@name, enemy?.name, type, "#{value}/#{enemy.hp}")
    
  isCrit: ->
    utility.hitRate(@crit_rate)

  isDodge: ->
    utility.hitRate(@dodge_rate)

  death: ->
    @hp <= 0

exports = module.exports = Hero