Module = require '../common/module'
Events = require '../common/events'
Skill = require './skill'
SpecialProperty = require './special_property'

app = require('pomelo').app;
tab = require '../manager/table'
utility = require '../common/utility'
_ = require 'underscore'
battleLog = require './battle_log'
logger = require('pomelo-logger').getLogger('battle-log', __filename)

STATE_ORIGIN = 0
STATE_ATTACKED = 1
FLOAT_SCOPE = 15

floatUpOrDown = (val) ->
  x = parseInt val * FLOAT_SCOPE / 100
  return parseInt _.random val - x, val + x

class Hero extends Module
  @include Events

  @table: 'cards'

  init: (attrs, player)->
    @player = player
    @id = attrs.id
    @lv = attrs.lv
    @spirit_hp = parseInt attrs.incs?.spirit_hp*(100+player.inc_scale)/100 or 0
    @spirit_atk = parseInt attrs.incs?.spirit_atk*(100+player.inc_scale)/100 or 0
    @init_hp = @hp = parseInt (attrs.hp + @spirit_hp)*(100+player.inc_scale)/100
    @init_atk = @atk = parseInt (attrs.atk + @spirit_atk)*(100+player.inc_scale)/100

    @hp_only = @hp
    @atk_only = @atk

    @card_id = attrs.tableId
    @skill_lv = attrs.skillLv or 1
    @skill_inc = attrs.skillInc or attrs.getSkillInc?()
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

  isDodge: (enemy) ->
    if @sp? then @sp.isDodge(enemy.sp?.get('hit')) else false

  isCrit: (enemy) ->
    if @sp? then @sp.isCrit(enemy.sp?.get('toughness')) else false

  usingSkill: (callback, enemys = @skill.getTargets(), percent = 100, isSpiritor = false) ->
    return callback() if @player.enemy.death()

    if not enemys or enemys.length is 0
      return callback()

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
      continue if enemy.death()
      
      if enemy.isDodge(@)
        # 闪避
        _step.d.push enemy.idx
        _step.e.push 0
        continue
      else if @isCrit(enemy)
        # 暴击
        _dmg = parseInt _dmg * @crit_factor
        _d = -enemy.idx # 负索引代表暴击
      else
        _d = enemy.idx
      ### 上下浮动15% ###
      _dmg = floatUpOrDown(_dmg)

      _step.d.push _d
      _step.e.push -_dmg
      enemy.damage _dmg, @, _step

    @log _step
    callback enemys     

  cure: (enemys, percent, isSpiritor, callback) ->
    _step = {a: -@idx, d: [], e: []}
    _step.t = 1 if isSpiritor
    
    ### 卡牌治疗效果按卡牌最大生命值来计算 ###
    _hp = parseInt(@init_hp * @skill.effectValue() * percent / 100)
    
    for enemy in enemys      
      if @isCrit(enemy)
        _hp *= @crit_factor
        _d = -enemy.idx
      else
        _d = enemy.idx

      ### 上下浮动15% ###
      _hp = floatUpOrDown(_hp)
      realHp = _.min([_hp, enemy.init_hp - enemy.hp])
      realHp = 0 if realHp < 0
      enemy.damageOnly -realHp

      _step.d.push _d
      _step.e.push _hp

    @log _step
    callback enemys

  normalAttack: (callback) ->    
    _hero = @player.enemy.herosToBeAttacked 'default', @pos
    
    if _hero? and _.isArray(_hero) and _hero.length is 1
      _hero = _hero[0]
      
      _dmg = @atk
      _d = _hero.idx
      if _hero.isDodge(@)
        _dmg = 0
      else if @isCrit(_hero)
        # 暴击
        _dmg = parseInt _dmg * @crit_factor 
        _d = -_hero.idx # 负索引代表暴击
      ### 上下浮动15% ###
      _dmg = floatUpOrDown(_dmg) 

      _step = {a: @idx, d: [_d], e: [-_dmg], r: []}

      _hero.damage _dmg, @, _step
      @log _step
      callback _hero
    else
      #throw new Error('Normal Attack Error: can not find target to be attacked.')
      callback()

  damage: (value, enemy, step) ->
    # 检查辅助效果，伤害减少
    _value = @_checkDmgReduce(enemy, value, step)

    @hp -= _value
    
    # 检查，伤害反弹
    # @_checkRebound(enemy, value, step)

  damageOnly: (value) ->
    @hp -= value
  
  _checkDmgReduce: (enemy, value, step) ->
    _value = @sp?.dmgReduce(value, enemy.sp?.get('disrupting')) or value
    if _value < value
      step.e.pop()
      step.e.push -_value

    _value

  _checkRebound: (enemy, value, step) ->
    _val = @sp?.dmgRebound(value) or 0
    if _val isnt 0
      enemy.damageOnly _val
      step.r.push -_val
    else
      step.r.push null

  log: (step)->
    if step.r? and not _.some step.r
      delete step.r

    # 记录回合数
    step.p = @player.round_num
    battleLog.addStep(step)

  death: ->
    @hp <= 0

  setIdx: (idx, atker) ->
    @idx = if atker then idx + 1 else idx + 7

  setPos: (pos) ->
    @pos = pos
    @idx = @player.matrix.positionToNumber(pos)

exports = module.exports = Hero