dao = require('pomelo').app.get('dao')

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::playBack = (msg, session, next) ->
  msgId = msg.msgId 
  dao.message.fetchOne where: id: msgId, (err, res) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    dao.battleLog.fetchOne where: id: res.options.battleLogId, (err, bl) ->
      if err
        return next(null, {code: err.code or 500, msg: err.msg or err})

      next(null, {code: 200, msg: bl.toJson()})