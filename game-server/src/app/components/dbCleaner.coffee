utility = require '../common/utility'
schedule = require 'pomelo-schedule'

module.exports = (app, opts) ->
  return new Component(app, opts)

class Component
  constructor: (@app, opts={}) ->
    @jobId = null

  @name = '__dbCleaner__'

  start: (cb) ->
    @jobId = schedule.scheduleJob("0/10 * * * * *", cleanUserLog, @app)
    process.nextTick cb

  afterStart: (cb) ->
    process.nextTick cb

  stop: (force, cb) ->
    schedule.cancelJob(@jobId)
    process.nextTick cb

cleanUserLog = (app) ->
  now = new Date()
  two_week_ago = now.setDate(now.getDate() - 14)
  app.get('dao').userLog.delete where: {
    created__date_lt: utility.dateFormat(two_week_ago, 'yyyy-MM-dd')
  }, (err, res) ->
    if err
      logger.error(err)