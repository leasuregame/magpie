async = require 'async'
utility = require '../../../common/utility'
logger = require('pomelo-logger').getLogger(__filename)
_ = require 'underscore'

EMAIL_REG = /^(?=\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$).{6,50}$/
ACCOUNT_REG = /[\w+]{6,50}$/
PASSWORD_REG = /^[a-zA-Z0-9]{6,20}$/
EMPTY_SPACE_REG = /\s+/g

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::register = (msg, session, next) ->
  account = msg.account
  password = msg.password

  if EMPTY_SPACE_REG.test(account) or EMPTY_SPACE_REG.test(password)
    return next(null, {code: 501, msg: '用户名或密码不能包含空格'})

  if not account? or account == '' or not password? or password == ''
    return next(null, {code: 501, msg: '用户名或密码不能为空'})

  if not EMAIL_REG.test(account) and not ACCOUNT_REG.test(account)
    return next(null, {code: 501, msg: '用户名只能由6-50的字符组成，推荐使用邮箱或手机号'})

  if not PASSWORD_REG.test(password)
    return next(null, {code: 501, msg: '密码只能由6-20位的数字或字母组成'})

  @app.rpc.auth.authRemote.register session, {
    account: msg.account
    password: msg.password
  }, (err, user) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200, msg: {userId: user.id}})

Handler::login = (msg, session, next) ->
  doLogin('app', @app, msg, session, next)

Handler::loginTB = (msg, session, next) ->
  doLogin('tongbu', @app, msg, session, next)

doLogin  = (type, app, msg, session, next) ->
  areaId = msg.areaId

  user = null
  player = null
  uid = null
  async.waterfall [
    (cb) =>
      session.set('areaId', areaId)
      session.pushAll cb

    (cb) =>
      [args, method] = authParams(type, msg, app)
      app.rpc.auth.authRemote[method] session, args, (err, u, isValid) ->
        if err and err.code is 404
          cb({code: 501, msg: '用户不存在'})
        else if err
          cb(err)
        else 
          cb(null, u)

    (res, cb) =>
      user = res
      uid = user.id + '*' + areaId
      sessionService = app.get 'sessionService'
      sessionService.kick(uid,cb)
    (cb) =>
      # check whether has create player in the login area
      if _.contains user.roles, areaId
        app.rpc.area.playerRemote.getPlayerByUserId session, user.id, app.getServerId(), (err, res) ->
          if err
            logger.error 'fail to get player by user id', err
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
        session.on('closed', onUserLeave.bind(null, app))
      session.pushAll cb
  ], (err) ->
    if err
      logger.error 'fail to login: ', err, err.stack
      return next(null, {code: err.code or 500, msg: err.msg or err.message or err})

    next(null, {code: 200, msg: {user: user, player: player, serverTime: Date.now()}})

onUserLeave = (app, session, reason) ->
  if not session or not session.uid
    return
  app.rpc.area.playerRemote.playerLeave session, session.get('playerId'), session.uid, app.getServerId(), (err) ->
    if err
      logger.error 'user leave error' + err

authParams = (type, msg, app) ->
  keyMap = 
    app: keys: ['account', 'password', 'areaId'], method: 'auth'
    tongbu: keys: ['nickName', 'userId', 'sessionId', 'areaId'], method: 'checkSession'
  
  args  = {}
  for k in keyMap[type]?.keys
    args[k] = msg[k] if msg[k]?

  args.fronendId = app.getServerId()
  [args, keyMap[type]?.method]