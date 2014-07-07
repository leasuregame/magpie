dao = require('pomelo').app.get('dao')
table = require '../../../manager/table'
playerManager = require('pomelo').app.get('playerManager')
utility = require '../../../common/utility'
configData = require '../../../../config/data'
achieve = require '../../../domain/achievement'
async = require 'async'
areaUtil = require '../../../util/areaUtil'
appUtil = require '../../../util/appUtil'
_ = require 'underscore'

resData = table.getTableItem('resource_limit', 1)
MAX_POWER_VALUE = resData.power_value


module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::searchPlayer = (msg, session, next) ->
  name = msg.name

  dao.player.fetchOne {
    where: name: name
    fields: ['id', 'name', 'lv', 'ability']
  }, (err, player) ->
    if err
      return next(null, {code: 501, msg: "找不到玩家"})

    next(null, {
      code: 200
      msg: 
        id: player.id
        name: player.name
        lv: player.lv
        ability: player.ability
    })

Handler::randomPlayers = (msg, session, next) ->
  playerId = session.get('playerId')

  limit = 5
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb

    (player, cb) ->
      ids = player.friends.map (f) -> f.id
      dao.player.random playerId, ids, limit, cb
  ], (err, players) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200, msg: players: players})

Handler::setStep = (msg, session, next) ->
  playerId = session.get('playerId')
  step = msg.step

  if not step or not _.isNumber(step)
    return next(null, {code: 501, msg: '参数错误'})

  playerManager.getPlayerInfo {pid: playerId}, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    player.set('teachingStep', step)
    player.save()
    next(null, {code: 200})

Handler::getFriends = (msg, session, next) ->
  playerId = session.get('playerId')

  async.parallel [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (cb) ->
      [start, end] = todayPeriod()
      where = " receiver = #{playerId} and type = #{configData.message.MESSAGETYPE.BLESS} and createTime between #{start.valueOf()} and #{end.valueOf()}"
      dao.message.fetchMany where: where, cb
  ], (err, results) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    player = results[0]
    messages = results[1]
    friends = checkFriendsStatus(player, messages)
    achieve.friends(player, friends.length)
    next(null, {code: 200, msg: {
      friends: friends
      giveCount: player.dailyGift.gaveBless.count
      receiveCount: player.dailyGift.receivedBless.count
      friendsCount: player.friendsCount
    }})

Handler::getLineUpInfo = (msg, session, next) ->
  playerId = msg.playerId

  if not playerId
    next(null, {code: 501, msg: 'id参数不能为空'})

  dao.player.getLineUpInfo playerId, (err, player) ->
    if err
      return next(null, {
        code: err.code or 501
        msg: err.msg or err
        }
      )
    
    lineUp = []
    for lu in player.lineUp
      i = {}
      i[k] = player.cards[v]?.toJson() or (v is -1 and player.spiritor.lv or 0) for k, v of lu
      lineUp.push i

    next(null, {code: 200, msg: {
      lineUp: lineUp
      name: player.name
      lv: player.lv
      ability: player.getAbility()
      vip: player.vip
      rankStats: player.rankStats or {}
    }})

Handler::givePower = (msg, session, next) -> 

  cur_hour = new Date().getHours()

  if msg.hour
    cur_hour = msg.hour

  if not canGetPower(cur_hour)
    return next(null, {code: 501, msg: '不在领取体力的时间段'})

  playerId = session.get('playerId')
  playerManager.getPlayerInfo {pid: playerId}, (err, player) =>
    if err
      return next(null, {
        code: err.code or 501
        msg: err.msg or err
        }
      )

    star_hour = powerGiveStartHour cur_hour
    if hasGetPower(player, star_hour) 
      return next(null, {code: 501, msg: '不能重复领取'})

    point = areaUtil.powerGivenValue(@app)
    player.givePower(star_hour, point)
    player.save()
    next(null, {code: 200, msg: {powerValue: point}})

