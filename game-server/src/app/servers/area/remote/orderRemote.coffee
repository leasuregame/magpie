table = require('../../../manager/table')
async = require('async')
utility = require('../../../common/utility')
logger = require('pomelo-logger').getLogger(__filename)

ORDER_INIT_STATUS = 1000
ORDER_FINISHED_STATUS = 2000
ORDER_ERROR_STATUS_1 = 3000
ORDER_ERROR_STATUS_2 = 3010

module.exports = (app) ->
  new Remote(app)

Remote = (@app) ->

Remote::add = (args, callback) ->
  playerId = args.playerId
  areaId = args.areaId
  tradeNo = args.tradeNo
  partner = args.partner
  amount = args.amount
  paydes = args.paydes
  productId = args.productId

  player = null
  async.waterfall [
    (cb) =>
      @app.get('playerManager').getPlayerInfo pid: playerId, cb

    (_player, cb) =>
      player = _player
      @app.get('dao').order.fetchOne where: tradeNo: tradeNo, (err, o) -> cb(null, o)

    (exist, cb) =>
      if exist
        if exist.status is ORDER_FINISHED_STATUS
          return cb({ok: true, msg: '该订单已处理'})
        else 
          return cb(null, exist)

      @app.get('dao').order.create data: {
        playerId: playerId
        tradeNo: tradeNo
        partner: partner
        amount: amount
        paydes: paydes
        status: ORDER_INIT_STATUS
        created: utility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
      }, cb
  ], (err, order) =>
    if err
      return callback(null, err)

    times = 1
    if player.cash is 0
      ### 首冲获得三倍魔石 ###
      times = 3

    product = table.getTableItem('recharge', productId)
    if not product
      logger.warn('找不到购买的对应产品, 产品id为', productId)
      updateOrderStatus(@app, tradeNo, ORDER_ERROR_STATUS_1)
      return callback(null, {ok: false, msg: '找不到购买的对应产品'})

    # 检查充值的金额是否正确
    if parseInt(amount) != product.cash*100
      logger.warn('充值的金额跟产品金额不匹配,', '订单金额为:', amount+'分,', 
        '产品实际金额为:', product.cash+'元', '产品id为:', productId)
      updateOrderStatus(@app, tradeNo, ORDER_ERROR_STATUS_2)
      return callback(null, {ok: false, msg: '充值的金额跟产品金额不匹配'})
    
    player.increase('cash', product.cash)
    player.increase('gold', (product.cash * 10 + product.gold) * times)
    player.save()

    successMsg(@app, player)
    callback(null, {ok: true})
    updateOrderStatus(@app, tradeNo, ORDER_FINISHED_STATUS)

updateOrderStatus = (app, tradeNo, status) ->
  app.get('dao').order.update {
    data: status: status
    where: tradeNo: tradeNo
  }, (err, res) ->
    if err
      logger.error('faild to udpate order status.', tradeNo, status)
      logger.error(err)

successMsg = (app, player) ->
  app.get('messageService').pushByPid player.id, {
    route: 'onVerifyResult',
    msg: {
      gold: player.gold,
      vip: player.vip,
      cash: player.cash
    }
  }, (err, res) ->
    if err
      logger.error('faild to send message to playerId ', playerId)