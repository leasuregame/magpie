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
        return next({stack: route+'请求过于频繁'}, {code: 501, msg: '请求过于频繁，5秒后再试'})
      else
        requestsHistory.put(key, true, limitRouteMap[route].timeout)

    next()

limitRouteMap = {
  'area.taskHandler.passBarrier': timeout: 5000
}