Handler::getActivityInfo = (msg, session, next) ->
  playerId = session.get('playerId')

  async.parallel [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb
    # (cb) =>
    #   getRechargeRewardFlag @app, playerId, cb
  ], (err, results) =>
    if err
      return next(null, {
        code: err.code or 501
        msg: err.msg or err
        }
      )

    player = results[0]
    logined = player.activities.logined or {count: 0, got: 0}

    # rechargeFlag = results[1]
    # flag = setCanGetFlag player, rechargeFlag
    
    luckyCard = null
    activity = @app.get('sharedConf').activity
    if appUtil.isActivityTime(@app, 'luckyCard') 
      luckyCard = activity.luckyCard
    if appUtil.isActivityTime(@app, 'worldCup')
      worldCup = activity.worldCup
    
    cur_hour = new Date().getHours()
    next(null, {
      code: 200,
      msg: {
        canGetPower: canGetPower(cur_hour) and not hasGetPower(player, powerGiveStartHour cur_hour) 
        levelReward: player.levelReward
        # rechargeFlag: flag
        hasLoginReward: hasLoginReward(@app, player.dailyGift.hasGotLoginReward)
        loginInfo: logined # 新服累计登陆次数
        plan: player.plan
        vipLoginReward: !player.dailyGift.vipReward if player.isVip()
        luckyCard: {
          startDate: luckyCard.startDate
          endDate: luckyCard.endDate
          isVisable: luckyCard.enable || false
          info:
            tableId: luckyCard.data.tableId
            star: player.activities?.luckyCard.star || 0
        } if luckyCard
        worldCup: {
          startDate: worldCup.startDate
          endDate: worldCup.endDate
          isVisable: worldCup.enable
        } if worldCup
      }
    })

Handler::getLevelReward = (msg, session, next) ->
  playerId = session.get('playerId')
  id = msg.id
  data = table.getTableItem('player_upgrade_reward', id)
  if not data
    return next(null, {code: 501, msg: "找不到该奖励"})

  playerManager.getPlayerInfo {pid: playerId}, (err, player) ->
    if err
      return next(null, {
        code: err.code or 501
        msg: err.msg or err
        }
      )

    if player.hasLevelReward(id)
      return next(null, {code: 501, msg: '不能重复领取'})

    if player.lv < data.lv
      return next(null, {code: 501, msg: "等级未达到#{data.lv}级, 不能领取"})

    player.increase('gold', data.gold)
    player.increase('energy', data.energy)
    player.setLevelReward(id)
    player.save()
    next(null, {code: 200, msg: {gold: data.gold, energy: data.energy}})

canGetPower = (hour) ->
  canGetHours = []
  for h in configData.player.POWER_GIVE.hours
    for i in [0...configData.player.POWER_GIVE.duration]
      canGetHours.push h+i 
  _.contains canGetHours, hour

powerGiveStartHour = (hour) ->
  for h in configData.player.POWER_GIVE.hours
    for i in [0...configData.player.POWER_GIVE.duration]
      return h if h+i is hour or h is hour

hasGetPower = (player, hour) ->
  hour? and _.contains player.dailyGift.powerGiven, hour

todayPeriod = () ->
  now = new Date()
  year = now.getFullYear()
  month = now.getMonth()
  day = now.getDate()
  start = new Date(year, month, day)
  end = new Date(year, month, day + 1)
  [start, end]

checkFriendsStatus = (player, messages) ->
  if player.friends?.length is 0
    return []

  player.friends.map (f) ->
    f = utility.deepCopy f
    f.canReceive = false
    f.canGive = true

    matches = messages.filter (m) -> m.sender is f.id and m.status is configData.message.MESSAGESTATUS.UNHANDLED
    if matches.length > 0
      f.canReceive = true
      f.msgId = matches[0].id

    if _.contains(player.dailyGift.gaveBless.receivers, f.id)
      f.canGive = false

    return f

getRechargeRewardFlag = (app, playerId, cb) ->
  startDate = app.get('sharedConf').newYearActivity.startDate
  endDate = app.get('sharedConf').newYearActivity.endDate
  dao.order.rechargeOnPeriod playerId, startDate, endDate, (err, cash) ->
    return cb(err) if err

    if cash <= 0
      return cb(null, 0)

    len = (table.getTable('new_year_rechage').filter (id, row) -> row.cash <= cash).length
    return cb(null, Math.pow(2, len)-1)

setCanGetFlag = (player, rflag) ->
  recharge = player.activities.recharge or 0
  {
    canGet: recharge ^ rflag
    hasGet: recharge
  }

hasLoginReward = (app, isGot) ->
  startDate = new Date(app.get('sharedConf').newYearActivity.startDate)
  endDate = new Date(app.get('sharedConf').newYearActivity.endDate)
  endDate.setDate(endDate.getDate()+1)

  now = new Date()
  if startDate <= now < endDate
    return not isGot
  else 
    return false
