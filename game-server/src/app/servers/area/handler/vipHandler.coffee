dao = require('pomelo').app.get('dao')
playerManager = require '../../../manager/playerManager'
table = require '../../../manager/table'
expCardConfig = require '../../../../config/data/expCard'
utility = require '../../../common/utility'
logger = require('pomelo-logger').getLogger(__filename)
async = require 'async'
_ = require 'underscore'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::buyVip = (msg, session, next) ->
  playerId = session.get('playerId')
  cash = msg.cash

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    player.increase('cash', cash)
    player.save()
    next(null, {code: 200})

Handler::buyVipBox = (msg, session, next) ->
  playerId = session.get('playerId')
  boxId = msg.boxId

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    boxInfo = table.getTableItem('vip_box', boxId)
    if not boxInfo
      return next(null, {code: 501, msg: 'can not find vip box info'})

    if boxInfo.id > player.vip
      return next(null, {code: 501, msg: 'you can not buy vip' + boxId})

    if player.gold < boxInfo.price
      return next(null, {code: 501, msg: 'gold is not enought'})

    openVipBox(player, boxInfo, next)

Handler::buyExpCard = (msg, session, next) ->
  playerId = session.get('playerId')
  qty = msg.qty

  PRICE = 10000

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    if player.money < qty * PRICE
      return next(null, {code: 501, msg: 'money is not enought'})

    addExpCardFor player, qty, (err, cards) ->
      if err
        return next(null, err) 

      player.decrease 'money', qty * PRICE
      next(null, {code: 200, msg: {cards: cards}})

openVipBox = (player, boxInfo, next) ->
  setIfExist = (attrs) ->
    player.increase att, val for att, val of boxInfo when att in attrs

  setIfExist ['power', 'energy', 'money', 'skillPoint', 'elixir', 'fragments']
  player.save()
  
  if _.has boxInfo, 'exp_card'
    addExpCardFor player, boxInfo.exp_card, (err, cards) ->
      return next(null, {code: err.code or 500, msg: err.msg or err}) if err

      next(null, {code: 200, msg: {boxInfo: boxInfo, cards: cards}})
  else
    next(null, {code: 200, msg: {boxInfo: boxInfo, cards: []}})

addExpCardFor = (player, qty, cb) ->
  async.times(
    qty
    , (n, callback) ->
      dao.card.create data: _.extend({playerId: player.id}, expCardConfig), callback
    , (err, cards) ->
      if err
        logger.error '[fail to create exp card]' + err
        return cb({code: err.code or 500, msg: err.msg or err})

      player.addCards cards
      cb(null, cards)
  )
