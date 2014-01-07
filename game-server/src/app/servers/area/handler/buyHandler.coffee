async = require 'async'
playerManager = require('pomelo').app.get('playerManager')
playerConfig = require '../../../../config/data/player'
table = require '../../../manager/table'
RESOURE_LIMIT = table.getTableItem('resource_limit', 1)

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->


Handler::buyProduct = (msg, session, next)->
  playerId = session.get('playerId')
  productId = msg.id
  times = if msg.times? then msg.times else 1

  product = table.getTableItem('product',productId)
  if(products[product.method])
    products[product.method](playerId,product,times,next)
  else
    next null, {
      code: 501,
      msg: '购买的商品不存在'
    }


products =

  money: (playerId, product, times, next) ->


      player = null
      money = times * product.obtain
      gold = times * product.consume

      async.waterfall [
         (cb) ->
           playerManager.getPlayerInfo {pid:playerId}, cb
         (res, cb) ->

           player = res
           if player.gold < gold
             cb {code: 501, msg: "魔石不足"}

           else if Math.ceil((RESOURE_LIMIT.money - player.money) * 1.0 / product.obtain) < times
             cb {code: 501, msg: "超过仙币上限"}

           else
             if player.money + money > RESOURE_LIMIT.money
               money = RESOURE_LIMIT.money - player.money
             player.increase 'money', money
             player.decrease 'gold', gold
             cb()

      ],(err) ->
        if err
          return next null, {code: err.code, msg: err.msg}
        player.save()
        next null, {
          code: 200,
          msg: {
            money: money,
            consume: {
              key: "gold",
              value: player.gold
            }
          }
        }

  power: (playerId, product, times, next) ->
    player = null
    powerValue = times * product.obtain

    gold = times * product.consume

    async.waterfall [
      (cb) ->
        playerManager.getPlayerInfo {pid:playerId}, cb
      (res, cb) ->

        player = res

        if player.dailyGift.powerBuyCount <= 0
          cb {code: 501, msg: "体力购买次数已用完，VIP可购买更多"}

        else if player.dailyGift.powerBuyCount < times
          cb {code: 501, msg: "所剩购买次数不足"}

        else if player.gold < gold
          cb {code: 501, msg: "魔石不足"}

        else
          player.updateGift 'powerBuyCount', player.dailyGift.powerBuyCount - times
          player.addPower powerValue
          player.decrease 'gold', gold
          cb()

    ],(err) ->
      if err
        return next null, {code: err.code, msg: err.msg}
      player.save()
      next null, {
        code: 200,
        msg: {
          power: powerValue,
          consume: {
            key: "gold",
            value: player.gold
          }
        }
      }

  challengeCount: (playerId, product, times, next) ->

    player = null

    buyCount = product.obtain * times
    gold = product.consume * times

    async.waterfall [
      (cb) ->
        playerManager.getPlayerInfo {pid:playerId}, cb
      (res, cb) ->

        player = res
        if player.dailyGift.challengeBuyCount <= 0
          cb {code: 501, msg: "购买次数已经用完"}

        else if player.dailyGift.challengeBuyCount < times
          cb {code: 501, msg: "超过购买次数上限"}

        else if player.gold < gold
          cb  {code: 501, msg: "魔石不足"}

        else
          player.updateGift 'challengeBuyCount', player.dailyGift.challengeBuyCount - times
          player.updateGift 'challengeCount' , player.dailyGift.challengeCount + buyCount
          player.decrease 'gold', gold
          cb()

    ],(err) ->
      if err
        return next null, {code: err.code, msg: err.msg}
      player.save()
      next null, {
        code: 200,
        msg: {
          challengeCount: player.dailyGift.challengeCount,
          consume: {
            key: "gold",
            value: player.gold
          }
        }
      }

  expCard: (playerId, product, times, next) ->

    PRICE = product.consume

    playerManager.getPlayerInfo pid: playerId, (err, player) ->
      if err
        return next(null, {code: err.code or 500, msg: err.msg or err})

      if player.dailyGift.expCardCount <= 0
        return next(null, {code: 501, msg: '购买次数已经用完'})

      if _.keys(player.cards).length >= player.cardsCount
        return next(null, {code: 501, msg: '卡牌容量已经达到最大值'})

      if player.money < times * PRICE
        return next(null, {code: 501, msg: '仙币不足'})

      if _.keys(player.cards).length + times > player.cardsCount
        return next(null, {code: 501, msg: '卡牌容量不足'})

      playerManager.addExpCardFor player, times, (err, cards) ->
        if err
          return next(null, err)

        player.decrease 'money', times * PRICE
        player.updateGift 'expCardCount', player.dailyGift.expCardCount - times
        player.save()
        next(null, {code: 200, msg: {
          consume: {
            key: "money",
            value: player.money
          },
          card: cards[0],
          cardIds: cards.map (c) -> c.id
        }})

  cardCount: (playerId, product, times, next) ->
    consume = product.consume*times
    obtain = product.obtain*times

    playerManager.getPlayerInfo pid: playerId, (err, player) ->
      if err
        return next(null, {code: err.code or 500, msg: err.msg or err})

      if player.cardsCount >= RESOURE_LIMIT.card_count_limit or player.cardsCount + times > RESOURE_LIMIT.card_count_limit
        return next(null, {code: 501, msg: "卡牌容量已经达到最大值"})

      if player.gold < product.consume*times
        return next(null, {code: 501, msg: "魔石不足"})

      player.decrease(product.consume_type, consume)
      player.increase('cardsCount', obtain)
      player.save()

      next(null, {
        code: 200, 
        msg: 
          consume: key: product.consume_type, value: player.gold
          cardsCount: player.cardsCount
      })

