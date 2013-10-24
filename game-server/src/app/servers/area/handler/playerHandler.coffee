dao = require('pomelo').app.get('dao')
playerManager = require '../../../manager/playerManager'
utility = require '../../../common/utility'
msgConfig = require '../../../../config/data/message'
async = require 'async'
_ = require 'underscore'


module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

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
      ability: player.ability
    }})

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