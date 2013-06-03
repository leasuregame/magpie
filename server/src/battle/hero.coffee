Module = require '../common/module'
Events = require '../common/events'
Skill = require './skill'
SpecialProperty = require './special_property'

tab = require '../model/table'
battleLog = require './battle_log'
utility = require '../common/utility'
_ = require 'underscore'
log = require '../common/logger'

class Hero extends Module
  @include Events

  @table: 'cards'

  init: (attrs, player)->
    @player = player
    @id = attrs.id
    @lv = attrs.lv
    @star = attrs.star
    @card_id = attrs.card_id
    @skill_lv = attrs.skill_lv or 1
    @sp_value = attrs.sp_value or []
    
    @is_crit = false
    @is_dodge = false
    @cant_miss = false
    @cant_be_crit = false
    @dmg = 0 # 每次所受伤害的值，默认值为0
    @crit_factor = 1.5 # crit damage factor
    @pos = '00'
    @skill = null

    @loadCardInfo()
    @loadSpecialProperty()
    @loadSkill()

  loadCardInfo: ->
    card = tab.getTableItem('cards', @card_id)
    factor = tab.getTableItem('factors', @lv)?.factor
    if not card
      throw new Error("配置表错误：不能从表 #{@constructor.table} 中找到卡牌信息，卡牌id为 #{@card_id}")

    @name = card.name
    @init_atk = @atk = parseInt(card.atk * factor)
    @init_hp = @hp = parseInt(card.hp * factor)
    @skill_id = card.skill_id

  loadSpecialProperty: ->
    return if @star < 3
    @sp = new SpecialProperty(@sp_value)
    @sp.takeEffect(@)

  loadSkill: ->
    return if @star < 3
    @skill_setting = tab.getTableItem('skills', @skill_id)
    if @skill_setting?
      @skill = new Skill(@, @skill_setting)

  attack: (callback) ->
    @setCrit()

    if @skill? and @skill.check()
      @usingSkill(callback)
    else
      @normalAttack(callback)

    @unsetCrit()

  setCrit: ->
    @is_crit = @sp.isCrit()

  unsetCrit: ->
    @is_crit = false

  isDodge: ->
    @sp.isDodge()

  isCrit: ->
    @sp.isCrit()

  usingSkill: (callback)->
    #console.log @name, 'using skill...', @skill.id, @skill.type ,@skill.name
    doNothing = ->

    switch @skill.type
      when 'single_fight', 'aoe' 
        @skillAttack @skill.getTargets(), callback
      when 'single_heal', 'mult_heal'
        @cure @skill.getTargets(), callback
      else
        doNothing()

  skillAttack: (enemys, callback) ->
    #console.log 'skill: ', @skill.type, 'count:', enemys.length
    _step = {a: -@idx, d: [], e: [], r: [], ahp: @hp, dhp: []}
    # debug
    _step.type = @skill.type

    if @skill.type is 'aoe'
      console.log '-enemys-', enemys
    
    _len = enemys? and enemys.length
    _dmg = parseInt(@atk * @skill.effectValue())
    _dmg = parseInt(_dmg/_len) if _len > 1

    for enemy in enemys
      _e = -_dmg
      _d = enemy.idx
      if enemy.isDodge()
        # 闪避
        _dmg = _e = 0
      else if @isCrit()
        # 暴击
        _dmg *= @crit_factor
        _e = -_dmg
        _d = -enemy.idx

      enemy.damage _dmg, @, _step
      
      _step.d.push _d
      _step.e.push _e
      # debug
      _step.dhp.push enemy.hp
      
      callback enemy

    @log _step     

  cure: (enemys, callback) ->
    _step = {a: -@idx, d: [], v: [], t: 1}
    # debug
    _step.type = @skill.type
    
    for enemy in enemys
      _hp = parseInt(enemy.hp * @skill.effectValue())
      enemy.damageOnly -_hp

      _step.d.push enemy.idx
      _step.v.push _hp

      callback enemy

    @log _step
  normalAttack: (callback) ->
    #console.log 'normal attack:', "player id: #{@player.id}, enemy id: #{@player.enemy.id}, hero id: #{@id}, pos: #{@pos}"
    
    _hero = @player.enemy.herosToBeAttacked 'default', @pos
    
    if _.isArray(_hero) and _hero.length is 1
      _hero = _hero[0]
      
      _dmg = @atk

      _v = -_dmg
      _d = _hero.idx
      if _hero.isDodge()
        _dmg = 0
        _v = 0
      else if @isCrit()
        # 暴击
        _dmg *= @crit_factor 
        _v = -_dmg
        _d = -_hero.idx # 负索引代表暴击

      _step = {a: @idx, d: [_d], e: [_v], r: [], death: _hero.death(), ahp: @hp, dhp: _hero.hp}

      _hero.damage _dmg, @, _step
      callback _hero

      @log _step
      
    else
      throw new Error('Normal Attack Error: can not find target to be attacked.')

  damage: (value, enemy, step) ->
    # 检查辅助效果，伤害减少
    value = @sp?.dmgReduce(value) or value

    @hp -= value

    # 检查，伤害反弹
    _val = @sp?.dmgRebound(value) or 0
    if _val isnt 0
      enemy.damageOnly _val
      step.r.push -_val
    else
      step.r.push null

    # debug
    console.log @player.name, @id, 'death' if @death()

  damageOnly: (value) ->
    @hp -= value

  log: (step)->
    if step.r? and not _.some step.r
      delete step.r
    battleLog.addStep(step)

  death: ->
    @hp <= 0

  setIdx: (idx, atker)->
    @idx = if atker then idx else idx + 6

  setPos: (pos) ->
    @pos = pos

exports = module.exports = Hero