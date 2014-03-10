async = require 'async'
utility = require '../../../common/utility'
logger = require('pomelo-logger').getLogger(__filename)
_ = require 'underscore'
fs = require 'fs'
path = require 'path'
util = require 'util'
versionHandler = require '../../../../../shared/version_helper'
request = require 'request'

EMAIL_REG = /^(?=\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$).{6,50}$/
ACCOUNT_REG = /[\w+]{6,50}$/
PASSWORD_REG = /^[a-zA-Z0-9]{6,20}$/
EMPTY_SPACE_REG = /\s+/g

APP_STORE_TYPE = 'app'
TONG_BU_TYPE = 'tongbu'

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

  if not (EMAIL_REG.test(account) or ACCOUNT_REG.test(account))
    return next(null, {code: 501, msg: '用户名只能由6-50的字符组成'})

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
  doLogin(APP_STORE_TYPE, @app, msg, session, 'app', next)

Handler::loginTB = (msg, session, next) ->
  doLogin(TONG_BU_TYPE, @app, msg, session, null, next)

doLogin  = (type, app, msg, session, platform, next) ->  
  #console.log '-login-1-', 'sid=', session.id, msg,  msg.nickName
  areaId = msg.areaId
  user = null
  player = null
  uid = null
  async.waterfall [
    (cb) ->
      checkIsOpenServer app, cb

    (cb) ->
      ### 检查是否最新版本 ###
      checkVersion(app, msg, platform, cb)

    (cb) =>
      [args, method] = authParams(type, msg, app)
      args.sid = session.id
      console.log '-login-2-', args, method
      app.rpc.auth.authRemote[method] session, args, (err, u, isValid) ->
        console.log '-after auth-', msg.nickName
        if err and err.code is 404
          cb({code: 501, msg: '用户不存在'})
        else if err
          cb(err)
        else 
          cb(null, u)

    (u, cb) =>
      user = u
      # check whether has create player in the login area
      if _.contains user.roles, areaId
        app.rpc.area.playerRemote.getPlayerByUserId session, {
          areaId: areaId,
          userId: user.id, 
          serverId: app.getServerId()
        }, (err, res) ->
          console.log '-after player remote-', res?.name, res?.userId
          if err
            logger.error 'fail to get player by user id', err
          player = res
          cb()
      else
        cb()

    (cb) =>
      console.log '-login-4', player?.name
      uid = user.id + '*' + areaId
      session.set('areaId', areaId)
      session.set('userId', user.id)
      session.bind(uid, cb)
    (cb) =>
      if player?
        session.set('playerId', player.id)
        session.set('playerName', player.name)
        session.on('closed', onUserLeave.bind(null, app))
      session.pushAll cb
  ], (err) ->
    console.log '-login-5-err-', err
    if err
      logger.error 'fail to login: ', err, err.stack
      return next(null, {code: err.code or 500, msg: err.msg or err.message or err})

    ### 只有每个帐号的第一个角色才会进行新手教程，教程结束后不返回teachingStep ###
    if user?.roles.length > 1 or player?.teachingStep >= 17
      delete player.teachingStep

    next(null, {code: 200, msg: {user: user, player: player}})

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

  args.frontendId = app.getServerId()
  [args, keyMap[type]?.method]

getVersionData = (app, platform) ->
  if not platform
    platform = app.get('platform')
    
  vdata = JSON.parse(fs.readFileSync(path.join(app.getBase(), '..', 'shared', 'version.json'), 'utf8'))
  vdata[platform]

versionCompare = (stra, strb) ->
  straArr = stra.split('.')
  strbArr = strb.split('.')

  maxLen = Math.max(straArr.length, strbArr.length)
  for i in [0...maxLen]
    sa = ~~straArr[i]
    sb = ~~strbArr[i]
    if sa > sb
      result = 1 
    else if sa < sb
      result = -1 
    else 
      result = 0

    if result isnt 0
      return result
  result

checkVersion = (app, msg, platform, cb) ->
  version = msg.version or '1.0.0'
  vData = getVersionData(app, platform)
  if versionCompare(version, vData.version) >= 0
    cb()
  else
    if vData.version is vData.lastVersion or versionCompare(version, vData.oldestVersion) < 0
      cb({code: 501, msg: '版本过低，请及时更新'})
    else 
      getUpdateSize version, vData, cb
      #cb({code: 600, msg: '您的版本需要更新（3.13M）'})

checkIsOpenServer = (app, cb) ->
  openTime = new Date(app.get('sharedConf').openServerTime)
  now = new Date()
  if new Date() < openTime
    cb({
      code: 501, 
      msg: util.format('%s月%s日%s点开服，敬请期待', openTime.getMonth()+1, openTime.getDate(), openTime.getHours())
    })
  else 
    cb()


update_file_size = {}
getUpdateSize = (version, vData, cb) ->
  if update_file_size[version]
    return cb({code: 600, msg: "您的版本需要更新(#{sizeFormat(update_file_size[version])})"})

  filename = vData.filename
  if versionHandler.versionCompare(version, vData.lastVersion)
    filename = vData.lastFilename

  request.get versionHandler.make_bucket_get_url('GET', 'magpie', filename), (err, res) ->
    try
      size = JSON.parse(require('xml2json').toJson(res.body)).ListBucketResult.Contents.Size
      update_file_size[version] = size
      return cb({code: 600, msg: "您的版本需要更新(#{sizeFormat(update_file_size[version])})"})
    catch error
      cb({code: 600, msg: '您的版本需要新'})

sizeFormat = (size) ->
  size = size/1024
  if size < 1024
    return size.toFixed(1)+'KB'

  size = size/1024
  if size < 1024
    return size.toFixed(1)+'MB'

  size = size/1024
  if size < 1024
    return size.toFixed(1)+'GB'

  return size + 'b'

