fs = require('fs')
_ = require 'underscore'

Utility = 
  hitRate: (rate) ->
    rate = rate * 100
    rate = parseInt(rate)
    if isNaN(rate) or rate < 1 and rate > 10000
      throw new Error("Invilid argument: can't pass #{rate} to int")

    rd = _.random(1, 10000)

    if rd <= rate then true else false

  ###
  get random value from the given values
  @param {array} values, the given values for get the random one from them
  @param {array} rates, the option parameter, if given, will return the value for the rates
  ###
  randomValue: (values, rates, maxVal=100) ->
    if values.length isnt rates.length
      throw new Error("Invalid arguments: values and rates are not have same elements")

    if rates?
      _rates = []
      _r = 0
      for r in rates
        _rates.push _r += r

      rd = _.random(1, maxVal * 100)

      for r, i in _rates
        if rd <= r * 100
          return values[i]
    else if values.length > 0
      return values[_.random(0, (values.length - 1))]
    else # default
      return

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

  hasMark: (val, bit) ->
    return val >> (bit-1) & 1

  mark: (val, bit) ->
    val = val | (1 << (bit-1))

  walk: (dir, done) ->
    results = []
    fs.readdir dir, (err, list) ->
      return done(err) if err
      pending = list.length
      return done(null, results) if not pending

      list.forEach (file) ->
        file = dir + '/' + file
        fs.stat file, (err, stat) ->
          if stat and stat.isDirectory()
            Utility.walk file, (err, res) ->
              results = results.concat res
              done(null, results) if not --pending
          else
            results.push file
            done(null, results) if not --pending

  walkSync: (dir) ->
    results = []
    list = fs.readdirSync(dir)
    for item in list
      file = "#{dir}/#{item}"
      stat = fs.statSync(file)
      if stat and stat.isDirectory()
        res = Utility.walkSync file
        results = results.concat res
      else
        results.push file
    results

module.exports = Utility
