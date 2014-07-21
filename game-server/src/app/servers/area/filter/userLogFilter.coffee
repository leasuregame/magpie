logger = require('pomelo-logger').getLogger(__filename)

module.exports = (app)->
  new Filter(app)

class Filter
  constructor: (@app) ->

  before: (msg, session, next) ->
    route = msg.__route__
    playerId = session.get('playerId')

    @app.get('dao').userLog.createLog data: {
      playerId: playerId,
      route: route,
      params: msg
    }, (err, res) ->
      if err
        logger.error(err)
      session.__logid__ = res.id
      next()

  after: (err, msg, session, resp, next) ->
    @app.get('dao').userLog.update {
      data: 
        result: resp
      where:
        id: session.__logid__
    , (err, res) ->
      if err
        logger.error(err)

    next()