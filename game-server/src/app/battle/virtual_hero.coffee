Hero = require './hero'
Skill = require './skill'
tab = require '../manager/table'

class VirtualHero extends Hero
  init: (data, player) ->
    @cData = data
    @player = player
    @boss = data.boss if data.boss?

    # cardInfo = tab.getTableItem('cards', data.tableId)
    # data.init_hp = data.hp = parseInt(cardInfo.hp)
    # data.init_atk = data.atk = parseInt(cardInfo.atk)

    super(data, player)

  loadCardInfo: ->
    card_config = tab.getTableItem('task_card', @card_id)
    #console.log("card_config = ",card_config)
    #console.log("card_id = ",@card_id)
    card = tab.getTableItem('cards', card_config.card_id)
    if not card
      throw new Error("配置表错误：不能从表 cards 中找到卡牌信息，卡牌id为 #{@card_id}")

    @name = card.name
    @init_atk = @atk = parseInt(card_config.atk)
    @init_hp = @hp = parseInt(card_config.hp)
    
    @atk += parseInt(@atk * (100 + (@cData.atk_inc or 0) *  (@cData.sectionId or 1)) / 100)
    @hp += parseInt(@hp * (100 + (@cData.hp_inc or 0) * (@cData.sectionId or 1)) / 100)

    if @boss?
      @atk += parseInt(@atk * (100 + (@boss.boss_atk_inc or 0)) / 100)
      @hp += parseInt(@hp * (100 + (@boss.boss_hp_inc or 0)) / 100)

    @star = 3
    @skill_id = card_config.skill_id
    @sp_value = [
      {name: 'crit', value: if @cData.boss_crit then @cData.boss_crit else card_config.crit_rate}
      {name: 'dodge', value: if @cData.boss_dodge then @cData.boss_dodge else card_config.dodge_rate}
    ]

  loadSkill: ->
    return if not @boss
    @skill_setting = tab.getTableItem('skills', @skill_id)
    if @skill_setting?
      @skill_setting.star3 = @boss.attr_inc + ',0'
      @skill_setting.rate3 = @boss.skill_trigger_rate
      @skill = new Skill(@, @skill_setting)

module.exports = VirtualHero

