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
    #console.log 'atk improve,', value, target.atk
    [base_val, lv_grow] = parse.effect(value['star'+target.star])
    #console.log 'base_val,', base_val, 'lv_grow', lv_grow
    target.atk += parseInt(target.atk * ( base_val + lv_grow * (target.skill_lv-1) )/100)
    #console.log 'after modify,', target.atk

  disable: ->
   [base_val, lv_grow] = parse.effect(value['star'+target.star])
   @target.atk += parseInt(@target.atk * ( base_val + lv_grow * (target.skill_lv-1) )/100)

class Magic.atk_reduce extends PropertyBase
  enable: (target, value, args) ->
    [base_val, lv_grow] = parse.effect(value['star'+target.star])
    target.atk -= parseInt(target.atk * ( base_val + lv_grow * (target.skill_lv-1) )/100)

  disable: ->
    @target.atk += parseInt(@target.atk * ( base_val + lv_grow * (target.skill_lv-1) )/100)