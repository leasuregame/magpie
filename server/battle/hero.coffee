Module = require '../common/module'
Events = require '../common/events'
tab = require '../model/table'
util = require 'util'
magic = require './magic'

class Hero extends Module
  @extend Events

  @table: 'hero'

  init: (attrs)->
    @id = attrs.id
    @lv = attrs.lv
    @star = attrs.star
    @card_id = attrs.card_id
    @loadCardInfo()
    @loadSkill()

  loadCardInfo: ->
    card = tab.getTableItem('cards', @card_id)
    if not card
      throw new Error("配置表错误：不能从表 #{@table} 中找到卡牌信息，卡牌id为 #{@card_id}")

    @name = card.name
    @init_crit = card.init_crit
    @init_dodge = card.init_dodge
    @atk = card.init_atk + card.grow_atk * @lv
    @hp = card.init_hp + card.grow_hp *@lv
    @skill_id = card.skill_id

  loadSkill: ->
    skill_setting = tab.getTableItem('skills', @skill_id)
    @skill = magic[skill_setting.magic_id].create()
    if skill_setting.trigger_condition is 'passive'
      @skill.activate(@, skill_setting)

  attack: (enemys, cb) ->
    enemys = [enemys] if not util.isArray(enemys)
    enemys.forEach (enemy) =>
      enemy.hp -= @atk

    cb(enemys) if cb

  death: ->
    @hp <= 0

exports = module.exports = Hero