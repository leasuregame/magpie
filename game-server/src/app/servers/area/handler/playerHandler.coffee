dao = require('pomelo').app.get('dao')
table = require '../../../manager/table'
playerManager = require('pomelo').app.get('playerManager')
utility = require '../../../common/utility'
msgConfig = require '../../../../config/data/message'
playerConfig = require '../../../../config/data/player'
async = require 'async'
_ = require 'underscore'

resData = table.getTableItem('resource_limit', 1)
MAX_POWER_VALUE = resData.power_value


module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::randomPlayers = (msg, session, next) ->
  playerId = session.get('playerId')

  limit = 5
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb

    (player, cb) ->
      ids = player.friends.map (f) -> f.id
      dao.player.random playerId, ids, limit, cb
  ], (err, friends) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200, msg: friends: friends})

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
      where = " receiver = #{playerId} and type = #{msgConfig.MESSAGETYPE.BLESS} and createTime between #{start.valueOf()} and #{end.valueOf()}"
      dao.message.fetchMany where: where, cb
  ], (err, results) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    player = results[0]
    messages = results[1]
    friends = checkFriendsStatus(player, messages)
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

    lineUp = {}
    lineUp[k] = player.cards[v]?.toJson() or (v is -1 and player.spiritor.lv or 0) for k, v of player.lineUpObj()
    next(null, {code: 200, msg: {
      lineUp: lineUp
      name: player.name
      lv: player.lv
      ability: player.getAbility()
    }})

Handler::givePower = (msg, session, next) -> 

  cur_hour = new Date().getHours()

  if @app.get('debug')
    cur_hour = msg.hour

  if not canGetPower(cur_hour)
    return next(null, {code: 501, msg: '不在领取体力的时间段'})

  playerId = session.get('playerId')
  playerManager.getPlayerInfo {pid: playerId}, (err, player) ->
    if err
      return next(null, {
        code: err.code or 501
        msg: err.msg or err
        }
      )      

    if hasGetPower(player, cur_hour) 
      return next(null, {code: 501, msg: '不能重复领取'})

    point = playerConfig.POWER_GIVE.point
    player.givePower(cur_hour, point)
    player.save()
    next(null, {code: 200, msg: {powerValue: point}})

Handler::getActivityInfo = (msg, session, next) ->
  playerId = session.get('playerId')

  playerManager.getPlayerInfo {pid: playerId}, (err, player) ->
    if err
      return next(null, {
        code: err.code or 501
        msg: err.msg or err
        }
      )   

    cur_hour = new Date().getHours()
    next(null, {code: 200, msg: {
      canGetPower: not hasGetPower(player, cur_hour) and canGetPower(cur_hour)
      levelReward: player.levelReward
    }})

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
    player.setLevelReward(id)
    player.save()
    next(null, {code: 200, msg: {gold: data.gold}})

canGetPower = (hour) ->
  canGetHours = []
  for h in playerConfig.POWER_GIVE.hours
    for i in [0...playerConfig.POWER_GIVE.duration]
      canGetHours.push h+i 
  _.contains canGetHours, hour

hasGetPower = (player, hour) ->
  _.contains player.dailyGift.powerGiven, hour

todayPeriod = () ->
  now = new Date()
  year = now.getFullYear()
  month = now.getMonth()
  day = now.getDate()
  start = new Date(year, month, day)
  end = new Date(year, month, day + 1)
  [start, end]

checkFriendsStatus = (player, messages) ->
  friends = []
  for f in player.friends
    f = utility.deepCopy f
    f.canReceive = false
    f.canGive = true

    matches = messages.filter (m) -> m.sender is f.id and m.status is msgConfig.MESSAGESTATUS.UNHANDLED
    if _.contains(player.dailyGift.receivedBless.givers, f.id) and matches.length > 0
      f.canReceive = true
      f.msgId = matches[0].id

    if _.contains(player.dailyGift.gaveBless.receivers, f.id)
      f.canGive = false

    friends.push f
  friends