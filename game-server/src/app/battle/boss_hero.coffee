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
    @init_hp = @hp = card_config.hp

    @star = 3
    @skill_id = card_config.skill_id
    @sp_value = [
      {name: 'crit', value: card_config.crit_rate},
      {name: 'dodge', value: card_config.dodge_rate}
    ]

  getCards: ->
    cobj = {}
    for c in @heros
      cobj[c.idx] = 
        tableId: c.card_id
        hp: c.init_hp
        atk: c.init_atk
    cobj

module.exports = BossHero