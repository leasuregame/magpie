Code = require '../../../../../shared/code'
Resources = require '../../../../../shared/resources'
Cache = require '../../../common/cache'
app = require('pomelo').app
dao = app.get('dao')
request = require 'request'
async = require 'async'
_string = require 'underscore.string'
logger = require('pomelo-logger').getLogger(__filename)

CHECK_URL = 'http://tgi.tongbu.com/checkv2.aspx'
APP_KEY_YY = 'OpYnjFNAqwKgoCqpfnrCPtbQdbUGPhgf'
APP_ID_YY = 'IYYDS'

APP_KEY_91 = ''

accountMap = {}
sessionIdMap = new Cache()
tokenMap = new Cache()

module.exports = (app) ->
  new Remote(app)

Remote = (@app) ->

Remote::register = (args, cb) ->
  account = args.account
  password = args.password
  
  dao.user.create data: {account: account, password: password}, (err, user) ->
    if err or not user
      if err and err.code is "ER_DUP_ENTRY" 
        return cb({code: 501, msg: '用户已经存在'})
      else
        return cb({code: 500, msg: err.msg})
    
    cb(null, user.toJson())

Remote::authorize = (args, type, cb) ->
  cb = type if _.isFunction(type)

  return cb {code: 501, msg: '授权失败'} if not Authorize[type]

  Authorize[type](args, cb)

class Authorize
  @AppStore: (args, cb) ->
    account = args.account
    password = args.password
    areaId = args.areaId
    frontendId = args.frontendId
    sid = args.sid

    dao.user.fetchOne {
      where: account: account
      sync: true
    }, (err, user) ->
      if err
        return cb(err)

      if password isnt user.password
        return cb({code: 501, msg: '密码不正确'})

      
      checkDuplicatedLogin areaId, frontendId, user, sid, (err, user)->
        cb(null, user.toJson())

  @TB: (args, cb) ->
    sessionId = args.sessionId
    userId = parseInt args.userId
    nickName = args.nickName
    areaId = args.areaId
    frontendId = args.frontendId
    sid = args.sid

    async.waterfall [
      (done) ->
        if validSessionId(userId, sessionId)
          return done(null, true)

        url = "#{CHECK_URL}?k=#{sessionId}"
        request.get url, (err, res, body) ->
          if err
            logger.error('faild to check tongbu session id', sessionId, userId)
            logger.error(err, res, body)
            return done(null, false)

          statusCode = parseInt body
          if statusCode > 0 and statusCode is userId
            ### 记住已登录用户和session ###
            sessionIdMap.put userId, sessionId, 1000 * 60 * 60
            done(null, true)
          else if statusCode is -1
            done({code: 501, msg: '会话无效'})
          else
            done(null, false)

      (isValid, done) ->
        if not isValid
          return done({code: 501, msg: '登录失败，请重新登录'})

        fetchUserInfoOrCreate nickName, userId, done
      (user, done) ->
        checkDuplicatedLogin areaId, frontendId, user, sid, done
    ], (err, user) ->
      if errP
        logger.error(err)
        return cb(err)

      cb(null, user?.toJson())

  @PP: (args, cb) ->
    token = args.token
    areaId = args.areaId
    frontendId = args.frontendId
    sid = args.sid

    async.waterfall [
      (done) ->
        if validToken(token)
          return done(null, tokenMap.get(token))

        requestUrl = "http://passport_i.25pp.com:8080/index?tunnel-command=2852126756"
        request.post requestUrl, {body: token}, (err, res, body) -> 
          if err
            logger.error(err)
            return done({code: 501, msg: '登陆失败，请重新登陆'})

          console.log(err, body)
          result = parseBody body
          if parseInt(result.status) is 0
            tokenMap.put token, result, 1000 * 60 * 60
            done(null, result)
          else
            done(ppErrorMessage(result))

      (result, done) ->
        userName = result.username
        uid = result.userid

        fetchUserInfoOrCreate userName, uid, done
      (user, done) ->
        checkDuplicatedLogin areaId, frontendId, user, sid, done
    ], (err, user) ->
      if err
        logger.error(err)
        return cb(err)
      cb(null, user?.toJson())

  @YY: (args, cb) ->
    console.log args
    text = "#{APP_KEY_YY}#{args.appid}#{args.account}#{args.time}"
    console.log 'text: ', text
    if args.signid is md5(text).toUpperCase()
      
      fetchUserInfoOrCreate args.account, null, (err, user) ->
        if err
          return cb(err)

        checkDuplicatedLogin args.areaId, args.frontendId, user, args.sid, (err, user) ->
          cb(err, user?.toJson())
    else
      cb({code: 501, msg: '登陆失败，请重新登陆'})

  @S91: (args, cb) ->
    console.log args

    aysnc.waterfall [
      (done) ->
        if validSessionId(args.uin, args.sessionid)
          return done(null, false)
        
        requestUrl = 'http://service.sj.91.com/usercenter/AP.aspx'
        request.get requestUrl, {
          AppId: args.appid
          Act: 4
          Uin: args.uin
          SessionId: args.sessionid
          Sign: md5("#{args.appid}4#{args.uin}#{args.sessionid}#{APP_KEY_91}")
        }, (err, res, body) ->
          console.log err, body, body.ErrorCode
          if (err)
            return done(null, false)

          result = body
          if result.ErrorCode is 1
            done(null, true)
          else 
            done(s91ErrorMessage(result))
      (result, done) ->
        fetchUserInfoOrCreate args.uin, null, done
      (user, done) ->
        checkDuplicatedLogin args.areaId, args.frontendId, user, args.sid, done
    ], (err, user) ->
      if err
        return cb(err)
      cb(null, user?.toJson())

