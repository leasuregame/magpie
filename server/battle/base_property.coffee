Module = require '../common/module'
utility = require '../common/utility'

class PropertyBase extends Module
  _able: false

  enable: ->

  disable: ->

  execute: ->

  check: ->
    if @skill.rate? then utility.hitRate @skill.rate else true

  activate: (targets, skill) ->
    if not @_able
      @targets = targets
      @skill = skill
      @enable targets, skill
      @_able = true

  inactivate: ->
    if @_able
      @disable()
      @_able = false

  changeValue: (raw)->
    [base_val, lv_grow] = utility.parseEffect(@skill['star'+@skill.hero.skill_lv])
    parseInt(raw * ( base_val + lv_grow * (@skill.hero.skill_lv-1) )/100)


module.exports = PropertyBase