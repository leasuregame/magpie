fs = require('fs')
_ = require 'underscore'

Utility = 
  hitRate: (rate) ->
    rate = parseInt(rate)
    rate = rate * 100    
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
        _rates.push _r += parseFloat r

      rd = _.random(1, maxVal * 100)
      for r, i in _rates
        if rd <= r * 100
          return values[i]
    else if values.length > 0
      return values[_.random(0, (values.length - 1))]
    else # default
      return

  ###
  随机返回数组中指定数量的元素
  ###
  randArrayItems: (arr, num=1) ->
    newArr = []
    newArr.push i for i in arr
    
    results = []
    for n in [0...num]
      if newArr.length > 0
        idx = Math.floor(Math.random() * newArr.length)
        results.push newArr[idx]
        newArr.splice(idx, 1)
      else
        break

    results

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
    if _.isArray(obj) 
      throw new Error('invalid paramenter type: obj can not be Array')

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

  shortDateString: ->
    now = new Date()
    return "#{now.getFullYear()}-#{now.getMonth() + 1}-#{now.getDate()}"

  dateFormat: (date, format)-> 
    o = 
      "M+" : date.getMonth()+1, #month
      "d+" : date.getDate(),    #day
      "h+" : date.getHours(),   #hour
      "m+" : date.getMinutes(), #minute
      "s+" : date.getSeconds(), #second
      "q+" : Math.floor((date.getMonth()+3)/3),  #quarter
      "S" : date.getMilliseconds() #millisecond
    if /(y+)/.test(format)
      format = format.replace(RegExp.$1, (date.getFullYear()+'').substr(4 - RegExp.$1.length))

    for key, val of o
      if new RegExp("(#{key})").test(format)
        format = format.replace(RegExp.$1, if RegExp.$1.length is 1 then o[key] else ('00' + o[key]).substr(o[key].toString().length))
    return format

  thisWeek: ->
    now = new Date()
    onejan = new Date(now.getFullYear(), 0, 1)
    weekNumber = Math.ceil((((now-onejan)/86400000)+onejan.getDate()+1)/7)
    ''+now.getFullYear()+(if weekNumber<10 then '0'+weekNumber else weekNumber)

  lastWeek: ->
    now = new Date()
    onejan = new Date(now.getFullYear(), 0, 1)
    weekNumber = Math.ceil((((now-onejan)/86400000)+onejan.getDate()+1)/7)-1

    if weekNumber is 0
      lastYear = now.getFullYear()-1
      start = new Date(lastYear, 0, 1)
      end = new Date(lastYear, 12, 0)
      lastWeekNumber = Math.ceil((((end-start)/86400000)+start.getDate()+1)/7)
      ''+lastYear+lastWeekNumber
    else
      ''+now.getFullYear()+(if weekNumber<10 then '0'+weekNumber else weekNumber)

module.exports = Utility
