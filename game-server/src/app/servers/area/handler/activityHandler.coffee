async = require 'async'
table = require '../../../manager/table'
utility = require '../../../common/utility'
_ = require 'underscore'

LOGIN_REWARD = 20

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::get = (msg, session, next) ->
  type = msg.type
  args = msg.args
  playerId = session.get('playerId')

  if not Activity[type]
    return next(null, {code: 501, msg: '没有该类型奖励'})

  Activity[type](@app, playerId, type, args, next)


class Activity

  @login: (app, playerId, type, args, next) ->
    async.waterfall [
      (cb) ->
        app.get('playerManager').getPlayerInfo pid: playerId, cb

      (player, cb) ->
        if player.dailyGift.hasGotLoginReward
          return cb({code: 501, msg: '已领取'})

        player.increase('gold', LOGIN_REWARD)
        player.updateGift 'hasGotLoginReward', 1
        player.save()
        cb()
    ], (err) ->
      if err
        return next(null, {code: err.code or 501, msg: err.msg or err})
      next(null, {code: 200})

  @recharge: (app, playerId, type, args, next) ->
    if not args or not args.id or not _.isNumber(args.id)
      return next(null, {code: 501, msg: '参数不正确'})

    player = null
    async.waterfall [
      (cb) ->
        app.get('playerManager').getPlayerInfo pid: playerId, cb

      (res, cb) ->
        player = res
        app.get('dao').order.rechargeOnPeriod playerId, '2014-01-19', '2014-02-28', cb

      (cash, cb) ->
        if hasGotRechargeReward(player.activities, args.id)
          return cb({code: 501, msg: '不能重复领取'})

        row = table.getTableItem('new_year_rechage', args.id)
        if not row
          return cb({code: 501, msg: '找不到礼包配置信息'})

        if cash < row.cash
          return cb({code: 501, msg: '充值金额不够，不能领取'})

        player.increase('money', row.money)
        player.increase('energy', row.energy)
        player.increase('fragments', row.fragments)
        updateRechageRewardFlag(player, args.id)
        player.save()
        cb()
    ], (err) ->
      if err
        return next(null, {code: err.code or 501, msg: err.msg or err})
      next(null, {code: 200})

updateRechageRewardFlag = (player, id) ->
  if not player.activities.recharge
    player.activities.recharge = 0

  at = utility.deepCopy(player.activities)
  at.recharge = utility.mark(at.recharge, id)
  player.set('activities', at)

hasGotRechargeReward = (actInfo, id) ->
  if not actInfo?.recharge
    return

  utility.hasMark actInfo.recharge, id
