Module = require '../common/module'
Events = require '../common/events'
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

  angry: () ->
    
module.exports = Spiritor