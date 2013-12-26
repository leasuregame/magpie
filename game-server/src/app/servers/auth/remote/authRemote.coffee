Code = require '../../../../../shared/code'
Resources = require '../../../../../shared/resources'
app = require('pomelo').app
dao = app.get('dao')
request = require 'request'
async = require 'async'
logger = require('pomelo-logger').getLogger(__filename)

CHECK_URL = 'http://tgi.tongbu.com/checkv2.aspx'
accountMap = {}

module.exports = 
  auth: (args, cb) ->
    account = args.account
    password = args.password
    areaId = args.areaId
    frontendId = args.frontendId

    dao.user.fetchOne {
      where: account: account
      sync: true
    }, (err, user) ->
      if err
        return cb(err)

      if password isnt user.password
        return cb({code: 501, msg: '密码不正确'})

      
      checkDuplicatedLogin(account, areaId, frontendId, user)
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

    async.waterfall [
      (done) ->
        url = "#{CHECK_URL}?k=#{sessionId}"
        request.get url, (err, res, body) ->
          if err
            logger.error('faild to check tongbu session id', sessionId, userId)

          console.log err, body, userId
          statusCode = parseInt body
          if statusCode > 0 and statusCode is userId
            done(null, true)
          else if statusCode is -1
            done({code: 501, msg: '会话无效'})
          else
            done(null, false)

      (isValid, done) ->
        if not isValid
          return done({code: 501, msg: '登陆失败，请重新登陆'})

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
                done()
              else 
                done(null, u)
          else if not err and user
            done(null, user)
          else 
            done()      
    ], (err, user) ->
      if err
        logger.error(err)
        return cb(err)

      checkDuplicatedLogin(nickName, areaId, frontendId, user)
      cb(null, user?.toJson())

checkDuplicatedLogin = (account, areaId, frontendId, user) ->
  if accountMap[account] and areaId is accountMap[account].areaId
    bss = app.get('backendSessionService')
    bss.kickByUid accountMap[account].serverId, user.id + '*' + areaId, (err, res) -> 
      console.log 'backendSessionService kick by uid: ', err, res

  user.lastLoginArea = areaId
  user.lastLoginTime = Date.now()
  user.loginCount += 1
  user.save()
  accountMap[account] = {areaId: areaId, serverId: frontendId}
