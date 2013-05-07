Module = require '../common/module'
DB = require 'db'

class Base extends Module
  init: (attributes) ->
    for key, value in attributes
      @[key] = value

  create: ->

  find: (id)->

  