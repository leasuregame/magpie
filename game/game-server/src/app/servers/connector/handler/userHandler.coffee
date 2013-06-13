userDao = require '../../../manager/userDao'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::register = (msg, session, next) ->
  email = msg.email
  password = msg.password
  
  userDao.createUser email, password, '', (err, user) ->
    if err or not user
      if err and err.code is "ER_DUP_ENTRY"
        next(null, {code: 501, msg: err.msg})
      else
        next(null, {code: 500, msg: err.msg})
    else
      next(null, {code: 200, uid: user.id})

Handler::login = (msg, session, next) ->  
  email = msg.email
  password = msg.password

  userDao.getUserByEmail email, (err, user) ->
    if err or not res
      next(null, {code: 501})
      return
    
    if password isnt user.password
      next(null, {code: 500})
      return

    next(null, {code: 200, uid: user.id})

Handler::setName = (msg, session, next) ->
  username = msg.username
  uid = session.uid

  userDao.updateUser uid, {name: username}, (err, res) ->
    if err or not res
      next(null, {code: 5001})
      return 

    next(null, {code: 200})


