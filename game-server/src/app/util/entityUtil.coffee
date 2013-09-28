dao = require('pomelo').app.get('dao')
table = require('../manager/table')
cardConfig = require '../../config/data/card'
async = require 'async'
_ = require 'underscore'

module.exports = 
  createCard: (data, done) ->
    if data.star is null
      data.star = data.tableId%5 or 5

    ps = []
    if data.star >= 3
      ps = initPassiveSkill(data.star)
      genSkillInc(data)
    
    async.waterfall [
      (cb) ->
        dao.card.create data: data, cb

      (card, cb) ->
        if ps.length is 0
          return cb(null, card)

        async.each ps, (p, callback) ->
          p.cardId = card.id
          dao.passiveSkill.create data: p, (err, res) ->
            return callback(err) if err
            card.addPassiveSkill(res)
            callback()
        , (err) ->
          return cb(err) if err
          cb(null, card)
    ], (err, card) ->
      if err
        return done(err)
      console.log 'create card: ', card
      done(null, card)

  resetSkillIncForCard: (card) ->
    genSkillInc(card) if card.star >= 3

genSkillInc = (card) ->
  cdata = table.getTableItem('cards', card.tableId)
  skill = cdata.skill_id_linktarget
  if skill?
    min = skill["star#{card.star}_inc_min"] * 10
    max = skill["star#{card.star}_inc_max"] * 10
    card.skillInc = _.random(min, max) / 10
  else
    throw new Error('can not file skill info of card: ' + card.tableId)

initPassiveSkill = (star) ->
  count = star - 2
  results = []
  while count-- > 0
    index = _.random(cardConfig.PASSIVESKILL.TYPE.length-1)
    [start, end] = cardConfig.PASSIVESKILL.VALUE_SCOPE.split('-')
    results.push(
      name: cardConfig.PASSIVESKILL.TYPE[index],
      value: parseFloat(_.random(parseInt(start) * 10, parseInt(end) * 10) / 10).toFixed(1)
    )
  results