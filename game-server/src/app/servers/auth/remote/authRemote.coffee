Code = require '../../../../../shared/code'
Resources = require '../../../../../shared/resources'
Cache = require '../../../common/cache'
app = require('pomelo').app
dao = app.get('dao')
request = require 'request'
qs = require 'querystring'
async = require 'async'
_string = require 'underscore.string'
fs = require 'fs'
path = require 'path'
logger = require('pomelo-logger').getLogger(__filename)

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
        console.log checkWhiteList(user)
        if checkWhiteList(user)
          cb(null, user.toJson())
        else
          cb({code: 501, msg: '服务器维护当中，请耐心等待！'})

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

        url = "#{process.env.LOGIN_CHECK_URL_TONGBU}?k=#{sessionId}"
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

        fetchUserInfoOrCreate "tb-#{nickName}", null, done
      (user, done) ->
        checkDuplicatedLogin areaId, frontendId, user, sid, done
    ], (err, user) ->
      if err
        logger.error('tb login error:', err)
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

        requestUrl = process.env.LOGIN_CHECK_URL_PP
        request.post requestUrl, {body: token}, (err, res, body) -> 
          if err
            logger.error(err)
            return done({code: 501, msg: '登陆失败，请重新登陆'})

          #console.log(err, body)
          result = parseBody body
          if parseInt(result.status) is 0
            tokenMap.put token, result, 1000 * 60 * 60
            done(null, result)
          else
            done(ppErrorMessage(result))

      (result, done) ->
        userName = result.username
        uid = result.userid

        fetchUserInfoOrCreate "pp-#{userName}", null, done
      (user, done) ->
        checkDuplicatedLogin areaId, frontendId, user, sid, done
    ], (err, user) ->
      if err
        logger.error('pp login error: ', err)
        return cb(err)
      cb(null, user?.toJson())

  @YY: (args, cb) ->
    text = "#{process.env.APP_KEY_YY}#{args.appid}#{args.account}#{args.time}"
    if args.signid is md5(text).toUpperCase()
      
      fetchUserInfoOrCreate "yy-#{args.account}", null, {name: args.userName}, (err, user) ->
        if err
          return cb(err)

        checkDuplicatedLogin args.areaId, args.frontendId, user, args.sid, (err, user) ->
          cb(err, user?.toJson())
    else
      cb({code: 501, msg: '登陆失败，请重新登陆'})

  @S91: (args, cb) ->
    async.waterfall [
      (done) ->
        if validSessionId(args.uin, args.sessionid)
          return done(null, false)
        
        query = {
          AppId: args.appid
          Act: 4
          Uin: args.uin
          SessionId: args.sessionid
          Sign: md5("#{args.appid}4#{args.uin}#{args.sessionid}#{process.env.APP_KEY_91}")
        }
        requestUrl = "#{process.env.LOGIN_CHECK_URL_91}?#{qs.stringify(query)}"
        request.get requestUrl, (err, res, body) ->
          if (err)
            return done(null, false)

          result = JSON.parse body
          if parseInt(result.ErrorCode) is 1
            sessionIdMap.put args.uin, args.sessionid, 1000 * 60 * 60
            done(null, true)
          else 
            done(s91ErrorMessage(result))
      (result, done) ->
        fetchUserInfoOrCreate "91-#{args.uin}", null, done
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
    result[_string.trim(k, '"')] = _string.trim(v, '"')
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


fetchUserInfoOrCreate = (account, id, data, done) ->
  if not done
    done = data 
    data = {}

  where = account: account
  where.id = id if id
  _.extend data, where

  dao.user.fetchOne {
    where: where
    sync: true
  }, (err, user) ->
    if err and err.code is 404
      dao.user.create
        data: data
      , (e, u) ->
        if e and not u
          logger.error('can not create user: ', id, account)
          done({code: 501, msg: '登录失败，请重新登录'})
        else 
          if checkWhiteList(u)
            done(null, u)
          else
            done({code: 501, msg: '服务器维护当中，请耐心等待！'})          

    else if not err and user
      if checkWhiteList(user)
        done(null, user)
      else
        done({code: 501, msg: '服务器维护当中，请耐心等待！'})
    else 
      done({code: 501, msg: '登录失败，请重新登录'})


checkWhiteList = (user) ->
  sharedConf = app.get('sharedConf')
  if !!sharedConf.useWhiteList
    wpath = path.join app.getBase(), '..', 'shared', 'whiteList.json'
    return false if !fs.existsSync(wpath)
    try
      list = JSON.parse fs.readFileSync(wpath)
      console.log list, user.id, list.indexOf(user.id), list.indexOf(user.id) > -1
      return list.indexOf(user.id) > -1
    catch e
      logger.error(e)
      return false
  else 
    return true

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

  if accountMap[user.id] #and areaId is accountMap[user.id].areaId and sid isnt accountMap[user.id].sid
    bss = app.get('backendSessionService')

    bss.kickByUid accountMap[user.id].serverId, user.id + '*' + accountMap[user.id].areaId, (err, res) -> 
      accountMap[user.id] = {areaId: areaId, serverId: frontendId, sid: sid}
      done(null, user)
  else
    accountMap[user.id] = {areaId: areaId, serverId: frontendId, sid: sid}
    done(null, user)