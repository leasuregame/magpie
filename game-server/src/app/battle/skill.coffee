Module = require '../common/module'
utility = require '../common/utility'
_ = require 'underscore'
log = require('pomelo-logger').getLogger(__filename)


defautls = 
  id: 0
  name: 'nobody'
  type: 'single_fight'
  scope: 'default'
  random_num: 1
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
      when 'random' then arg = @random_num
      when 'lengthways' then arg = @hero.pos
      else arg = null

    @_player()?.herosToBeAttacked @scope, arg

  getRate: ->
    [base_val, lv_grow] = utility.parseEffect @['rate' + @hero.star]
    base_val + lv_grow * (@lv - 1)

  effectValue: ->
    [base_val, lv_grow] = utility.parseEffect @['star' + @hero.star]
    ( base_val + lv_grow * (@lv - 1) ) / 100

  get_round_num: ->
    @_player()?.round_num

  check: (tags)->
    if @type in ['aoe', 'mult_heal']
      log.warn @type, @scope
      log.warn _.isArray(tags) and tags.length > 1
      log.warn @_satisfy(tags)

    utility.hitRate(@getRate()) and @_satisfy(tags)

  _satisfy: (tags)->
    if @type in ['aoe', 'mult_heal']
      if _.isArray(tags) and tags.length > 1
        return true
      else
        return false
    true

  _player: ->
    return @hero.player if @type in ['single_heal', 'mult_heal']
    return @hero.player.enemy if @type in ['single_fight', 'aoe']
    throw new Error("Skill: can't get target with type: '#{@type}' ")

exports = module.exports = Skill