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
    card = tab.getTableItem('cards', card_config.card_id)
    if not card
      throw new Error("配置表错误：不能从表 cards 中找到卡牌信息，卡牌id为 #{@card_id}")

    @name = card.name
    @init_atk = @atk = parseInt(card_config.atk)
    @init_hp = @hp = parseInt(card_config.hp)

    if @boss?
      #bf = if @cData.sectionId then (@cData.sectionId - 1) else 1
      #atk_inc = if @boss.boss_atk_inc then (@boss.boss_atk_inc * bf) else 0
      atk_inc = if @boss.atk_inc then (@boss.atk_inc) else 0
      #hp_inc = if @boss.boss_hp_inc then (@boss.boss_hp_inc * bf) else 0
      hp_inc = if @boss.hp_inc then (@boss.hp_inc) else 0
      @init_atk = @atk += parseInt(@atk * atk_inc / 100)
      @init_hp = @hp += parseInt(@hp * hp_inc / 100)

    @star = 3
    @skill_id = card.skill_id
    @sp_value = [
      active: true
      items: [
        {name: 'crit', value: if @boss?.boss_crit then @boss.boss_crit else card_config.crit_rate}
        {name: 'dodge', value: if @boss?.boss_dodge then @boss.boss_dodge else card_config.dodge_rate}
      ]
    ]

  loadSkill: ->
    return if not @boss
    @skill_setting = tab.getTableItem('skills', @skill_id)
    if @skill_setting?
      @skill_setting.rate3 = @boss.skill_trigger_rate
      @skill_inc = @skill_setting.star3_inc_min
      @skill = new Skill(@, @skill_setting)

module.exports = VirtualHero

