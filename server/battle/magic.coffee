PropertyBase = require './base_property'
utility = require '../common/utility'

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
    [base_val, lv_grow] = parse.effect(value['star'+target.star])
    target.atk += parseInt(target.atk * ( base_val + lv_grow * (target.skill_lv-1) )/100)

  disable: ->
   [base_val, lv_grow] = parse.effect(value['star'+target.star])
   @target.atk += parseInt(@target.atk * ( base_val + lv_grow * (target.skill_lv-1) )/100)

class Magic.atk_reduce extends PropertyBase
  enable: (target, value, args) ->
    [base_val, lv_grow] = parse.effect(value['star'+target.star])
    target.atk -= parseInt(target.atk * ( base_val + lv_grow * (target.skill_lv-1) )/100)

  disable: ->
    @target.atk += parseInt(@target.atk * ( base_val + lv_grow * (target.skill_lv-1) )/100)

class Magic.damage_reduce extends PropertyBase
  enable: (target, skill_info, args) ->
    _str = if skill_info.target is 1 then 'player' else 'enemy' 
    player = target[obj_str]
    objs = player.scope( skill_info.scope )
    round_num = player.round_num
    round_num += 1 if skill_info.when == 3
    @event = skill_info.trigger_condition

    target.bind @event, [@, objs, round_num]

  disable: ->
    @trigger.unbind @event

  execute: ->
    

    
