PropertyBase = require './base_property'
utility = require '../common/utility'

Magic = exports = module.exports

class Magic.atk_improve extends PropertyBase
  enable: (targets, skill) ->
    targets.forEach (tag) =>
      tag.bind 'before_attack', @

  disable: ->
   @targets.forEach (tag) =>
      tag.unbind 'before_attack', @

  execute: (tag) ->
    tag.atk += @changeValue tag.atk

class Magic.atk_reduce extends PropertyBase
  enable: (targets, skill) ->
    targets.forEach (tag) =>
      tag.bind 'before_attack', @

  disable: ->
   @targets.forEach (tag) =>
      tag.unbind 'before_attack', @

  execute: (tag) ->
    tag.atk -= @changeValue tag.atk

class Magic.hp_improve extends PropertyBase
  enable: (targets, skill) ->

###
passive skill, not 'enable' and 'disable' function
###
class Magic.dodge_ignore extends PropertyBase
  execute: (tag) ->
    tag.cant_miss = true

# passive skill
class Magic.crit_ignore extends PropertyBase
  execute: (tag) ->
    tag.cant_be_crit = true

class Magic.crit_improve_damage extends PropertyBase
  execute: (tag) ->
    tag.crit_factor += @changeValue tag.crit_factor

class Magic.damage_reduce extends PropertyBase
  enable: (targets, skill) ->
    targets.forEach (tag) =>
      tag.bind 'before_damage', @

  disable: ->
    @targets.forEach (tag) =>
      tag.unbind 'before_damage', @

  execute: (tag) ->
    tag.dmg -= @changeValue tag.dmg

class Magic.hp_reduce extends PropertyBase
  
    
# 概率触发技能的魔法属性
# 实际上是再before attack的时候触发
# 判断是否概率命中，命中就执行，不命中就执行普通攻击
class Magic.atk_lengthways extends PropertyBase
  enable: (targets, skill) ->
    

  execute: (tag) ->
    tag.attack(@targets)


class Magic.atk_crossways_front extends Magic.atk_lengthways

class Magic.atk_crossways_back extends Magic.atk_lengthways

class Magic.atk_hp_max extends PropertyBase
  enable: (targets, skill) ->
    targets.forEach (tag) =>
      tag.bind 'before_damage', @
