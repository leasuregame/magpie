table = require '../../../manager/table'
utility = require '../../../common/utility'
playerManager = require('pomelo').app.get('playerManager')

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::todayGames = (msg, session, next) ->
  playerId = session.get('playerId')

  date_for = dateForGame()
  items = table.getTable('against_time_list')?.filter (id, row) ->
    game_date = utility.dateFormat(new Date(row.date), 'yyyy-MM-dd')
    return game_date is date_for

  if not items or items.length is 0
    return next(null, {code:200, msg: games: []})

  @app.get('dao').worldCup.fetchOne {playerId: playerId, gameDate: date_for}, (err, row) ->
    if !!row
      answer = row.answer
      if answer
        items.forEach (i) -> 
          i.answer = answer[i.id] if answer[i.id]

    return next(null, {code: 200, msg: games: items})

dateForGame = () ->
  today = new Date()
  if today.getHours() < 12
    return utility.dateFormat(today, 'yyyy-MM-dd')
  else 
    today.setDate(today.getDate()+1)
    return utility.dateFormat(today, 'yyyy-MM-dd')

checkAnswerAndCountReward = (items, answer) ->


Handler::submitAnswer = (msg, session, next) ->
  playerId = session.get('playerId')

  answer = msg.answer or []

  @app.get('dao').worldCup.create data: {
    playerId: playerId,
    gameDate: dateForGame(),
    answer: answer,
    created: utility.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
  }, (err, row) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    next(null, {code: 200})

Handler::getReward = (msg, session, next) ->
  next(null)