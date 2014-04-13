Cache = require '../../../common/cache'

requestsHistory = new Cache()

module.exports = ->
  new Filter()

class Filter
  before: (msg, session, next) ->
    route = msg.__route__
    playerId = session.get('playerId')

    key = route+'*'+playerId
    if typeof limitRouteMap[route] != 'undefined'
      if requestsHistory.get(key)
        return next({stack: route+'请求过于频繁'}, {code: 505, msg: limitRouteMap[route].msg})
      else
        requestsHistory.put(key, true, limitRouteMap[route].timeout)

    next()

limitRouteMap = {
  # 'area.taskHandler.passBarrier': timeout: 3000, msg: '爬塔过于频繁，3秒后再试'
  # 'area.taskHandler.explore': timeout: 2000, msg: '探索过于频繁'
  # 'area.rankHandler.challenge': timeout: 3000, msg: '挑战过于频繁，请3秒钟后重试'
}