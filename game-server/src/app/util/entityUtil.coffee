dao = require('pomelo').app.get('dao')
table = require('../manager/table')
cardConfig = require '../../config/data/card'
async = require 'async'
_ = require 'underscore'

module.exports = 
  createCard: (data, done) ->
    if data.star is null
      data.star = data.tableId%5 or 5

    if data.star >= 3
      ps = initPassiveSkill(data.star)
      cdata = table.getTableItem('card', data.tableId)
      skill = cdata.skill_id_linktarget
      if skill?
        min = skill["star#{data.star}_inc_min"] * 10
        max = skill["star#{data.star}_inc_max"] * 10
        data.skillInc = _.random(min, max) / 10
      else 
        throw new Error('can not file skill info of card: ' + data.tableId)
    
    async.waterfall [
      (cb) ->
        dao.card.create data: data, cb

      (card, cb) ->
        if ps.length is 0
          return cb(null)

        async.each ps, (p, callback) ->
          dao.passiveSkill.create data: ps, (err, res) ->
            return callback(err) if err
            card.addPassiveSkill(res)
            callback()
        , (err) ->
          return cb(err) if err
          cb(null, card)
    ], (err, card) ->
      if err
        return done(err)

      done(null, card)

initPassiveSkill = (star) ->
  count = star - 2
  
  results = []
  while count-- > 0
    index = _.random(cardConfig.PASSIVESKILL.TYPE.length-1)
    [start, end] = cardConfig.PASSIVESKILL.VALUE_SCOPE.split('-')
    results.push(
      name: cardConfig.PASSIVESKILL.TYPE[index],
      value: _.random(start, end)
    )
  results