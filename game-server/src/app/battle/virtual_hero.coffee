Hero = require './hero'
tab = require '../manager/table'

class VirtualHero extends Hero
  init: (data, player) ->
    @player = player
    @boos = data.boss if data.boss?

    super(data, player)

  loadCardInfo: ->
    card_config = tab.getTableItem('task_card', @card_id)

    card = tab.getTableItem('cards', card_config.card_id)
    if not card
      throw new Error("配置表错误：不能从表 cards 中找到卡牌信息，卡牌id为 #{@card_id}")

    @name = card.name
    @init_atk = @atk = parseInt(card_config.atk)
    @init_hp = @hp = parseInt(card_config.hp)
    @star = 3
    @skill_id = card_config.skill_id
    @sp_value = [
      {name: 'crit', value: card_config.crit_rate}
      {name: 'dodge', value: card_config.dodge_rate}
    ]

  #loadSkill: ->


module.exports = VirtualHero