md5 = (text) ->
  hash = require('crypto').createHash('md5')
  hash.update(text).digest('hex')

parseBody = (body) ->
  result = {}
  body.split(',').forEach (i) ->
    [k, v] = i.split(':')
    result[_string.trim(k, '"')] = _.string.trim(v, '"')
  result

s91ErrorMessage = (result) ->
  errorCode = 
    0: '失败'
    1: '成功'
    2: 'AppId无效'
    3: 'Act无效'
    4: '参数无效'
    5: 'Sign无效'
    11: 'SessionId无效'

  code: 501, msg: errorCode[result.ErrorCode] or result.ErrorDesc

ppErrorMessage = (result) ->
  errorCode = 
    'e0000000': '用户名不符合规则' 
    'e0000001': '用户名不存在'
    'e0000006': '无效的操作' 
    'e000000e': '该正式账号已经存在' 
    'e000001e': '密码校验错误'
    'e0000102': '密码校验错误' 
    'e00000ba': '该用户被禁止登录'
    'e00000db': '数据库错误' 
    'e0000101': '会话超时'
    'e0000b0d': '该临时账号已经绑定过正式账号, 无法再绑定'

  code: 501, msg: errorCode[result.status.toString(16)] or '无法识别的状态'


fetchUserInfoOrCreate = (account, id, done) ->
  userData = account: account
  userData.id = id if id
  dao.user.fetchOne {
    where: userData
    sync: true
  }, (err, user) ->
    if err and err.code is 404
      dao.user.create
        data: userData
      , (e, u) ->
        if e and not u
          logger.error('can not create user: ', id, account)
          done({code: 501, msg: '登录失败，请重新登录'})
        else 
          done(null, u)
    else if not err and user
      done(null, user)
    else 
      done({code: 501, msg: '登录失败，请重新登录'})

validToken = (token) ->
  cacheToeken = tokenMap.get(token)
  if cacheToeken
    tokenMap.put token, cacheToeken, 1000 * 60 * 60
    return true
  else
    return false

validSessionId = (uid, sid) ->
  cacheSid = sessionIdMap.get(uid)
  if cacheSid? and cacheSid is sid
    ### 重置已登录用户session有效时间 ###
    sessionIdMap.put uid, sid, 1000 * 60 * 60
    return true
  else
    return false

checkDuplicatedLogin = (areaId, frontendId, user, sid, done) ->
  user.lastLoginArea = areaId
  user.lastLoginTime = Date.now()
  user.loginCount += 1
  user.save()

  if accountMap[user.id] and areaId is accountMap[user.id].areaId and sid isnt accountMap[user.id].sid
    bss = app.get('backendSessionService')
    
    bss.kickByUid accountMap[user.id].serverId, user.id + '*' + areaId, (err, res) -> 
      accountMap[user.id] = {areaId: areaId, serverId: frontendId, sid: sid}
      done(null, user)
  else
    accountMap[user.id] = {areaId: areaId, serverId: frontendId, sid: sid}
    done(null, user)