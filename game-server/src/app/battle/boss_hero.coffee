Hero = require './hero'
Skill = require './skill'
tab = require '../manager/table'

class BossHero extends Hero
  init: (data, player) ->
    @hpInfo = data.hpInfo
    @player = player

    super data, player

  loadCardInfo: ->
    boss_config = tab.getTableItem('boss_card', @card_id)
    if not boss_config
      throw new Error('配置表错误，找不到怪物卡牌配置信息' + @card_id)

    @init_atk = @atk = boss_config.atk    
    @total_hp = @init_hp = @hp = boss_config.hp

    @star = 3
    @skill_id = boss_config.card_id_linktarget?.skill_id
    @sp_value = [
      active: true
      items: [
        {name: 'crit', value: boss_config.crit_rate},
        {name: 'dodge', value: boss_config.dodge_rate},
        {name: 'hit', value: boss_config.hit_rate}
      ]
    ]

  loadSkill: ->
    return if not @skill_id

    @skill_setting = tab.getTableItem('skills', @skill_id)
    if @skill_setting
      @skill_inc = @skill_setting.star3_inc_min
      @skill = new Skill(@, @skill_setting)

  setPos: (pos) ->
    super pos
    ### 更新boss卡牌的剩余血量 ###
    @init_hp = @hp = @hpInfo[@idx+1]?.hp or @init_hp

module.exports = BossHero