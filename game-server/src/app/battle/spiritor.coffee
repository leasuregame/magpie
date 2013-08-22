Module = require '../common/module'
Events = require '../common/events'
table = require '../manager/table'
spiritConfig = require '../../config/data/spirit'
utility = require '../common/utility'

class Spiritor extends Module
  @include Events

  init: (attrs) ->
    @lv = attrs.lv

    spirit = table.getTableItem('spirit', @lv)
    @hp_inc = spirit.hp_inc
    @atk_inc = spirit.atk_inc
    @spirit_atk_inc = spirit.spirit_atk_inc
    @rate = spirit.rate

  trigger: () ->
    utility.hitRate @rate

  angry: (hero, cb) ->
    return cb(hero) if not trigger()
    return cb(hero) if not hero.skill

    console.log '元神攻击', @lv, @spirit_atk_inc
    hero.usingSkill(
      (res) ->
        cb(hero)
      , null
      , @spirit_atk_inc
    )

module.exports = Spiritor