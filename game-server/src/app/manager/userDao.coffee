pomelo = require 'pomelo'
User = require '../domain/user'
logger = require('pomelo-logger').getLogger(__filename)

userDao =
  getUserByEmail: (email, cb) ->
    @_getUserBy('email', email, cb)

  getUserByName: (username, cb) ->
    @_getUserBy('name', username, cb)

  getUserById: (uid, cb) ->
    @_getUserBy('id', uid, cb)

  _getUserBy: (field, value, cb) ->
    sql = "select * from User where #{field} = ?"
    args = [value]

    pomelo.app.get('dbclient').query sql, args, (err, res) ->
      if err isnt null
        logger.error 'Get user by #{field} faild!', err.stack
        cb(err.message, null)
        return

      if !!res and res.length is 1
        rs = res[0]
        user = new User({id: rs.id, name: rs.name, password: rs.password, from: rs.from})
        cb(null, user)
      else
        cb(' User not exist ', null)

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

  createUser: (email, password, from, cb) ->
    console.log 'creating user...', email, password
    sql = 'insert into User (email, password, `from`, loginCount, lastLoginTime) values(?,?,?,?,?)'
    loginTime = Date.now()
    args = [email, password, from or '', 1, loginTime]

    pomelo.app.get('dbclient').insert sql, args, (err, res) ->
      if err isnt null
        logger.error ' - Create user faild! - ', err.stack
        cb({code: err.code, msg: err.message}, null)
      else
        user = new User({id: res.insertId, email: email, password, loginCount: 1, lastLoginTime: res.lastLoginTime})
        cb(null, user)

  updateUser: (uid, fields, cb) ->
    if uid? and fields?
      setFields = ''
      for f, v of fields
        setFields += "SET #{f}='#{v}',"

      sql = "update User #{setFields.slice(0, -1)} where id = ?"
      args = [uid]

      pomelo.app.get('dbclient').update sql, args, (err, res) ->
        if err isnt null
          cb({code: err.number, msg: err.message}, null)
        else
          cb(null, res)

exports = module.exports = userDao