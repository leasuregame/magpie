Code = require '../../../../../shared/code'
Resources = require '../../../../../shared/resources'
async = require 'async'
dao = require('pomelo').app.get('dao')

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::register = (msg, session, next) ->
  account = msg.account
  password = msg.password
  
  if not account or account is '' or not password or password is ''
    next(null, {code: 501, msg: Resources.ERROR.INVALID_PARAMS})
  else
    dao.user.create data: {account: account, password: password}, (err, user) ->
      if err or not user
        if err and err.code is "ER_DUP_ENTRY"
          next(null, {code: 501, msg: Resources.ERROR.USER_EXISTS})
        else
          next(null, {code: 500, msg: err.msg})
      else
        next(null, {code: 200, msg: {userId: user.id}})

Handler::login = (msg, session, next) ->
  account = msg.account
  password = msg.password

  uid = null;
  async.waterfall [
    (cb) ->
      dao.user.fetchOne where: {account:account}, cb
    
    (user, cb) ->
      if password isnt user.password
        cb({code: 501, msg: '密码不正确'})
      else
        cb(null, user.id)

    (userId, cb) ->
      uid = userId
      dao.player.fetchOne where: {userId: uid}, (err, res) ->
        if err and not res
          console.log err
          return cb(null, null)

        cb(null, res.id)

    (playerId, cb) ->
      if not playerId
        return cb(null, null)

      dao.player.getPlayerInfo where: {id:playerId}, (err, player) ->
        if err and not player
          console.log err
          return cb(null, null)
        
        cb(null, player)

  ], (err, _player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    session.bind(uid)
    if _player?
      session.set('playerId', _player.id)
      session.set('playerName', _player.name)
      session.set('areaId', _player.areaId)

    session.on('close', onUserLeave)
    next(null, {code: 200, msg: {user: {id: uid}, player: _player?.toJson()}})

onUserLeave = (session, reason) ->
  if not session or not session.uid
    return