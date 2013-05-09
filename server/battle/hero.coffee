Module = require '../common/module'
Events = require '../common/events'
db = require '../model/db'
util = require 'util'
tm = require '../common/table_manager'
Magic = require './magic'

class Hero extends Module
  @extend Events

  @table: 'hero'

  constructor: (id)->
    @id = null
    @hp = 0
    @atk = 0
    @level = 0
    @skill = ''
    @effects = ''

    @slots = []
    @magic = []
    @load(id) if id?
    
    super

  init: (attrs)->
    @lv = attrs.lv
    @star = attrs.star
    @card_id = attrs.card_id
    @loadCardInfo()
    @loadSkill()

  loadCardInfo: ->
    card = tm.Cards.getRow(@card_id)
    if not card
      throw new Error('配置表错误：不能从表 #{@table} 中找到卡牌信息，卡牌id为 #{@card_id}')

    @name = card.name
    @init_crit = card.init_crit
    @init_dodge = card.init_dodge
    @atk = card.init_atk + card.grow_atk * @lv
    @hp = card.init_hp + card.grow_hp *@lv
    @skill_id = card.skill_id

  loadSkill: ->
    row = tm.skills.getRow(@skill_id)
    @skill = Magic[row.magic_id].create()
    if row.trigger_condition is tm.const.passive
      @skill.activate(@, row['skill'+@lv])

  load: (id) ->
    # load hreos data from db
    model = db.find(@constructor.table, id)
    
    if not model
      throw new Error('Can not find Hero with id ' + id)

    for key, value of model
      if model.hasOwnProperty(key) and typeof @[key] is 'function'
        @[key](value)
      else
        @[key] = value
        
    this

  laodSkill: ->


  attack: (enemys, cb) ->
    enemys = [enemys] if not util.isArray(enemys)
    enemys.forEach (enemy) =>
      enemy.hp -= @atk

    cb(enemys) if cb

  death: ->
    @hp <= 0

exports = module.exports = Hero