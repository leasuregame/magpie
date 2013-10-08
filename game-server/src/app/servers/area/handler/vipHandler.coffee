dao = require('pomelo').app.get('dao')
playerManager = require '../../../manager/playerManager'
table = require '../../../manager/table'
utility = require '../../../common/utility'
logger = require('pomelo-logger').getLogger(__filename)
async = require 'async'
_ = require 'underscore'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::buyVip = (msg, session, next) ->
  playerId = session.get('playerId')
  id = msg.id

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    data = table.getTableItem('recharge', id)
    player.increase('cash', data.cash)
    player.increase('gold', data.gold)
    player.save()
    next(null, {code: 200, msg: {
      player: {
        vip: player.vip
        dailyGift: player.dailyGift
        spiritPool: player.spiritPool
      }
    }})

Handler::buyVipBox = (msg, session, next) ->
  playerId = session.get('playerId')
  boxId = msg.boxId

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    boxInfo = table.getTableItem('vip_box', boxId)
    if not boxInfo
      return next(null, {code: 501, msg: '找不到礼包信息'})

    if boxInfo.id > player.vip
      return next(null, {code: 501, msg: '你还不是VIP'+boxId+', 不能购买VIP' + boxId + '礼包'})

    if _.contains player.vipBox, boxInfo.id
      return next(null, {code: 501, msg: '不能重复购买'})

    if player.gold < boxInfo.price
      return next(null, {code: 501, msg: '元宝不足'})

    openVipBox(player, boxInfo, next)

Handler::buyExpCard = (msg, session, next) ->
  playerId = session.get('playerId')
  qty = msg.qty

  PRICE = 5000

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    if player.money < qty * PRICE
      return next(null, {code: 501, msg: '铜板不足'})

    addExpCardFor player, qty, (err, cards) ->
      if err
        return next(null, err) 

      player.decrease 'money', qty * PRICE
      next(null, {code: 200, msg: {card: cards[0], cardIds: cards.map (c) -> c.id}})

openVipBox = (player, boxInfo, next) ->
  setIfExist = (attrs) ->
    player.increase att, val for att, val of boxInfo when att in attrs
    return

  setIfExist ['energy', 'money', 'skillPoint', 'elixir', 'fragments']
  player.addPower(boxInfo.power)

  vb = _.clone(player.vipBox)
  vb.push boxInfo.id
  player.vipBox = vb
  player.save()
  
  if _.has boxInfo, 'exp_card'
    addExpCardFor player, boxInfo.exp_card, (err, cards) ->
      return next(null, {code: err.code or 500, msg: err.msg or err}) if err

      next(null, {code: 200, msg: {card: cards[0], cardIds: cards.map (c) -> c.id}})
  else
    next(null, {code: 200, msg: {card: {}, cardIds: []}})

addExpCardFor = (player, qty, cb) ->
  async.times(
    qty
    , (n, callback) ->
      dao.card.createExpCard data: {
        playerId: player.id, 
        lv: 6,
        exp: 29
      }, callback
    , (err, cards) ->
      if err
        logger.error '[fail to create exp card]' + err
        return cb({code: err.code or 500, msg: err.msg or err})

      player.addCards cards
      cb(null, cards.map (c) -> c.toJson())
  )
