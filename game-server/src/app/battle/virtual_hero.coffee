Hero = require './hero'
tab = require '../manager/table'

class VirtualHero extends Hero
  # init: (data, player) ->
  #   @player = player
  #   @card_id = data.tableId
  #   @skill_lv = 1
  #   @sp_value = data.passiveSkills or []



  loadCardInfo: ->
    card = tab.getTableItem('task_card', @card_id) or \
           tab.getTableItem('pass_card', @card_id)
    if not card
      throw new Error("配置表错误：不能从表 task_card 中找到卡牌信息，卡牌id为 #{@card_id}")

    @name = card.name
    @init_atk = @atk = parseInt(card.atk)
    @init_hp = @hp = parseInt(card.hp)
    @star = 3
    @skill_id = card.skill_id
    @sp_value = [
      {name: 'crit', value: card.crit_rate}
      {name: 'dodge', value: card.dodge_rate}
    ]

module.exports = VirtualHero

