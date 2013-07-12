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
    dao.user.createUser {account: account, password: password}, (err, user) ->
      if err or not user
        if err and err.code is "ER_DUP_ENTRY"
          next(null, {code: 501, msg: Resources.ERROR.USER_EXISTS})
        else
          next(null, {code: 500, msg: err.msg})
      else
        next(null, {code: 200, uid: user.id})

Handler::login = (msg, session, next) ->
  account = msg.account
  password = msg.password

  uid = null;
  async.waterfall [
    (cb) ->
      dao.user.getUserByAccount account, cb
    
    (user, cb) ->
      if password isnt user.password
        cb({code: 501, msg: '密码不正确'})
      else
        cb(null, user.id)

    (userId, cb) ->
      uid = userId
      dao.player.getPlayerInfo uid, (err, player) ->
        if err and not player
          return cb(null, null)
        
        cb(null, player)

  ], (err, player) ->
    if err
      return next(null, {code: 501, msg: err.msg})

    session.bind(uid)
    if !!player
      session.set('playerId', player.id)
      session.set('playerName', player.name)
      session.set('areaId', player.areaId)

    session.on('close', onUserLeave)
    next(null, {code: 200, msg: {user: {id: uid}, player: player?.toJson()}})

onUserLeave = (session, reason) ->
  if not session or not session.uid
    return
