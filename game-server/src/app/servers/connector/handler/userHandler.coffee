userDao = require '../../../manager/userDao'
Code = require '../../../../../shared/code'
Resources = require '../../../../../shared/resources'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::register = (msg, session, next) ->
  email = msg.email
  password = msg.password
  
  userDao.createUser email, password, '', (err, user) ->
    if err or not user
      if err and err.code is "ER_DUP_ENTRY"
        next(null, {code: 501, msg: Resources.ERROR.USER_EXISTS})
      else
        next(null, {code: 500, msg: err.msg})
    else
      next(null, {code: 200, uid: user.id})

Handler::login = (msg, session, next) ->
  email = msg.email
  password = msg.password

  userDao.getUserByEmail email, (err, user) ->
    if err or not user
      next(null, {code: 501})
      return
    
    if password isnt user.password
      next(null, {code: 500})
      return
    console.log 'before bind: ', session.id, session.uid, user.id
    session.bind(user.id)
    session.set('playername', user.name)
    session.on('close', onUserLeave)
    console.log 'login: ', session
    next(null, {code: 200, uid: user.id})

Handler::setName = (msg, session, next) ->
  username = msg.name
  uid = msg.uid or session.uid

  userDao.updateUser uid, {name: username}, (err, user) ->
    if err or not user
      next(null, {code: 501, msg: err.msg})
      return 

    next(null, {code: 200})

onUserLeave = (session, reason) ->
  if not session or not session.uid
    return
