Module = require '../common/module'
utility = require '../common/utility'
_ = require 'underscore'
log = require('pomelo-logger').getLogger(__filename)


defautls = 
  id: 0
  name: 'nobody'
  type: 'single_fight'
  scope: 'default'
  target_num: 1
  star3: ''
  rate3: ''
  star4: ''
  rate4: ''
  star5: ''
  rate5: ''

class Skill extends Module
  init: (hero, attrs)->
    @hero = hero
    @lv = hero.skill_lv
    @_attrs = attrs or defautls
    for key, value of @_attrs
      @[key] = value

  getTargets: ->
    switch @scope
      when 'default' then arg = @hero.pos
      when 'random' 
        arg = @target_num
        filterFunc = (h) -> h? and not h.death?()
      when 'lengthways' then arg = @hero.pos
      else arg = null

    @_player()?.herosToBeAttacked @scope, arg, filterFunc

  getRate: ->
    parseInt(@['rate' + @hero.star])

  effectValue: ->
    [base_val, lv_grow] = [@hero.skill_inc, @['star' + @hero.star + '_grow']]
    ( base_val + lv_grow * (@lv-1) ) / 100

  get_round_num: ->
    @_player()?.round_num

  check: ()->
    utility.hitRate(@getRate()) and @_satisfy()

  _satisfy: ()->
    if @type in ['aoe', 'mult_heal']
      tags = @getTargets()
      if _.isArray(tags) and tags.length > 0
        return true
      else
        return false
    true

  _player: ->
    return @hero.player if @type in ['single_heal', 'mult_heal']
    return @hero.player.enemy if @type in ['single_fight', 'aoe']
    throw new Error("Skill: can't get target with type: '#{@type}' ")

exports = module.exports = Skill