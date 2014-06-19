table = require '../manager/table'
utility = require '../common/utility'
schedule = require 'pomelo-schedule'

module.exports = (app, opts) ->
  return new Component(app, opts)

class Component
  constructor: (@app, opts={}) ->
    @jobId = null

  @name = '__worldCupRewardNotice__'

  start: (cb) ->
    @jobId = schedule.scheduleJob("0 0 12 * 5-8 *", noticeRewardToReceive, @app)
    process.nextTick cb

  afterStart: (cb) ->
    process.nextTick cb

  stop: (force, cb) ->
    schedule.cancelJob(@jobId)
    process.nextTick cb

noticeRewardToReceive = (app) ->
  app.get('dao').worldCup.fetchMany where: {
    gameDate__le: utility.dateFormat(new Date(), 'yyyy-MM-dd')
    got: 0
  }, (err, rows) ->
    if not err and rows
      player_ids = processRows(rows)
      player_ids = _.uniq player_ids
      sendMessageTo app, player_ids

processRows = (rows) ->
  if not rows or rows.length is 0
    return []

  results = []
  rows.forEach (row) ->
    if isRightResult(row) 
      results.push row.playerId

  results

isRightResult = (row) ->
  return false if not _.isObject(row.answer)

  _res = false
  _.keys(row.answer).forEach (k) ->
    result = table.getTableItem('against_time_list', k)?.result
    _res = true if result is row.answer[k]

  return _res

sendMessageTo = (app, ids) ->
  app.get('messageService').pushByPids ids, {
    route: 'onWorldCupReward'
    msg: {}
  }, (err, res) ->

