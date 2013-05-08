PropertyBase = require './base_property'

Magic = exports = module.exports

class Magic.atk_improve extends PropertyBase
  enable: (target, value, args) ->
    # target is a hero
    # value is a percent
    target.atk += target.atk * value

  disable: ->
    @target.atk -= target.atk * @value

class Magic.atk_reduce extends PropertyBase
  enable: (target, value, args) ->
    target.atk -= target.atk * value

  disable: ->
    @target.atk += @target.atk * @value