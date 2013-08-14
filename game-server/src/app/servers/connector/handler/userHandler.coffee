Code = require '../../../../../shared/code'
Resources = require '../../../../../shared/resources'
async = require 'async'
dao = require('pomelo').app.get('dao')
logger = require('pomelo-logger').getLogger(__filename)
_ = require 'underscore'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::register = (msg, session, next) ->
  account = msg.account
  password = msg.password
  
  if not account or account is '' or not password or password is ''
    next(null, {code: 501, msg: Resources.ERROR.INVALID_PARAMS})
  else
    dao.user.create data: {account: account, password: password}, (err, user) ->
      if err or not user
        if err and err.code is "ER_DUP_ENTRY"
          next(null, {code: 501, msg: Resources.ERROR.USER_EXISTS})
        else
          next(null, {code: 500, msg: err.msg})
      else
        next(null, {code: 200, msg: {userId: user.id}})

Handler::login = (msg, session, next) ->
  account = msg.account
  password = msg.password
  areaId = msg.areaId

  user = null;
  player = null
  async.waterfall [
    (cb) ->
      dao.user.fetchOne where: {account:account}, cb
    
    (res, cb) ->
      user = res
      if password isnt user.password
        cb({code: 501, msg: '密码不正确'})
      else
        cb()

    (cb) =>
      # check whether has create player in the login area
      if _.contains user.roles, areaId
        @app.rpc.area.playerRemote.getPlayerByUserId session, user.id, (err, res) ->
          if err
            logger.error 'fail to get player by user id', err

          player = res
          cb(null, user.id)
      else
        cb(null, user.id)

    (userId, cb) ->
      session.bind userId, cb

    (cb) =>
      session.set('areaId', areaId)
      if player?
        session.set('playerId', player.id)
        session.set('playerName', player.name)

      session.on('close', onUserLeave.bind(null, @app))
      session.pushAll cb
  ], (err) ->
    if err
      logger.error 'fail to login: ' + err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    user.lastLoginArea = areaId
    user.save()
    next(null, {code: 200, msg: {user: user?.toJson(), player: player}})

onUserLeave = (app, session, reason) ->
  if not session or not session.uid
    return

  app.rpc.area.playerRemote.playerLeave session, playerId: session.get('playerId'), (err) ->
    if err
      logger.error 'user leave error' + err

