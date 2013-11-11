Code = require '../../../../../shared/code'
Resources = require '../../../../../shared/resources'
app = require('pomelo').app
dao = app.get('dao')

module.exports = 
  auth: (account, password, areaId, cb) ->
    dao.user.fetchOne {
      where: account: account
      sync: true
    }, (err, user) ->
      if err
        return cb(err)

      if password isnt user.password
        return cb({code: 501, msg: '密码不正确'})

      user.lastLoginArea = areaId
      user.lastLoginTime = Date.now()
      user.loginCount += 1
      user.save()
      cb(null, user.toJson())

  register: (args, cb) ->
    account = args.account
    password = args.password

    if not account or account is '' or not password or password is ''
      return cb({code: 501, msg: Resources.ERROR.INVALID_PARAMS})
    
    dao.user.create data: {account: account, password: password}, (err, user) ->
      if err or not user
        if err and err.code is "ER_DUP_ENTRY" 
          return cb({code: 501, msg: Resources.ERROR.USER_EXSISTS})
        else
          return cb({code: 500, msg: err.msg})
      
      cb(null, user.toJson())