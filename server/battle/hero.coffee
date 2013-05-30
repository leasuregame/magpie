Module = require '../common/module'
Events = require '../common/events'
Skill = require './skill'

tab = require '../model/table'
battleLog = require './battle_log'
utility = require '../common/utility'
_ = require 'underscore'

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
    @pos = '00'
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

  attack: (callback) ->
    if @skill? and @skill.check()
      @usingSkill(callback)
    else
      @normalAttack(callback)

  usingSkill: (callback)->
    console.log @name, 'using skill...', @skill.id, @skill.type ,@skill.name
    doNothing = ->

    switch @skill.type
      when 'single_fight', 'aoe' 
        @skillAttack @skill.getTargets(), callback
      when 'single_heal', 'mult_heal'
        @cure @skill.getTargets(), callback
      else
        doNothing()

  skillAttack: (enemys, callback) ->
    console.log 'skill: ', @skill.type, 'count:', enemys.length
    _step = {a: @idx, d: [], v: [], t: 1}
    # debug
    #_step.type = @skill.type
    
    _len = enemys? and enemys.length
    _dmg = parseInt(@atk * @skill.effectValue())
    _dmg = parseInt(_dmg/_len) if _len > 1

    for enemy in enemys
      enemy.damage _dmg
      
      _step.d.push enemy.idx
      _step.v.push -_dmg
      # debug
      #_step.hp.push enemy.hp
      
      callback enemy

    @log _step     

  cure: (enemys, callback) ->
    _step = {a: @idx, d: [], v: [], t: 1}
    # debug
    #_step.type = @skill.type
    
    for enemy in enemys
      _hp = parseInt(enemy.hp * @skill.effectValue())
      enemy.damage -_hp

      _step.d.push enemy.idx
      _step.v.push _hp

      callback enemy

    @log _step
  normalAttack: (callback) ->
    console.log 'normal attack:', "player id: #{@player.id}, enemy id: #{@player.enemy.id}, hero id: #{@id}, pos: #{@pos}"
    
    _hero = @player.enemy.herosToBeAttacked 'default', @pos
    
    if _.isArray(_hero) and _hero.length is 1
      _hero = _hero[0]
      _hero.damage @atk
      callback _hero
      @log {a: @idx, d: _hero.idx, v: -@atk, t: 0}
      
    else
      throw new Error('Normal Attack Error: can not find target to be attacked.')

  damage: (value) ->
    @hp -= value
    # debug
    console.log @player.name, @id, 'death' if @death()

  log: (step)->
    battleLog.addStep(step)

  death: ->
    @hp <= 0

  setIdx: (idx, atker)->
    @idx = if atker then idx else idx + 6

  setPos: (pos) ->
    @pos = pos

exports = module.exports = Hero