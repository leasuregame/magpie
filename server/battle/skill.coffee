Module = require '../common/module'
Magic = require './magic'
utility = require '../common/utility'


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
    @lv = hero.lv
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
    base_val + lv_grow * (@lv -1)

  effectValue: ->
    [base_val, lv_grow] = utility.parseEffect @['star' + @lv]
    base_val + lv_grow * (@lv - 1)

  get_round_num: ->
    @_player()?.round_num

  check: ->
    utility.hitRate(@getRate()) and satisfy()

  _satisfy: ->
    if @type in ['aoe', 'mult_heal']
      tag = @getTargets()
      if _.isArray(tag) and tag.length > 1
        return true
      else
        return false
    true

  _player: ->
    return @hero.player if @type is 'heal'
    return @hero.player.enemy if @type is 'fight'
    throw new Error("Skill: can't get target with '#{@target}' ")

exports = module.exports = Skill