Module = require '../common/module'

class PropertyBase extends Module
  _able: false

  enable: ->

  disable: ->

  execute: ->

  check: ->
    return -1

  activate: (target, value, args) ->
    if not _able
      @target = target
      @value = value
      @args = args
      @enable target, value, args
      @_able = true

  inactivate: ->
    if _able
      @disable()
      @_able = false

modeule.exports = PropertyBase