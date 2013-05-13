Module = require '../common/module'
Events = require '../common/events'
tab = require '../model/table'
magic = require './magic'

util = require 'util'
_ = require 'underscore'

class Hero extends Module
  @include Events

  @table: 'cards'

  init: (attrs)->
    @id = attrs.id
    @lv = attrs.lv
    @star = attrs.star
    @card_id = attrs.card_id
    
    @is_crit = false
    @is_dodge = false

    @loadCardInfo()
    @loadSkill()
    # 被动触发，永久生效
    @trigger('passive')

  loadCardInfo: ->
    card = tab.getTableItem('cards', @card_id)
    if not card
      throw new Error("配置表错误：不能从表 #{@constructor.table} 中找到卡牌信息，卡牌id为 #{@card_id}")

    console.log 'card', card
    @name = card.name
    @init_crit_rate = @crit_rate = card.init_crit
    @init_dodge_rate = @dodge_rate = card.init_dodge
    @init_atk = @atk = card.init_atk + card.grow_atk * @lv
    @init_hp = @hp = card.init_hp + card.grow_hp * @lv
    @skill_id = card.skill_id

  loadSkill: ->
    console.log 'skill id', @skill_id
    @skill_setting = tab.getTableItem('skills', @skill_id)
    @skill = if @skill_setting? then magic[@skill_setting.magic_id].create() else null
    @skill.activate(@, @skill_setting) if @skill?

  attack: (enemys, callback) ->
    enemys = [enemys] if not _.isArray(enemys)
    
    enemys.forEach (enemy) =>
      if enemy.isDodge()
        enemy.dodge()
        return

      if @isCrit()
        @crit()
        enemy.suffer_crit @atk * 1.5
      else
        enemy.damage @atk

      #敌方卡牌阵亡之后触发
      @trigger 'on_enemy_card_death' if enemy.death()

      callback enemy

  suffer_crit: (value)->
    @damage value
    # 自身卡牌受到暴击之后触发
    @trigger 'on_suffer_crit'
    # 己方任意一张卡牌受到暴击之后触发
    @trigger 'on_card_suffer_crit'

  crit: (enemy)->
    # 自身造成暴击之后触发
    @trigger 'on_crit'
    # 己方任意一张卡牌对敌方卡牌造成暴击之后触发
    @trigger 'on_card_crit'

  dodge: ->
    # 闪避触发
    @trigger 'on_dodge'
    @isDodge = true

  damage: (value) ->
    @hp -= value
    # 生命值降低之后触发
    @trigger 'on_hp_reduce'
    # 自身卡牌受到攻击后触发
    @trigger 'on_attack'
    # 自身卡牌受到伤害后触发
    @trigger 'on_damage'
    # 自身卡牌阵亡后触发
    if death()
      @trigger 'on_self_death'
      @trigger 'on_self_card_death'
    
  isCrit: ->
    @hitRate(@crit_rate)

  isDodge: ->
    @hitRate(@dodge_ratess)

  hitRate: (rate) ->
    rate = parseInt(rate)
    if isNaN(rate) or rate < 0 and rate > 100
      throw new Error("Invilid argument: can't pass #{rate} to int")
    
    rd = _.random(0, 100)
    if rd <= rate then true else false

  death: ->
    @hp <= 0

exports = module.exports = Hero