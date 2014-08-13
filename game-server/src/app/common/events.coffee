_ = require 'underscore'

Events =
  bind: (ev, callback) ->
    evs   = ev.split(' ')
    calls = @hasOwnProperty('_callbacks') and @_callbacks or= {}
    objs = @hasOwnProperty('_objects') and @_objects or= {}
    for name in evs
      if _.isFunction callback 
        calls[name] or= []
        calls[name].push(callback)
      if _.isObject callback
        objs[name] or= []
        objs[name].push(callback)
    this

  one: (ev, callback) ->
    @bind ev, handler = ->
      @unbind(ev, handler)
      callback.apply(this, arguments)

  trigger: (args...) ->
    ev = args.shift()
    list = @hasOwnProperty('_callbacks') and @_callbacks?[ev]
    olist = @hasOwnProperty('_objs') and @_objs?[ev]
    return if not list and not olist
    for callback in list
      if callback.apply(this, args) is false
        break

    for obj in olist
      if obj.check()
        obj.execute.apply(obj, args)
        
    true

  listenTo: (obj, ev, callback) ->
    obj.bind(ev, callback)
    @listeningTo or= []
    @listeningTo.push obj
    this

  listenToOnce: (obj, ev, callback) ->
    listeningToOnce = @listeningToOnce or []
    listeningToOnce.push obj
    obj.one ev, ->
      idx = listeningToOnce.indexOf(obj)
      listeningToOnce.splice(idx, 1) unless idx is -1
      callback.apply(this, arguments)
    this

  stopListening: (obj, ev, callback) ->
    if arguments.length is 0
      retain = []
      for listeningTo in [@listeningTo, @listeningToOnce]
        continue unless listeningTo
        for obj in listeningTo when not (obj in retain)
          obj.unbind()
          retain.push(obj)
      @listeningTo = undefined
      @listeningToOnce = undefined

    else if obj
      obj.unbind(ev, callback) if ev
      obj.unbind() unless ev
      for listeningTo in [@listeningTo, @listeningToOnce]
        continue unless listeningTo
        idx = listeningTo.indexOf(obj)
        listeningTo.splice(idx, 1) unless idx is -1

  unbind: (ev, callback) ->
    if arguments.length is 0
      @_callbacks = {}
      return this
    return this unless ev
    evs = ev.split(' ')
    for name in evs
      list = @_callbacks?[name]
      olist = @_objects?[name]
      continue if not list and not olist
      unless callback
        delete @_callbacks[name]
        delete @_objects[name]
        continue
      for cb, i in list when (cb is callback)
        list = list.slice()
        list.splice(i, 1)
        @_callbacks[name] = list
        break

      for obj, i in olist when (cb is callback)
        olist = list.slice()
        olist.splice(i, 1)
        @_objects[name] = olist
        break
    this

Events.on = Events.bind
Events.off = Events.unbind

module.exports = Events