dao = require('pomelo').app.get('dao')
messageService = require('pomelo').app.get('messageService')
table = require('../manager/table')
cardConfig = require '../../config/data/card'
utility = require '../common/utility'
async = require 'async'
_ = require 'underscore'

EXP_CARD_ID = require('../../config/data/card').EXP_CARD_ID;

module.exports = 
  createCard: (data, done) ->
    unless data.star
      data.star = data.tableId%5 or 5

    ps = []
    if data.star >= 3
      ps = initPassiveSkill(data.star)
      genSkillInc(data)

    data.passiveSkills = ps

    async.waterfall [
      (cb) ->
        dao.card.create data: data, cb

      (card, cb) ->
        if ps.length is 0
          return cb(null, card)

        async.each ps, (p, callback) ->
         # p.cardId = card.id
         # dao.passiveSkill.create data: p, (err, res) ->
         #   return callback(err) if err
            card.addPassiveSkill(p)
            callback()
        , (err) ->
          return cb(err) if err
          cb(null, card)

    ], (err, card) ->
      if err
        return done(err)
      done(null, card)

  resetSkillIncForCard: (card) ->
    genSkillInc(card) if card.star >= 3

  lightUpACard: (player, tableId) ->
    return if tableId is EXP_CARD_ID

    player.cardBookMark.mark(tableId)
    cardBook = utility.deepCopy(player.cardBook)
    cardBook.mark = player.cardBookMark.value
    player.cardBook = cardBook
    player.save()

    messageService.pushByPid player.id, {
      route: 'onLightUpCard'
      msg: tableId: tableId
    }, () ->

genSkillInc = (card) ->
  cdata = table.getTableItem('cards', card.tableId)
  skill = cdata.skill_id_linktarget
  if skill?
    min = skill["star#{card.star}_inc_min"]
    max = skill["star#{card.star}_inc_max"]
    card.skillInc = _.random(min, max)
  else
    throw new Error('can not file skill info of card: ' + card.tableId)

initPassiveSkill = (star) ->
  count = star - 2
  results = []
  for i in [0...count]
    index = _.random(cardConfig.PASSIVESKILL.TYPE.length-1)
    [start, end] = cardConfig.PASSIVESKILL.VALUE_SCOPE.split('-')
    results.push(
      id:i,
      name: cardConfig.PASSIVESKILL.TYPE[index],
      value: parseFloat(parseFloat(_.random(parseInt(start) * 10, parseInt(end) * 10) / 10).toFixed(1))
    )
  results