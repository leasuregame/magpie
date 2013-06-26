pomelo = require 'pomelo'
User = require '../../../domain/user'
logger = require('pomelo-logger').getLogger(__filename)

userDao =
  getUserByAccount: (accout, cb) ->
    @_getUserBy('account', accout, cb)

  getUserByName: (username, cb) ->
    @_getUserBy('name', username, cb)

  getUserById: (uid, cb) ->
    @_getUserBy('id', uid, cb)

  _getUserBy: (field, value, cb) ->
    sql = "select * from user where #{field} = ?"
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

  deleteUserById: (id, cb) ->
    @_deleteUserBy 'id', id, cb

  deleteUserByName: (username, cb) ->
    @_deleteUserBy 'name', username, cb

  deleteUserByAccount: (account, cb) ->
    @_deleteUserBy 'account', account, cb

  _deleteUserBy: (field, value, cb) ->
    sql = "delete from user where #{field} = ?"
    args = [value]

    pomelo.app.get('dbclient').delete sql, args, (err, res) ->
      if err isnt null
        cb(err.message, null)
        return

      if !!res and res.affectedRows > 0
        cb(null, true)
      else
        cb(null, false)

  createUser: (account, password, from, cb) ->
    sql = 'insert into user (account, password, login_count, create_time, last_login_time, last_login_device) values(?,?,?,?,?,?)'
    now = Date.now()
    args = [account, password, 1, now, now, from or '']

    pomelo.app.get('dbclient').insert sql, args, (err, res) ->
      if err isnt null
        logger.error ' [Create user faild] ', err.stack
        cb({code: err.code, msg: err.message}, null)
      else
        user = new User({id: res.insertId, account: account, password, loginCount: 1, lastLoginTime: res.lastLoginTime})
        cb(null, user)

  updateUser: (uid, fields, cb) ->
    if uid? and fields?
      setFields = ''
      for f, v of fields
        setFields += "SET #{f}='#{v}',"

      sql = "update user #{setFields.slice(0, -1)} where id = ?"
      args = [uid]

      pomelo.app.get('dbclient').update sql, args, (err, res) ->
        if err isnt null
          cb({code: err.number, msg: err.message}, null)
        else
          cb(null, res)

exports = module.exports = userDao