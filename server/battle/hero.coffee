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
    @trigger('passive')

  loadCardInfo: ->
    card = tab.getTableItem('cards', @card_id)
    if not card
      throw new Error("配置表错误：不能从表 #{@table} 中找到卡牌信息，卡牌id为 #{@card_id}")

    @name = card.name
    @init_crit_rate = card.init_crit
    @init_dodge_rate = card.init_dodge
    @init_atk = @atk = card.init_atk + card.grow_atk * @lv
    @init_hp = @hp = card.init_hp + card.grow_hp * @lv
    @skill_id = card.skill_id

  loadSkill: ->
    skill_setting = tab.getTableItem('skills', @skill_id)
    @skill = magic[skill_setting.magic_id].create()
    #@skill.activate(@, skill_setting)

  attack: (enemys, cb) ->
    enemys = [enemys] if not _.isArray(enemys)
    
    enemys.forEach (en) =>
      en.trigger('on_attack')
      
      atk_val = @atk
      if @isCrit()
        @is_crit = true
        en.trigger('on_crit') 
        atk_val = @atk * 1.5

      en.damage(atk_val)

  damage: (value) ->
    if @isDodge()
      @is_dodge = true
      @trigger('on_dodge')
      return

    @hp -= value
    @trigger('on_damage')
    @trigger('on_self_death') if death()
    
  isCrit: ->
    @hitRate(@init_crit_rate)

  isDodge: ->
    @hitRate(@init_dodge_ratess)

  hitRate: (rate) ->
    rate = parseInt(rate)
    if isNaN(rate) or rate < 0 and rate > 100
      throw new Error("Invilid argument: can't pass #{rate} to int")
    
    rd = _.random(0, 100)
    if rd <= rate then true else false

  death: ->
    @hp <= 0

exports = module.exports = Hero