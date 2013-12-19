Code = require '../../../../../shared/code'
Resources = require '../../../../../shared/resources'
app = require('pomelo').app
dao = app.get('dao')

accountMap = {}

module.exports = 
  auth: (account, password, areaId, frontendId, cb) ->
    dao.user.fetchOne {
      where: account: account
      sync: true
    }, (err, user) ->
      if err
        return cb(err)

      if password isnt user.password
        return cb({code: 501, msg: '密码不正确'})

      if accountMap[account] and areaId is accountMap[account].areaId
        bss = app.get('backendSessionService')
        bss.kickByUid accountMap[account].serverId, user.id + '*' + areaId, (err, res) -> 
          console.log 'backendSessionService kick by uid: ', err, res

      user.lastLoginArea = areaId
      user.lastLoginTime = Date.now()
      user.loginCount += 1
      user.save()

      accountMap[account] = {areaId: areaId, serverId: frontendId}
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