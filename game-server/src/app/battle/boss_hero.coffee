Hero = require './hero'
Skill = require './skill'
tab = require '../manager/table'

class BossHero extends Hero
  init: (data, player) ->
    @hpInfo = data.hpInfo
    @player = player

    super data, player

  loadCardInfo: ->
    card_config = tab.getTableItem('boss_card', @card_id)
    if not card_config
      throw new Error('配置表错误，找不到怪物卡牌配置信息' + @card_id)

    @init_atk = @atk = card_config.atk    
    @total_hp = @init_hp = @hp = card_config.hp

    @star = 3
    @skill_id = card_config.skill_id
    @sp_value = [
      {name: 'crit', value: card_config.crit_rate},
      {name: 'dodge', value: card_config.dodge_rate}
    ]

  loadSkill: ->
    return if not @skill_id

    @skill_setting = tab.getTableItem('skills', @skill_id)
    if @skill_setting
      @skill_inc = @skill_setting.star3_inc_min
      @skill = new Skill(@, @skill_setting)

module.exports = BossHero