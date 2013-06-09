pomelo = require 'pomelo'
User = require '../domain/user'

module.exports = userDao

userDao = 
  getUserInfo: (username, password, cb) ->
    sql = 'select * from User where name = ?'
    args = [username]

    pomelo.app.get('dbclient').query sql, args, (err, res) ->
      if err isnt null
        cb(err, null)
      else
        if !!res and res.length is 1
          rs = res[0]
          rs.uid = rs.id
          cb(null, rs)
        else
          cb(null, {uid: 0, username: username})

  getUserByName: (username, cb) ->
    sql = 'select * from User where name = ?'
    args = [username]

    pomelo.app.get('dbclient').query sql, args, (err, res) ->
      if err isnt null
        cb(err.message, null)
        return

      if !!res and res.length is 1
        rs = res[0]
        user = new USer({id: rs.id, name: rs.name, password: rs.password, from: rs.from})
        cb(null, user)
      else
        cb(' user not exist ', null)

  getUserByName: (uid, cb) ->
    sql = 'select * from User where id = ?'
    args = [uid]

    pomelo.app.get('dbclient').query sql, args, (err, res) ->
      if err isnt null
        cb(err.message, null)
        return
      
      if !!res and res.length is 1
        rs = res[0]
        user = new USer({id: rs.id, name: rs.name, password: rs.password, from: rs.from})
        cb(null, user)
      else
        cb(' user not exist ', null)

  deleteUserByName: (username, cb) ->
    sql = 'delete from User where name = ?'
    args = [username]

    pomelo.app.get('dbclient').delete sql, args, (err, res) ->
      if err isnt null
        cb(err.message, null)
        return

      if !!res and res.affectedRows > 0
        cb(null, true)
      else
        cb(null, false)

  createUser: (username, password, from, cb) ->
    sql = 'insert into User (name, password, `from`, loginCount, lastLoginTime) values(?,?,?,?,?)'
    loginTime = Date.now()
    args = [username, password, from or '', 1, loginTime]

    pomelo.app.get('dbclient').insert sql, args, (err, res) ->
      if err isnt null
        cb({code: err.number, msg: err.message}, null)
      else
        user = new User({id: res.insertId, name: username, password, loginCount: 1, lastLoginTime: res.lastLoginTime})
        cb(null, user)


