playerManager = require('pomelo').app.get('playerManager')
table = require '../../../manager/table'
utility = require '../../../common/utility'
_ = require 'underscore'
uuid = require 'node-uuid'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::order = (msg, session, next) ->
  playerId = session.get('playerId')
  areaId = session.get('areaId')
  productId = msg.productId

  @app.get('dao').tborder.create data: {
    playerId: playerId
    tradNo: uuid.v1() + '_' + new Date().getTime()
    partner: 'PP'
    paydes: "#{playerId}:#{areaId}:#{productId}"
    status: 1000 # init status
    created: utility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
  }, (err, order) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200, msg: billno: order.tradeNo})
