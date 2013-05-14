PropertyBase = require './base_property'

Magic = exports = module.exports

parse = 
  effect: (value) ->
    pattern = /^\d+,\d+$/
    if not pattern.exec(value)
      throw new Error("effect value #{value} is invalid")

    [base_val, lv_grow] = value.split(',')
    [parseInt(base_val), parseInt(lv_grow)]

class Magic.atk_improve extends PropertyBase
  enable: (target, value, args) ->
    # target is a hero
    # value is skill info
    [base_val, lv_grow] = parse.effect(value)
    target.atk += target.atk * ( base_val + lv_grow * target.skill_lv )

  disable: ->
   [base_val, lv_grow] = parse.effect(value)
   @target.atk += @target.atk * ( base_val + lv_grow * @target.skill_lv )

class Magic.atk_reduce extends PropertyBase
  enable: (target, value, args) ->
    [base_val, lv_grow] = parse.effect(value)
    target.atk -= target.atk * ( base_val + lv_grow * target.skill_lv )

  disable: ->
    @target.atk += @target.atk * ( base_val + lv_grow * @target.skill_lv )