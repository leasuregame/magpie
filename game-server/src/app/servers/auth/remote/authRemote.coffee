Code = require '../../../../../shared/code'
Resources = require '../../../../../shared/resources'
Cache = require '../../../common/cache'
app = require('pomelo').app
dao = app.get('dao')
request = require 'request'
async = require 'async'
logger = require('pomelo-logger').getLogger(__filename)

CHECK_URL = 'http://tgi.tongbu.com/checkv2.aspx'
accountMap = {}
sessionIdMap = new Cache()

module.exports = 
  auth: (args, cb) ->
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

  register: (args, cb) ->
    account = args.account
    password = args.password
    
    dao.user.create data: {account: account, password: password}, (err, user) ->
      if err or not user
        if err and err.code is "ER_DUP_ENTRY" 
          return cb({code: 501, msg: '用户已经存在'})
        else
          return cb({code: 500, msg: err.msg})
      
      cb(null, user.toJson())

  checkSession: (args, cb) ->
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

        dao.user.fetchOne {
          where: id: userId, account: nickName
          sync: true
        }, (err, user) ->
          if err and err.code is 404
            dao.user.create {
              data: {
                id: userId,
                account: nickName
              }
            }, (e, u) ->
              if e and not u
                logger.error('can not create user: ', userId, nickName)
                done({code: 501, msg: '登录失败，请重新登录'})
              else 
                done(null, u)
          else if not err and user
            done(null, user)
          else 
            done({code: 501, msg: '登录失败，请重新登录'})
      (user, done) ->
        checkDuplicatedLogin areaId, frontendId, user, sid, done
    ], (err, user) ->
      if err
        logger.error(err)
        return cb(err)

      cb(null, user?.toJson())

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