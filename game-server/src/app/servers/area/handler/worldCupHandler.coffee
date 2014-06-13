table = require '../../../manager/table'
utility = require '../../../common/utility'
playerManager = require('pomelo').app.get('playerManager')
async = require 'async'
job = require '../../../dao/job'
_ = require 'underscore'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::todayGames = (msg, session, next) ->
  playerId = session.get('playerId')
  isCanAnswer = false
  reward = null

  date_for = tomorrow()
  items = _.clone table.getTable('against_time_list')?.filter (id, row) -> 
    game_date = utility.dateFormat(new Date(row.date), 'yyyy-MM-dd')
    game_date is date_for

  if not items or items.length is 0
    return next(null, {code:200, msg: games: [], isCanAnswer: isCanAnswer, reward: reward})

  items = JSON.parse JSON.stringify(items)
  async.waterfall [
    (cb) =>
      checkRewardThatNotReceive @app, playerId, cb
    (cb) =>
      @app.get('dao').worldCup.fetchOne where: {playerId: playerId, gameDate: date_for}, (err, res) ->
        if err and err.code is 404
          cb(null, null)
        else
          cb(err, res)
    (record, cb) ->
      console.log '-a-a-a-', record, JSON.stringify(items)
      if record
        answer = record.answer
        if answer
          reward = checkAnswerAndCountReward(items, answer)
      else
        isCanAnswer = true

      cb()
    (cb) =>
      getRewardThatNotReceive @app, playerId, cb
  ], (err, reward) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    items = items.map (g) ->
      id: g.id
      home_team: g.home_team
      visiting_team: g.visiting_team
      answer: g.answer
      gold: g.reward_gold

    return next(null, {code: 200, msg: games: items, isCanAnswer: isCanAnswer, reward: reward, gameDate: date_for})

Handler::lastGames = (msg, session, next) ->
  playerId = session.get('playerId')

  getRewardForLastDayGame @app, playerId, (err, reward, items) ->
    items = items or []
    items = items.map (g) ->
      id: g.id
      home_team: g.home_team
      visiting_team: g.visiting_team
      score: g.score
      bingo: g.answer is g.result
      answer: g.answer

    return next(null, {code: 200, msg: games: items, gameDate: today()})

Handler::submitAnswer = (msg, session, next) ->
  playerId = session.get('playerId')
  answer = msg.answer

  if not _.isObject(answer)
    return next(null, {code: 200, msg: '参数错误'})

  ids = _.keys(answer)
  isOk = true
  ids.forEach (id) -> 
    row = table.getTableItem('against_time_list', id)
    if not row or not row.date
      isOk = false
      return 

    if utility.dateFormat(new Date(row.date), 'yyyy-MM-dd') isnt tomorrow()
      isOk = false
      return

  if not isOk 
    return next(null, {code: 501, msg: '只能预测明天比赛的结果'})

  @app.get('dao').worldCup.create data: {
    playerId: playerId,
    gameDate: tomorrow(),
    answer: answer,
    created: utility.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
  }, (err, row) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    next(null, {code: 200})

Handler::getReward = (msg, session, next) ->
  playerId = session.get('playerId')
  
  getRewardThatNotReceive @app, playerId, (err, reward, row_ids) ->
    if reward and not _.isEmpty(reward)
      playerManager.getPlayerInfo pid: playerId, (err, player) ->
        if not err and player
          player.increase 'gold', reward.gold
          updatePlayerAndWorldCup player, row_ids, (err, res) ->
            if err
              return next(null, {code: err.code or 500, msg: err.msg or ''})
            else
              return next(null, {code: 200, msg: gold: player.gold})
        else
          return next(null, {code: err.code or 500, msg: err.msg or ''})
    else
      return next(null, {code: 501, msg: '没有奖励可领取'})

updatePlayerAndWorldCup = (player, row_ids, callback) ->
  jobs = [
    {
      type: 'update'
      options: 
        table: 'player'
        where: id: player.id
        data: gold: player.gold
    },
    {
      type: 'update'
      options:
        table: 'worldCup'
        where: " id in (#{row_ids.toString()}) "
        data: got: 1
    }
  ]
  job.multJobs jobs, callback

  # entityUtil.updateEntities ['update', 'player', player], ['delete', 'worldCup', row_ids], (err, res) ->
  #   console.log 'update data: ', err, res
  #   callback err, res

getRewardForLastDayGame = (app, playerId, callback) ->
  _date = today()
  items = table.getTable('against_time_list')?.filter (id, row) -> 
    game_date = utility.dateFormat(new Date(row.date), 'yyyy-MM-dd')
    game_date is _date

  if not items or items.length is 0
    return callback(null)

  reward = null
  app.get('dao').worldCup.fetchOne where: {playerId: playerId, gameDate: _date}, (err, row) ->
    if !!row
      answer = row.answer
      if answer
        reward = checkAnswerAndCountReward(items, answer)
      callback(null, reward, items)
    else 
      callback(null)

checkRewardThatNotReceive = (app, playerId, callback) ->
  app.get('dao').worldCup.fetchMany where: {
    playerId: playerId,
    got: 0,
    bingo: 0,
    gameDate__le: today()
  }, (err, rows) ->
    if not err and rows.length > 0
      ids = []
      rows.forEach (r) ->
        ids.push r.id if isRightResult(r)

      return callback() if ids.length is 0

      app.get('dao').worldCup.update {
        where: " id in (#{ids.toString()}) ",
        data: bingo: 1
      }, (err, res) -> callback()
    else 
      callback()

getRewardThatNotReceive = (app, playerId, callback) ->
  reward = {}
  ids = []
  app.get('dao').worldCup.fetchMany where: {
    playerId: playerId,
    got: 0,
    bingo: 1
  }, (err, rows) ->
    if not err and rows.length > 0
      rows.forEach (r) ->
        ids.push r.id
        if _.isObject(r.answer)
          _.keys(r.answer).forEach (k) ->
            d = table.getTableItem('against_time_list', k)
            if d?.result is r.answer[k]
              reward['gold'] = (reward['gold'] or 0) + d.reward_gold

    callback null, reward, ids

isRightResult = (row) ->
  data = table.getTableItem('against_time_list', row.tableId)
  return true if data?.result is row.answer[data?.id]
  false

timeForADay = () ->
  time12 = new Date(2014, 6, 13, 12)
  dts = 1000 * 60 * 5
  nowtime = new Date()

  days = (nowtime.getTime() - time12.getTime())/dts
  time12.setDate(time12.getDate()+days)
  time12

today = () ->
  utility.dateFormat(timeForADay(), 'yyyy-MM-dd')

tomorrow = () ->
  now = timeForADay()
  now.setDate(now.getDate()+1)
  utility.dateFormat(now, 'yyyy-MM-dd')

checkAnswerAndCountReward = (items, answer) ->
  reward = {}
  
  items.forEach (i) ->
    i.answer = answer[i.id] if answer[i.id]

    if i.result and i.score and (parseInt(i.answer) is parseInt(i.result))
      processReward(reward, i)
      i.bingo = true
    else
      i.bingo = false

  reward

processReward = (reward, item) ->
  _.keys(item).forEach (key) ->
    if /reward_\w+/.test(key)
      name = key.slice(7)
      if reward[name]
        reward[name] += item[key]
      else 
        reward[name] = item[key]
  