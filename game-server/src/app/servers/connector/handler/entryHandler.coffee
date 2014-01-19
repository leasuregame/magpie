
_ = require 'underscore'
async = require 'async'
dao = require('pomelo').app.get('dao')
areas = require '../../../../config/area.json'

logger = require('pomelo-logger').getLogger(__filename)

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::entry = (msg, session, next) ->
  account = msg.account
  areaId = msg.areaId
  user = null
  player = null
  async.waterfall [
    (cb) ->
      dao.user.fetchOne where: acount: acount, (err, res) ->
        if err or not res
          dao.user.create data: {
            acount: acount,
            password: ''
          }, (err, user) ->
            if err
              return cb(err)

            cb(null, user)

        cb(null, res)

    (res, cb) ->
      user = res
      if _.contains user.roles, areaId
        @app.rpc.area.playerRemote.getPlayerByUserId session, {
          areaId: areaId,
          userId: user.id,
          serverId: @app.getServerId()
        }, (err, res) ->
          if err
            logger.error 'fail to get player by user id', err

          player = res
          cb(null, user.id)
      else
        cb(null, user.id)

      
    (userId, cb) ->
      session.bind userId, cb

    (cb) =>
      session.set('areaId', areaId)
      if player?
        session.set('playerId', player.id)
        session.set('playerName', player.name)

      session.on('close', onUserLeave.bind(null, @app))
      session.pushAll cb
    ], (err) ->
      if err
        logger.error 'fail to login: ' + err
        return next(null, {code: err.code or 500, msg: err.msg or err})

      user.lastLoginArea = areaId
      user.save()
      next(null, {code: 200, msg: {user: user?.toJson(), player: player}})

Handler::entryForGM = (msg,session,next)->
  areaId = msg.areaId || null
  async.waterfall [
    (cb)->
      if not areaId
        cb({code:404,msg:'找不到服务器'})

      return cb(null,areaId) for area in areas when areaId is area.id

      cb({code:404,msg:'找不到服务器'})

    (areaId,cb)->
      session.set('areaId', areaId)
      session.pushAll cb

  ],(err)->
    if err
      return next(null,{code:err.code or 500,msg:err.msg or err})

    next(null,{code:200,msg:'连接服务器成功'})

onUserLeave = (app, session, reason) ->
  if not session or not session.uid
    return

  app.rpc.area.playerRemote.playerLeave session, playerId: session.get('playerId'), (err) ->
    if err
      logger.error 'user leave error' + err