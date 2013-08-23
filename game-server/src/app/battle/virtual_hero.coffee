Hero = require './hero'
tab = require '../manager/table'

class VirtualHero extends Hero
  init: (data, player) ->
    @cData = data
    @player = player
    @boos = data.boss if data.boss?

    # cardInfo = tab.getTableItem('cards', data.tableId)
    # data.init_hp = data.hp = parseInt(cardInfo.hp)
    # data.init_atk = data.atk = parseInt(cardInfo.atk)

    super(data, player)

  loadCardInfo: ->
    card_config = tab.getTableItem('task_card', @card_id)

    card = tab.getTableItem('cards', card_config.card_id)
    if not card
      throw new Error("配置表错误：不能从表 cards 中找到卡牌信息，卡牌id为 #{@card_id}")

    @name = card.name
    @init_atk = @atk = parseInt(card_config.atk)
    @init_hp = @hp = parseInt(card_config.hp)
    
    if @boos?
      @atk = parseInt(@atk * @boos.point_atk_inc * cData.sectionId / 100)
      @hp = parseInt(@hp * @boos.point_hp_inc * cData.sectionId / 100)

    @star = 3
    @skill_id = card_config.skill_id
    @sp_value = [
      {name: 'crit', value: card_config.crit_rate}
      {name: 'dodge', value: card_config.dodge_rate}
    ]

  loadSkill: ->
    return if @star < 3 or not @boos
    @skill_setting = tab.getTableItem('skills', @skill_id)
    if @skill_setting?
      @skill_setting.star3 = @boos.attr_inc + ',0'
      @skill_setting.rate3 = @boos.skill_trigger_rate
      @skill = new Skill(@, @skill_setting)

module.exports = VirtualHero

