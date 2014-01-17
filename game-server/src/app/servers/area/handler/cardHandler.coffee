_ = require 'underscore'
job = require '../../../dao/job'
async = require 'async'
table = require '../../../manager/table'

GOLDCARDMAP = 
  'week': 'com.leasuregame.magpie.week.card.pay6'
  'month': 'com.leasuregame.magpie.month.card.pay30'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::checkBuyPermission = (msg, session, next) ->
  playerId = session.get('playerId')
  product_id = GOLDCARDMAP[msg.type]

  async.waterfall [
    (cb) =>
       @app.get('playerManager').getPlayerInfo pid: playerId, cb

    (player, cb) =>
      if _.has(player.goldCards, product_id) and player.goldCards[product_id].daysRemaining() > 0
        return cb({code: 501, msg: '不能同时购买两个以上'})
      cb()
    
    (cb) =>
      @app.get('dao').goldCard.getByType playerId, product_id, cb

    (cards, cb) =>
      if cards.length > 0
        return cb({code: 501, msg: '不能同时购买两个以上'})
      cb()
  ], (err, res) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200})

Handler::getReward = (msg, session, next) ->
  playerId = session.get('playerId')
  product_id = GOLDCARDMAP[msg.type]

  @app.get('playerManager').getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    if not _.has(player.goldCards, product_id)
      return next(null, {code: 501, msg: '没有购买，不能领取'})

    gc = player.goldCards[product_id]
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
        goldCards: gc.toJson()
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
