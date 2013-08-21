Module = require '../common/module'
Events = require '../common/events'

class Spiritor extends Module
  @include Events

  init: (attrs) ->
  	this.lv = attrs.lv


  angry: () ->
  	