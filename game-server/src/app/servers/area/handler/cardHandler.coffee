_ = require 'underscore'
job = require '../../../dao/job'
async = require 'async'
table = require '../../../manager/table'
utility = require '../../../common/utility'

GOLDCARDMAP = 
  'week': 'com.leasuregame.magpie.week.card'
  'month': 'com.leasuregame.magpie.month.card'

GOLDCARDMAP_REVERT = 
  'com.leasuregame.magpie.week.card': 'week'
  'com.leasuregame.magpie.month.card': 'month'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::checkBuyPermission = (msg, session, next) ->
  playerId = session.get('playerId')
  type = msg.type
  product_id = GOLDCARDMAP[type]

  async.waterfall [
    (cb) =>
       @app.get('playerManager').getPlayerInfo pid: playerId, cb

    (player, cb) =>
      if _.has(player.goldCards, type) and player.goldCards[type].daysRemaining() > 0
        return cb({code: 501, msg: '不能同时购买两个以上'})
      cb()
    
    (cb) =>
      @app.get('dao').goldCard.getByType playerId, type, cb

    (cards, cb) =>
      if cards.length > 0
        return cb({code: 501, msg: '不能同时购买两个以上'})
      cb()
  ], (err, res) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200})

Handler::buyGoldCard = (msg, session, next) ->
  playerId = session.get('playerId')
  orderNo = msg.orderNo
  productId = msg.productId

  if not orderNo or not productId
    return next(null, {code: 501, msg: '参数不正确'})

  dao = @app.get('dao')
  async.waterfall [
    (cb) =>
      dao.order.fetchOne where: tradeNo: orderNo, (err, order) =>
        if err and err.code is 404
          dao.order.create data: {
            tradeNo: orderNo
            playerId: playerId
            status: 1000
            created: utility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
          }, cb
        
        else
          cb(null, order)      

    (order, cb) =>
      dao.goldCard.fetchOne where: playerId: playerId, orderNo: orderNo, (err, gc) ->
        if err and err.code is 404
          product = table.getTableItem('recharge', productId)

          if not product
            return cb({code: 501, msg: '找不到月卡或周卡的配置信息'})

          today = new Date()
          vd = new Date()
          vd.setDate(vd.getDate()+product.valid_days-1)
          dao.goldCard.create data: {
            orderNo: orderNo,
            playerId: playerId,
            type: GOLDCARDMAP_REVERT[product.product_id],
            created: utility.dateFormat(today, "yyyy-MM-dd"),
            validDate: utility.dateFormat(vd, "yyyy-MM-dd")
          }, cb
        else
          cb(null, gc)
  ], (err, goldcard) ->
    if err
      return next(null, {code: err.code or 501, msg: err.msg or ''})

    next(null, {code: 200})

Handler::getReward = (msg, session, next) ->
  playerId = session.get('playerId')
  type = msg.type
  product_id = GOLDCARDMAP[msg.type]

  @app.get('playerManager').getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    if not _.has(player.goldCards, type)
      return next(null, {code: 501, msg: '没有购买，不能领取'})

    gc = player.goldCards[type]
    if gc.status is 0
      return next(null, {code: 501, msg: '不能领取'})

    if gc.daysRemaining() <= 0
      return next(null, {code: 501, msg: '已过期，不能领取'})

    if gc.hasFlag()
      return next(null, {code: 501, msg: '不能重复领取'})

    products = table.getTable('recharge').filter (id, item) -> item.product_id is product_id
    if products and products.length > 0
      product = products[0]
    else
      return next(null, {code: 501, msg: '找不到月卡或周卡的配置信息'})

    player.increase('gold', product.daily_gold or 0)
    gc.setFlag()
    updateInfo player, gc, (err, res) ->
      if err
        return next(null, {code: err.code or 500, msg: err.msg or err})
      
      next(null, {code: 200, msg: {
        gold: player.gold,
        goldCards: player.getGoldCard()
      }})

updateInfo = (player, gc, cb) ->
  _jobs = []

  playerData = player.getSaveData()
  _jobs.push {
    type: 'update'
    options: 
      table: 'player'
      where: id: player.id
      data: playerData
  } if not _.isEmpty(playerData)

  gcData = gc.getSaveData()
  _jobs.push {
    type: 'update'
    options: 
      table: 'goldCard'
      where: id: gc.id
      data: gcData
  } if not _.isEmpty(gcData)

  job.multJobs _jobs, cb
