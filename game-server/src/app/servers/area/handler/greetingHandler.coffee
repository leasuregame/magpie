dao = require('pomelo').app.get('dao')
playerManager = require('pomelo').app.get('playerManager')
async = require 'async'
logger = require('pomelo-logger').getLogger(__filename)
utility = require '../../../common/utility'
table = require '../../../manager/table'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::send = (msg, session, next) ->
  playerId = session.get('playerId')
  playerName = session.get('playerName')
  content = msg.content

  if not content or content is ''
    return next(null, {code: 501, msg: '内容不能为空'})

  if content.length > 20
    return next(null, {code: 501, msg: '内容过长，请重新输入'})

  player = null
  consume = 0
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb

    (res, cb) ->
      player = res
      consume = table.getTableItem('values', 'greetingConsumeGold')?.value or 20
      if player.gold < consume
        return cb({code: 501, msg: '魔石不足'})

      dao.greeting.create {
        data: 
          playerId: playerId
          playerName: playerName
          content: content
          created: utility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
      }, cb

    (greet, cb) =>
      @app.get('messageService').pushMessage {
        route: 'onGreeting'
        msg: name: playerName, content: content
      }, cb     

    (gres, cb) ->
      player.decrease 'gold', consume
      player.save()
      cb()
  ], (err) ->
    if err
      return next(null, {code: err.code or 501, msg: err.msg or err})

    next(null, {code: 200})

Handler::getLatest = (msg, session, next) ->
  dao.greeting.fetchMany {
    limit: 10,
    orderby: 'created DESC'
  }, (err, res) ->
    if err
      return next(null, {code: err.code or 501, msg: err.msg or err})

    result = res.map (r) -> content: r.content, name: r.playerName
    next(null, {code: 200, msg: result})