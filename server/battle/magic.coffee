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

class Magic.damage_reduce extends PropertyBase
  enable: (targets, skill) ->
    targets.forEach (tag) =>
      tag.bind 'before_damage', @

  disable: ->
    @targets.forEach (tag) =>
      tag.unbind 'before_damage', @

  execute: (tag)->
    tag.dmg -= @changeValue tag.dmg

    

    
