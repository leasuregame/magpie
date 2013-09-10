playerManager = require '../../../manager/playerManager'
table = require '../../../manager/table'
utility = require '../../../common/utility'

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
        isAchive: v.isAchieve
        got: v.got
      }
    next(null, {code: 200, msg: results})

Handler::getReward = (msg, session, next) ->
  playerId = session.get('playerId')
  achId = msg.id 

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    data = table.getTableItem('achievement', achid)
    player.increase('money', data.money)
    player.increase('gold', data.gold)
    player.save()
    next(null, {code: 200})
    

