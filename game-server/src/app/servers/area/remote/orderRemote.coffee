table = require('../../../manager/table')
async = require('async')
utility = require('../../../common/utility')

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
      @app.get('dao').order.create data: {
        playerId: playerId
        tradeNo: tradeNo
        partner: partner
        amount: amount
        paydes: paydes
        created: utility.dateFormat(new Date(), "yyyy-MM-dd")
      }, cb
  ], (err, order) =>
    if err
      return callback({code: 500, msg: err})

    times = 1
    if player.cash is 0
      ### 首冲获得三倍魔石 ###
      times = 3

    product = table.getTableItem('recharge', productId)
    player.increase('cash', product.cash)
    player.increase('gold', (product.cash * 10 + product.gold) * times)
    player.save()

    successMsg(@app, player)
    callback(null, {ok: true})
  
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