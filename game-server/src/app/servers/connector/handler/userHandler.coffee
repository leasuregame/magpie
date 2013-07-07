Code = require '../../../../../shared/code'
Resources = require '../../../../../shared/resources'

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

  dao.user.getUserByAccount account, (err, user) =>
    if err or not user
      next(null, {code: 501})
      return
    
    if password isnt user.password
      next(null, {code: 500})
      return

    session.bind(user.id)
    session.on('close', onUserLeave)

    dao.player.getPlayerByUserId user.id, (err, player) ->
      if err or not player
        return next(null, {code: 200, uid: user.id, pid: null})

      session.set('playerId', player.id)
      session.set('playerName', player.name)

      next(null, {code: 200, uid: user.id, pid: player.id})

onUserLeave = (session, reason) ->
  if not session or not session.uid
    return
