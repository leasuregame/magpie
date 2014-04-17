async = require 'async'
table = require '../../../manager/table'
utility = require '../../../common/utility'
entityUtil = require '../../../util/entityUtil'
_ = require 'underscore'

LOGIN_REWARD = 20

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::get = (msg, session, next) ->
  type = msg.type
  args = msg.args
  playerId = session.get('playerId')

  # startDate = new Date @app.get('sharedConf').newYearActivity.startDate
  # endDate = new Date @app.get('sharedConf').newYearActivity.endDate
  # endDate.setDate(endDate.getDate()+1)
  # now = new Date()

  # if startDate > now or now > endDate
  #   return next(null, {code: 501, msg: '不在领取时间段'})

  if not Activity[type]
    return next(null, {code: 501, msg: '没有该类型奖励'})

  Activity[type](@app, playerId, args, next)


class Activity
  # 新服累计登陆次数奖励
  @loginCount: (app, playerId, args, next) ->
    if not args or not args.count or not _.isNumber(args.count)
      return next(null, {code: 501, msg: '参数不正确'})

    player = null
    async.waterfall [
      (cb) ->
        app.get('playerManager').getPlayerInfo pid: playerId, cb

      (res, cb) ->
        player = res

        if not player.canGetLoginCountReward(args.count)
          return next(null, {code: 501, msg: '累计登陆次数不足'})

        if player.hasLoginCountReward(args.count) 
          return next(null, {code: 501, msg: '已领取'})

        rewardData = table.getTableItem('login_count_reward', args.count)
        if not rewardData
          return next(null, {code: 501, msg: '找不到该奖励'})

        entityUtil.getReward player, rewardData, cb
    ], (err, cards) ->
      if err
        return next(null, {code: err.code or 501, msg: err.msg or err})

      player.setLoginCountReward(args.count)
      player.save()
      next(null, {code: 200, msg: card: if (!!cards and cards.length > 0) then cards[0]?.toJson() else null})

  # 登陆奖励
  @login: (app, playerId, args, next) ->
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

  # 累计充值奖励
  @recharge: (app, playerId, args, next) ->
    if not args or not args.id or not _.isNumber(args.id)
      return next(null, {code: 501, msg: '参数不正确'})

    player = null
    async.waterfall [
      (cb) ->
        app.get('playerManager').getPlayerInfo pid: playerId, cb

      (res, cb) ->
        player = res
        startDate = app.get('sharedConf').newYearActivity.startDate
        endDate = app.get('sharedConf').newYearActivity.endDate
        app.get('dao').order.rechargeOnPeriod playerId, startDate, endDate, cb

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
