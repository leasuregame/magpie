Module = require '../common/module'
Events = require '../common/events'
Skill = require './skill'
SpecialProperty = require './special_property'

tab = require '../manager/table'
utility = require '../common/utility'
_ = require 'underscore'
battleLog = require './battle_log'
log = require('pomelo-logger').getLogger(__filename)

STATE_ORIGIN = 0
STATE_ATTACKED = 1

class Hero extends Module
  @include Events

  @table: 'cards'

  init: (attrs, player)->
    @player = player
    @id = attrs.id
    @lv = attrs.lv
    @card_id = attrs.tableId
    @skill_lv = attrs.skillLv or 1
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
    factor = tab.getTableItem('factors', @lv)?.factor
    if not card
      throw new Error("配置表错误：不能从表 cards 中找到卡牌信息，卡牌id为 #{@card_id}")

    @name = card.name
    @init_atk = @atk = parseInt(card.atk * factor)
    @init_hp = @hp = parseInt(card.hp * factor)
    @star = parseInt(card.star)
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
    if @skill? and @skill.check(enemys)
      enemys = @skill.getTargets()
      @usingSkill(enemys, callback)
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

  usingSkill: (enemys, callback)->
    if not enemys or not enemys.length > 0
      log.warn '技能攻击时，攻击的对方卡牌不能为空'
      return

    log.debug @idx, '使用技能', @skill.name, @skill.type

    switch @skill.type
      when 'single_fight', 'aoe' 
        @skillAttack enemys, callback
      when 'single_heal', 'mult_heal'
        @cure enemys, callback
      else
        callback()

  skillAttack: (enemys, callback) ->
    # 负的a的id代表技能攻击
    _step = {a: -@idx, d: [], e: [], r: []} 
    
    _len = enemys? and enemys.length or 0
    _dmg = parseInt(@atk * (1 + @skill.effectValue()))
    _dmg = parseInt(_dmg/_len) if _len > 1

    for enemy in enemys
      
      if enemy.isDodge()
        # 闪避
        _step.d.push _d
        _step.e.push 0
        log.debug enemy.idx, '闪避'
        callback enemy
        continue
      else if @isCrit()
        # 暴击
        _dmg *= @crit_factor
        _e = -_dmg
        _d = -enemy.idx
        log.debug enemy.idx, '暴击'
      else
        _e = -_dmg
        _d = enemy.idx

      log.debug "#{enemy.idx} 受到伤害 #{_e}"

      _step.d.push _d
      _step.e.push _e
      # debug
      _step['dhp'] = enemy.hp

      enemy.damage _dmg, @, _step

      callback enemy

    @log _step     

  cure: (enemys, callback) ->
    _step = {a: -@idx, d: [], e: []}
    
    for enemy in enemys
      _hp = parseInt(@init_hp * @skill.effectValue())
      enemy.damageOnly -_hp

      _step.d.push enemy.idx
      _step.e.push _hp
      # debug
      _step['dhp'] = enemy.hp

      callback enemy
      log.info "#{enemy.idx} 加血 #{_hp}"

    @log _step

  normalAttack: (callback) ->    
    _hero = @player.enemy.herosToBeAttacked 'default', @pos
    
    if _.isArray(_hero) and _hero.length is 1
      _hero = _hero[0]
      
      _dmg = @atk

      _e = -_dmg
      _d = _hero.idx
      if _hero.isDodge()
        _dmg = 0
        _e = 0
      else if @isCrit()
        # 暴击
        _dmg *= @crit_factor 
        _e = -_dmg
        _d = -_hero.idx # 负索引代表暴击

      _step = {a: @idx, d: [_d], e: [_e], r: []}

      log.debug "#{_hero.idx} 受到伤害 #{_e}"

      _hero.damage _dmg, @, _step
      callback _hero
      # debug
      _step['dhp'] = _hero.hp

      @log _step
      
    else
      log.error "普通攻击：找不到对方可攻击的卡牌"
      #throw new Error('Normal Attack Error: can not find target to be attacked.')

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
    @idx = if atker then idx else idx + 6

  setPos: (pos) ->
    @pos = pos

exports = module.exports = Hero