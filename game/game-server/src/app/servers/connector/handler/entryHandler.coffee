userDao = require '../../../manager/userDao'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::entry = (msg, session, next) ->
  username = msg.name

  next(null, {code: 200, msg: 'game server is ok'})