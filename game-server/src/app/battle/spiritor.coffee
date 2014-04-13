Module = require '../common/module'
Events = require '../common/events'
table = require '../manager/table'
utility = require '../common/utility'

class Spiritor extends Module
  @include Events

  init: (attrs) ->
    @lv = attrs.lv
    
    spirit = table.getTableItem('spirit', @lv)
    @hp_inc = spirit.hp_inc
    @atk_inc = spirit.atk_inc
    @spirit_atk_pct = spirit.spirit_atk_pct
    @rate = spirit.rate

  trigger: () ->
    res = utility.hitRate @rate
    res

  angry: (heros, cb) ->
    for hero in heros
      continue if not hero.skill or not hero.death()

      if @trigger()
        hero.usingSkill(
          (res) -> 
            cb(hero)
          , null
          , @spirit_atk_pct
          , true
        )
        break
        
    cb(heros)

module.exports = Spiritor