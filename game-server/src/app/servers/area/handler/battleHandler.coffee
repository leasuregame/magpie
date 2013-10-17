dao = require('pomelo').app.get('dao')
_ = require 'underscore'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::playBack = (msg, session, next) ->
  battleLogId = msg.battleLogId 
  dao.battleLog.fetchOne where: id: battleLogId, (err, bl) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200, msg: battleLog: _.extend({}, bl.battleLog, id: bl.id)})