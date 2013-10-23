async = require 'async'
playerManager = require '../../../manager/playerManager'
playerConfig = require '../../../../config/data/player'
table = require '../../../manager/table'
MAX_CARD_COUNT = table.getTableItem('resource_limit', 1).card_count_limit
MAX_POWER_VALUE = table.getTableItem('resource_limit', 1).power_value

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::buyMoney = (msg, session, next) ->

    playerId = session.get('playerId')
    player = null
    type = msg.type
    #buy_money = playerConfig.BUY_MONEY[type]
    buy_money = table.getTableItem('product',type + 1)
    if buy_money.name isnt '铜板'
      return next null, {code: 500, msg: "购买类型错误"}

    async.waterfall [
       (cb) ->
         playerManager.getPlayerInfo {pid:playerId}, cb
       (res, cb) ->

         player = res
         if player.gold < buy_money.consume
           cb {code: 501, msg: "元宝不足"}

         else
           player.increase 'money', buy_money.obtain
           player.decrease 'gold', buy_money.consume
           cb()

    ],(err) ->
      if err
        return next null, {code: err.code, msg: err.msg}
      player.save()
      next null, {
        code: 200,
        msg: {
          money: player.money
        }
      }

Handler::buyPower = (msg, session, next) ->

  playerId = session.get('playerId')
  player = null
  #buy_power = playerConfig.BUY_POWER
  buy_power = table.getTableItem('product',1)
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid:playerId}, cb
    (res, cb) ->

      player = res

      if player.power.value >= MAX_POWER_VALUE
        cb {code: 501, msg: "体力已达上限"}

      else if player.dailyGift.powerBuyCount <= 0
        cb {code: 501, msg: "购买次数已经用完"}

      else if player.gold < buy_power.consume
        cb {code: 501, msg: "元宝不足"}

      else
        player.updateGift 'powerBuyCount', player.dailyGift.powerBuyCount - 1
        player.resumePower buy_power.obtain
        player.decrease 'gold', buy_power.consume
        cb()

  ],(err) ->
    if err
      return next null, {code: err.code, msg: err.msg}
    player.save()
    next null, {
      code: 200,
      msg: {
        power: player.power.value
      }
    }

Handler::buyChallengeCount = (msg, session, next) ->

  playerId = session.get('playerId')
  player = null
  #buy_challengeCount = playerConfig.BUY_CHALLENGECOUNT
  buy_challengeCount = table.getTableItem('product',5)
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid:playerId}, cb
    (res, cb) ->

      player = res
      if player.dailyGift.challengeBuyCount <= 0
        cb {code: 501, msg: "购买次数已经用完"}

      else if player.gold < buy_challengeCount.consume
        cb  {code: 501, msg: "元宝不足"}

      else
        player.updateGift 'challengeBuyCount', player.dailyGift.challengeBuyCount - 1
        player.updateGift 'challengeCount' , player.dailyGift.challengeCount + buy_challengeCount.obtain
        player.decrease 'gold', buy_challengeCount.consume
        cb()

  ],(err) ->
    if err
      return next null, {code: err.code, msg: err.msg}
    player.save()
    next null, {
      code: 200,
      msg: {
        challengeCount: player.dailyGift.challengeCount
      }
    }

Handler::buyExpCard = (msg, session, next) ->
  playerId = session.get('playerId')
  qty = msg.qty

  PRICE = table.getTableItem('product',6).consume

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    if _.keys(player.cards).length >= MAX_CARD_COUNT
      return nexl(null, {code: 501, msg: '卡牌容量已经达到最大值'})

    if player.money < qty * PRICE
      return next(null, {code: 501, msg: '铜板不足'})

    playerManager.addExpCardFor player, qty, (err, cards) ->
      if err
        return next(null, err)

      player.decrease 'money', qty * PRICE
      player.save()
      next(null, {code: 200, msg: {card: cards[0], cardIds: cards.map (c) -> c.id}})


