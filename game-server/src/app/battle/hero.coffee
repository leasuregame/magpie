Module = require '../common/module'
Events = require '../common/events'
Skill = require './skill'
SpecialProperty = require './special_property'

app = require('pomelo').app;
tab = require '../manager/table'
utility = require '../common/utility'
_ = require 'underscore'
battleLog = require './battle_log'
log = require('pomelo-logger').getLogger(__filename)

STATE_ORIGIN = 0
STATE_ATTACKED = 1
FLOAT_SCOPE = 15

floatUpOrDown = (val) ->
  x = parseInt val * FLOAT_SCOPE / 100
  return _.random val - x, val + x

class Hero extends Module
  @include Events

  @table: 'cards'

  init: (attrs, player)->
    @player = player
    @id = attrs.id
    @lv = attrs.lv
    @init_hp = attrs.hp + (attrs.incs?.spirit_hp or 0)
    @hp = attrs.hp + (attrs.incs?.spirit_hp or 0)
    @atk = attrs.atk + (attrs.incs?.spirit_atk or 0)
    @init_atk = attrs.atk + (attrs.incs?.spirit_atk or 0)
    @spirit_hp = attrs.incs?.spirit_hp or 0
    @spirit_atk = attrs.incs?.spirit_atk or 0
    @hp_only = attrs.hp
    @atk_only = attrs.atk

    @card_id = attrs.tableId
    @skill_lv = attrs.skillLv or 0
    @skill_inc = attrs.skillInc
    @sp_value = attrs.passiveSkills or []
    
    @dmg = 0 # 每次所受伤害的值，默认值为0
    @crit_factor = 1.5 # crit damage factor
    @pos = '00'
    @idx = null
    @state = STATE_ORIGIN

    @skill = null
    @sp = null

    @loadCardInfo()
    @loadSpecialProperty()
    @loadSkill()

  loadCardInfo: ->
    card = tab.getTableItem('cards', @card_id)
    if not card
      throw new Error("配置表错误：不能从表 cards 中找到卡牌信息，卡牌id为 #{@card_id}")

    @name = card.name
    @star = parseInt(card.star)
    @skill_id = card.skill_id

  loadSpecialProperty: ->
    return if @star < 3
    @sp = new SpecialProperty(@sp_value)
    #@sp.takeEffect(@)

  loadSkill: ->
    return if @star < 3
    @skill_setting = tab.getTableItem('skills', @skill_id)
    if @skill_setting?
      @skill = new Skill(@, @skill_setting)

  attack: (callback) ->
    if @skill? and @skill.check()
      enemys = @skill.getTargets()
      @usingSkill(callback, enemys)
    else
      @normalAttack(callback)

    @state = STATE_ATTACKED

  reset: ->
    @state = STATE_ORIGIN

  isAttacked: ->
    @state is STATE_ATTACKED

  isDodge: ->
    if @sp? then @sp.isDodge() else false

  isCrit: ->
    if @sp? then @sp.isCrit() else false

  usingSkill: (callback, enemys = @skill.getTargets(), percent = 100, isSpiritor = false) ->
    return if @player.enemy.death()

    if not enemys or not enemys.length > 0
      log.warn '技能攻击时，攻击的对方卡牌不能为空'
      return

    log.debug @idx, '使用技能', @skill.name, @skill.type

    switch @skill.type
      when 'single_fight', 'aoe' 
        @skillAttack enemys, percent, isSpiritor, callback
      when 'single_heal', 'mult_heal'
        @cure enemys, percent, isSpiritor, callback
      else
        callback()

  skillAttack: (enemys, percent, isSpiritor, callback) ->
    # 负的a的id代表技能攻击
    _step = {a: -@idx, d: [], e: [], r: []}
    _step.t = 1 if isSpiritor
    
    _len = enemys? and enemys.length or 0
    _dmg = parseInt(@atk * @skill.effectValue() * percent / 100)

    for enemy in enemys
      
      if enemy.isDodge()
        # 闪避
        _step.d.push enemy.idx
        _step.e.push 0
        log.debug enemy.idx, '闪避'
        continue
      else if @isCrit()
        # 暴击
        _dmg = parseInt _dmg * @crit_factor
        _d = -enemy.idx # 负索引代表暴击
        log.debug enemy.idx, '暴击'
      else
        _d = enemy.idx

      log.debug "#{enemy.idx} 受到伤害 #{_dmg}"
      ### 上下浮动15% ###
      _dmg = floatUpOrDown(_dmg)

      _step.d.push _d
      _step.e.push -_dmg
      # debug
      _step['dhp'] = enemy.hp

      enemy.damage _dmg, @, _step

    @log _step
    callback enemys     

  cure: (enemys, percent, isSpiritor, callback) ->
    _step = {a: -@idx, d: [], e: []}
    _step.t = 1 if isSpiritor
    
    _hp = parseInt(@atk * @skill.effectValue() * percent / 100)
    if @isCrit()
      _hp *= @crit_factor

    for enemy in enemys      
      ### 上下浮动15% ###
      _hp = floatUpOrDown(_hp)
      realHp = _.min([_hp, enemy.init_hp - enemy.hp])
      enemy.damageOnly -realHp

      _step.d.push enemy.idx
      _step.e.push _hp
      # debug
      _step['dhp'] = enemy.hp

      log.info "#{enemy.idx} 加血 #{realHp}"

    @log _step
    callback enemys

  normalAttack: (callback) ->    
    _hero = @player.enemy.herosToBeAttacked 'default', @pos
    
    if _.isArray(_hero) and _hero.length is 1
      _hero = _hero[0]
      
      _dmg = @atk
      _d = _hero.idx
      if _hero.isDodge()
        _dmg = 0
      else if @isCrit()
        # 暴击
        _dmg = parseInt _dmg * @crit_factor 
        _d = -_hero.idx # 负索引代表暴击
      ### 上下浮动15% ###
      _dmg = floatUpOrDown(_dmg) 

      _step = {a: @idx, d: [_d], e: [-_dmg], r: []}

      log.debug "#{_hero.idx} 受到伤害 #{_dmg}"

      _hero.damage _dmg, @, _step
      # debug
      _step['dhp'] = _hero.hp

      @log _step
      callback _hero
    else
      log.error "普通攻击：找不到对方可攻击的卡牌"
      #throw new Error('Normal Attack Error: can not find target to be attacked.')
      callback()

  damage: (value, enemy, step) ->
    # 检查辅助效果，伤害减少
    _value = @_checkDmgReduce(value, step)

    @hp -= _value

    # 检查，伤害反弹
    # @_checkRebound(enemy, value, step)

    log.debug "#{@idx} 死亡" if @death()
    step['death'] = true if @death()

  damageOnly: (value) ->
    @hp -= value

    log.debug "#{@idx} 死亡" if @death()
    #step['death'] = true if @death()
  
  _checkDmgReduce: (value, step) ->
    _value = @sp?.dmgReduce(value) or value
    if _value < value
      step.e.pop()
      step.e.push -_value
      log.info '伤害减少了：', value - _value

    _value

  _checkRebound: (enemy, value, step) ->
    _val = @sp?.dmgRebound(value) or 0
    if _val isnt 0
      enemy.damageOnly _val
      step.r.push -_val
      log.info "伤害反弹给 #{enemy.idx}, #{_val}"
    else
      step.r.push null

  log: (step)->
    if step.r? and not _.some step.r
      delete step.r
    battleLog.addStep(step)

  death: ->
    @hp <= 0

  setIdx: (idx, atker)->
    @idx = if atker then idx + 1 else idx + 7

  setPos: (pos) ->
    @pos = pos

exports = module.exports = Hero