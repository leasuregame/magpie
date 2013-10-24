async = require 'async'
playerManager = require '../../../manager/playerManager'
playerConfig = require '../../../../config/data/player'
table = require '../../../manager/table'
RESOURE_LIMIT = table.getTableItem('resource_limit', 1)

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::buyMoney = (msg, session, next) ->

    playerId = session.get('playerId')
    player = null
    type = msg.type
    times = msg.times


    buy_money = table.getTableItem('product',type + 1)
    if buy_money.name isnt '铜板'
      return next null, {code: 500, msg: "购买类型错误"}

    money = times * buy_money.obtain
    gold = times * buy_money.consume

    async.waterfall [
       (cb) ->
         playerManager.getPlayerInfo {pid:playerId}, cb
       (res, cb) ->

         player = res
         if player.gold < gold
           cb {code: 501, msg: "元宝不足"}

         else if player.money + money > RESOURE_LIMIT.money
           cb {code: 501, msg: "超过仙币上限"}

         else
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
          money: player.money
        }
      }

Handler::buyPower = (msg, session, next) ->

  times = msg.times
  playerId = session.get('playerId')
  player = null
  buy_power = table.getTableItem('product',1)

  powerValue = times * buy_power.obtain
  gold = times * buy_power.consume

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid:playerId}, cb
    (res, cb) ->

      player = res

      if player.power.value >= RESOURE_LIMIT.power_value
        cb {code: 501, msg: "体力已达上限"}

      else if player.dailyGift.powerBuyCount <= 0
        cb {code: 501, msg: "购买次数已经用完"}

      else if player.dailyGift.powerBuyCount < times
        cb {code: 501, msg: "所剩购买次数不足"}

      else if player.power.value + powerValue > RESOURE_LIMIT.power_value
        cb {code: 501, msg: "超过体力上限"}

      else if player.gold < gold
        cb {code: 501, msg: "元宝不足"}

      else
        player.updateGift 'powerBuyCount', player.dailyGift.powerBuyCount - times
        player.resumePower powerValue
        player.decrease 'gold', gold
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

  times = msg.times
  playerId = session.get('playerId')
  player = null
  buy_challengeCount = table.getTableItem('product',5)

  buyCount = buy_challengeCount.obtain * times
  gold = buy_challengeCount.consume * times

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
        cb  {code: 501, msg: "元宝不足"}

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
        challengeCount: player.dailyGift.challengeCount
      }
    }

Handler::buyExpCard = (msg, session, next) ->
  playerId = session.get('playerId')
  times = msg.times

  PRICE = table.getTableItem('product',6).consume

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    if _.keys(player.cards).length >= RESOURE_LIMIT.card_count_limit
      return nexl(null, {code: 501, msg: '卡牌容量已经达到最大值'})

    if player.money < times * PRICE
      return next(null, {code: 501, msg: '铜板不足'})

    playerManager.addExpCardFor player, times, (err, cards) ->
      if err
        return next(null, err)

      player.decrease 'money', times * PRICE
      player.save()
      next(null, {code: 200, msg: {card: cards[0], cardIds: cards.map (c) -> c.id}})


