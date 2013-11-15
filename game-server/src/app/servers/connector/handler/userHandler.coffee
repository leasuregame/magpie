async = require 'async'
utility = require '../../../common/utility'
logger = require('pomelo-logger').getLogger(__filename)
_ = require 'underscore'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::register = (msg, session, next) ->
  @app.rpc.auth.authRemote.register session, {
    account: msg.account
    password: msg.password
  }, (err, user) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200, msg: {userId: user.id}})

Handler::login = (msg, session, next) ->
  account = msg.account
  password = msg.password
  areaId = msg.areaId

  user = null
  player = null
  uid = null
  async.waterfall [
    (cb) =>
      session.set('areaId', areaId)
      session.pushAll cb

    (cb) =>
      @app.rpc.auth.authRemote.auth session, account, password, areaId, @app.getServerId(), cb

    (res, cb) =>
      user = res
      uid = user.id + '*' + areaId
      sessionService = @app.get 'sessionService'
      sessionService.kick(uid,cb)
    (cb) =>
      # check whether has create player in the login area
      if _.contains user.roles, areaId
        @app.rpc.area.playerRemote.getPlayerByUserId session, user.id, @app.getServerId(), (err, res) ->
          if err
            logger.error 'fail to get player by user id', err
            return cb(err)
          player = res
          cb()
      else
        cb()

    (cb) =>
      session.set('userId', user.id)
      session.bind(uid, cb)
    (cb) =>
      if player?
        session.set('playerId', player.id)
        session.set('playerName', player.name)
        session.on('closed', onUserLeave.bind(null, @app))
      session.pushAll cb
  ], (err) ->
    if err
      logger.error 'fail to login: ', err, err.stack
      return next(null, {code: err.code or 500, msg: err.msg or err.message or err})

    next(null, {code: 200, msg: {user: user, player: player}})

onUserLeave = (app, session, reason) ->
  if not session or not session.uid
    return
  app.rpc.area.playerRemote.playerLeave session, session.get('playerId'), session.uid, app.getServerId(), (err) ->
    if err
      logger.error 'user leave error' + err

