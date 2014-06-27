async = require 'async'
utility = require '../../../common/utility'
logger = require('pomelo-logger').getLogger(__filename)
_ = require 'underscore'
fs = require 'fs'
path = require 'path'
util = require 'util'
versionHandler = require '../../../../../shared/version_helper'
request = require 'request'
appUtil = require '../../../util/appUtil'

EMAIL_REG = /^(?=\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$).{6,50}$/
ACCOUNT_REG = /[\w+]{6,50}$/
PASSWORD_REG = /^[a-zA-Z0-9]{6,20}$/
EMPTY_SPACE_REG = /\s+/g

PLATFORM = 
  APPSTORE: 'AppStore'
  TONGBU: 'TB'
  PP: 'PP'
  YY: 'YY'
  91: 'S91'
  UC: 'UC'

add_account_prefix = (account) ->
  'app-'+account

del_account_prefix = (account) ->
  account.slice(4)

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
    account: add_account_prefix(msg.account)
    password: msg.password
  }, (err, user) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    next(null, {code: 200, msg: {userId: user.id}})

Handler::login = (msg, session, next) ->
  msg.account = add_account_prefix(msg.account)

  doLogin PLATFORM.APPSTORE, @app, msg, session, 'app', (err, res) ->
    if not err and res.code is 200
      res.msg.user.account = del_account_prefix(res.msg.user.account)
      next(null, res)
    else
      next(err, res)

Handler::loginTB = (msg, session, next) ->
  doLogin(PLATFORM.TONGBU, @app, msg, session, 'tb', next)

Handler::loginPP = (msg, session, next) ->
  doLogin(PLATFORM.PP, @app, msg, session, 'pp', next)

Handler::loginYY = (msg, session, next) ->
  doLogin(PLATFORM.YY, @app, msg, session, 'yy', next)

Handler::login91 = (msg, session, next) ->
  doLogin(PLATFORM['91'], @app, msg, session, '91', next)

doLogin  = (type, app, msg, session, platform, next) ->
  areaId = msg.areaId
  user = null
  player = null
  uid = null

  if _.isUndefined(areaId) or _.isNull(areaId)
    return next(null, {code: 501, msg: '请选择一个区登陆'})

  async.waterfall [
    (cb) ->
      checkIsOpenServer app, cb

    (cb) ->
      checkAreaServerStatus app, areaId, cb
      
    (cb) =>
      args = authParams(type, msg, app)
      args.sid = session.id
      app.rpc.auth.authRemote.authorize session, args, type, (err, u, isValid) ->
        if err and err.code is 404
          cb({code: 501, msg: '用户不存在'})
        else if err
          cb(err)
        else 
          cb(null, u)

    (u, cb) ->
      ### 检查是否最新版本 ###
      checkVersion app, msg, platform, (err) ->
        if err
          cb(err)
        else 
          cb(null, u)

    (u, cb) =>
      user = u
      # check whether has create player in the login area
      app.rpc.area.playerRemote.getPlayerByUserId session, {
        areaId: areaId,
        userId: user.id, 
        serverId: app.getServerId()
      }, (err, res) ->
        if err
          logger.warn 'fail to get player by user id', err
        player = res
        cb()

    (cb) =>
      uid = user.id + '*' + areaId
      session.set('areaId', areaId)
      session.set('userId', user.id)
      session.set('platform', platform)
      session.bind(uid, cb)
    (cb) =>
      if player?
        session.set('playerId', player.id)
        session.set('playerName', player.name)
        session.on('closed', onUserLeave.bind(null, app))
      session.pushAll cb
  ], (err) ->
    if err
      appUtil.errHandler(err)
      return next(null, {code: err.code or 500, msg: err.msg or err.message or err})

    ### 只有每个帐号的第一个角色才会进行新手教程，教程结束后不返回teachingStep ###
    if user?.roles.length > 1 or player?.teachingStep >= 17
      delete player.teachingStep if player?

    # 记录该登录操作, 是否应该放到filter?
    app.rpc.area.playerRecordRemote.createLoginRecord session, player, (err) ->
      appUtil.errHandler(err) if err
    next(null, {code: 200, msg: {user: user, player: player}})

onUserLeave = (app, session, reason) ->
  if not session or not session.uid
    return
  async.waterfall [
    (cb) ->
      app.rpc.area.playerRecordRemote.createLogoutRecord session, session.get('playerId'), cb

    (res, cb) ->
      app.rpc.area.playerRemote.playerLeave session, session.get('playerId'), session.uid, app.getServerId(), cb
  ], (err) ->
    appUtil.errHandler(err) if err


authParams = (type, msg, app) ->
  keyMap = 
    AppStore: ['account', 'password', 'areaId']
    TB: ['nickName', 'userId', 'sessionId', 'areaId']
    PP: ['token', 'areaId']
    YY: ['signid', 'account', 'time', 'appid', 'serverid', 'areaId', 'userName']
    S91: ['sessionid', 'uin', 'appid', 'areaId']
  
  args  = {}
  for k in keyMap[type]
    args[k] = msg[k] if msg[k]?

  args.frontendId = app.getServerId()
  args

checkVersion = (app, msg, platform, cb) ->
  version = msg.version or '1.0.0'
  vData = app.get('versionConf')?[platform]
  if not vData
    return cb({code: 501, msg: "找不到#{platform}的版本信息"})

  if msg.appVersion? and versionHandler.versionCompare(msg.appVersion, vData.forceUpdateVersion) < 0
    cb({code: 501, msg: '版本过低，请到发行商更新游戏'})

  if versionHandler.versionCompare(version, vData.version) >= 0
    cb()
  else
    if vData.version is vData.lastVersion or versionHandler.versionCompare(version, vData.oldestVersion) < 0
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

checkAreaServerStatus = (app, areaId, cb) ->
  areaInfo = app.get('areaConfig')
  currentArea = null
  for a in areaInfo
    if parseInt(a.areaId) is parseInt(areaId)
      currentArea = a
  if currentArea and parseInt(currentArea.status) is 40
    cb({code: 501, msg: '服务器正在维护当中，请耐心等待！'})
  else 
    cb()

update_file_size = {}
getUpdateSize = (version, vData, cb) ->
  filename = vData.filename
  if versionHandler.versionCompare(version, vData.lastVersion) < 0
    filename = vData.lastFilename

  key = vData.version+filename

  if update_file_size[key]
    return cb({code: 600, msg: "您的版本需要更新(#{update_file_size[key]})"})

  request.get versionHandler.make_bucket_get_url('GET', 'magpie', filename), (err, res) ->
    try
      size = JSON.parse(require('xml2json').toJson(res.body)).ListBucketResult.Contents.Size
      update_file_size[key] = sizeFormat size
      return cb({code: 600, msg: "您的版本需要更新(#{update_file_size[key]})"})
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

  return size + 'GB'

