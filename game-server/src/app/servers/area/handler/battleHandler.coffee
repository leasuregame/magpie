dao = require('pomelo').app.get('dao')
_ = require 'underscore'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::playBack = (msg, session, next) ->
  battleLogId = msg.battleLogId 
  dao.battleLog.fetchOne where: id: battleLogId, (err, bl) ->
    if err and not bl
      return next(null, {code: 501, msg: '战报不存在，无法播放'})

    next(null, {code: 200, msg: battleLog: _.extend({}, bl.battleLog, id: bl.id)})
