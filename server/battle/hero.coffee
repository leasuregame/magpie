Module = require '../common/module'
Events = require '../common/events'
Skill = require './skill'

tab = require '../model/table'
battleLog = require './battle_log'
utility = require '../common/utility'
_ = require 'underscore'

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

  init: (attrs, player)->
    @player = player
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
    @skill = null

    @loadCardInfo()
    @loadSkill() if @star > 2

  loadCardInfo: ->
    card = tab.getTableItem('cards', @card_id)
    factor = tab.getTableItem('factors', @lv)?.factor
    if not card
      throw new Error("配置表错误：不能从表 #{@constructor.table} 中找到卡牌信息，卡牌id为 #{@card_id}")

    @name = card.name
    @init_atk = @atk = parseInt(card.atk * factor)
    @init_hp = @hp = parseInt(card.hp * factor)
    @skill_id = card.skill_id

  loadSkill: ->
    @skill_setting = tab.getTableItem('skills', @skill_id)
    if @skill_setting?
      @skill = new Skill(@, @skill_setting)
    else
      @skill = null

  attack: (callback) ->
    if @skill? and @skill.check()
      @usingSkill(callback)
    else
      @normalAttack(callback)

  usingSkill: (callback)->
    doNothing = ->

    switch @skill.type
      when 'single_fight' or 'aoe'
        @skillAttack @skill.getTargets(), callback
      when 'single_heal' or 'mult_heal'
        @cure @skill.getTargets(), callback
      else
        doNothing()

  skillAttack: (enemys, callback) ->
    _step = {a: @pos, d: [], v: [], t: 1}

    _len = enemys? and enemys.length
    _dmg = parseInt(@atk * @skill.effectValue())
    _dmg = parseInt(_dmg/_len) if _len > 1

    for enemy in enemys
      enemy.damage _dmg
      
      _step.d.push enemy.pos
      _step.v.push -_dmg
      @log _step

      callback enemy

  cure: (enemys, callback) ->
    _step = {a: @pos, d: [], v: [], t: 1}

    for enemy in enemys
      _hp = parseInt(enemy.hp * @skill.effectValue())
      enemys.damage -_hp

      _step.d.push enemy.pos
      _step.v.push _hp
      @log _step

      callback enemy

  normalAttack: (callback) ->
    console.log "player id: #{@player.id}, enemy id: #{@player.enemy.id}, hero id: #{@id}, pos: #{@pos}"
    
    _hero = @player.enemy.herosToBeAttacked 'default', @pos
    console.log _hero
    if _.isArray(_hero) and _hero.length is 1
      _hero = _hero[0]
      _hero.damage @atk
      callback _hero
      @log {a: @pos, d: _hero.pos, v: @atk, t: 0, hp: @hp}
    else
      throw new Error('Normal Attack Error: can not find target to be attacked.')

  damage: (value) ->
    @hp -= value

  log: (step)->
    battleLog.addStep(step)

  death: ->
    @hp <= 0

exports = module.exports = Hero