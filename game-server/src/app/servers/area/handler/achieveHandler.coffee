playerManager = require('pomelo').app.get('playerManager')
table = require '../../../manager/table'
utility = require '../../../common/utility'
_ = require 'underscore'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::achievements = (msg, session, next) ->
  playerId = session.get('playerId')

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    results = {}
    for k, v of player.achievement
      results[k] = {
        isAchieve: v.isAchieve
        isTake: v.isTake
        got: v.got
      }
    next(null, {code: 200, msg: results})

Handler::getReward = (msg, session, next) ->
  playerId = session.get('playerId')
  achId = msg.id 

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    data = table.getTableItem('achievement', achId)
    if not data
      return next(null, {code: 501, msg: '找不到对应的成就'})

    ach = utility.deepCopy(player.achievement)
    if not _.has(ach, achId) or not ach[achId].isAchieve
      return next(null, {code: 501, msg: '还未达成该成就'})

    if _.has(ach, achId) and ach[achId].isTake
      return next(null, {code: 501, msg: '不能重复领取'})

    ach[achId].isTake = true
    player.achievement = ach
    player.increase('energy', data.energy)
    player.increase('gold', data.gold)
    player.save()
    next(null, {code: 200})