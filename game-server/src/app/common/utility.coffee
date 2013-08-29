_ = require 'underscore'

Utility = 
  hitRate: (rate) ->
    rate = parseInt(rate)
    if isNaN(rate) or rate < 0 and rate > 100
      throw new Error("Invilid argument: can't pass #{rate} to int")

    rd = _.random(0, 100)
    if rd <= rate then true else false

  ###
  get random value from the given values
  @param {array} values, the given values for get the random one from them
  @param {array} rates, the option parameter, if given, will return the value for the rates
  ###
  randomValue: (values, rates, maxVal=100) ->
    if rates?
      _rates = []
      _r = 0
      for r in rates
        _rates.push _r += r

      rd = _.random(0, maxVal)
      for r, i in _rates
        if rd <= r
          return values[i]
    else if values.length > 0
      return values[_.random(0, (values.length - 1))]
    else # default
      values[0]

  parseEffect: (value) ->
    pattern = /^\d+,\d+$/
    if not pattern.exec(value)
      throw new Error("effect value #{value} is invalid")

    [base_val, lv_grow] = value.split(',')
    [parseInt(base_val), parseInt(lv_grow)]

  extends: (child, parent) ->
    for key of parent
      child[key] = parent[key] if parent.hasOwnProperty(key)

    ctor = ->
      @constructor = child
      return

    ctor:: = parent::
    child:: = new ctor()
    child.__super__ = parent::
    child

  deepCopy: (obj) ->
    newObj = {}
    for key of obj
      if _.isObject(obj[key]) and not _.isArray(obj[key])
        newObj[key] = Utility.deepCopy(obj[key])
      else if _.isArray(obj[key])
        newArr = []
        for item in obj[key]
          if _.isObject(item)
            newArr.push Utility.deepCopy(item)
          else
            newArr.push item

        newObj[key] = newArr
      else
        newObj[key] = obj[key]

    newObj

module.exports = Utility
