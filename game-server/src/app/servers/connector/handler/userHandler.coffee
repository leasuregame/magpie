Code = require '../../../../../shared/code'
Resources = require '../../../../../shared/resources'
async = require 'async'
dao = require('pomelo').app.get('dao')
logger = require('pomelo-logger').getLogger(__filename)

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
  player = null;
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
      session.bind uid, cb

    (cb) ->
      dao.player.fetchOne where: {userId: uid}, (err, res) ->
        if err and not res
          logger.error 'faild to get player' + err
          return cb(null, null)

        cb(null, res.id)

    (playerId, cb) ->
      if not playerId
        return cb(null, null)

      dao.player.getPlayerInfo where: {id:playerId}, (err, player) ->
        if err and not player
          logger.error 'faild to get player' + err
          return cb(null, null)
        
        cb(null, player)

    (_player, cb) ->
      player = _player
      if player?
        session.set('playerId', player.id)
        session.set('playerName', player.name)
        session.set('areaId', player.areaId)
        
      session.on('close', onUserLeave)
      session.pushAll cb
  ], (err) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})
    
    next(null, {code: 200, msg: {user: {id: uid}, player: player?.toJson()}})

onUserLeave = (session, reason) ->
  if not session or not session.uid
    return