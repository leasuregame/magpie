_ = require 'underscore'

exports = module.exports = 

  hitRate: (rate) ->
    rate = parseInt(rate)
    if isNaN(rate) or rate < 0 and rate > 100
      throw new Error("Invilid argument: can't pass #{rate} to int")

    rd = _.random(0, 100)
    if rd <= rate then true else false

  parseEffect: (value) ->
    pattern = /^\d+,\d+$/
    if not pattern.exec(value)
      throw new Error("effect value #{value} is invalid")

    [base_val, lv_grow] = value.split(',')
    [parseInt(base_val), parseInt(lv_grow)]