dao = require('pomelo').app.get('dao')
async = require('async')

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::createPlayer = (msg, session, next) ->
  name = msg.name
  areaId = session.get('areaId') or msg.areaId
  uid = session.uid

  @app.rpc.area.playerRemote.createPlayer session, {
    name: name
    userId: uid
    areaId: areaId
  }, (err, player) =>
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    afterCreatePlayer(@app, session, uid, areaId, player, next)

afterCreatePlayer = (app, session, uid, areaId, player, next) ->
  async.waterfall [
    (cb) ->
      dao.user.fetchOne where: id: uid, cb

    (user, cb) ->
      user.roles = user.roles.push areaId
      user.lastLoginArea = areaId
      user.save()
      cb()
      
    (cb) ->
      session.bind uid, cb

    (cb) =>
      session.set('playerId', player.id)
      session.set('areaId', player.areaId)
      session.set('playerName', player.name)
      session.on('closed', onUserLeave.bind(null, app))
      session.pushAll(cb)

    (cb) ->
      cb()
  ], (err) ->
    if err
      logger.error('创建玩家失败，' + err.stack)
      return next(null, {code: 500, msg: err.msg or ''})

    next(null, {code: 200, msg: {player: player}})

onUserLeave = (app, session, reason) ->
  if not session or not session.uid
    return

  app.rpc.area.playerRemote.playerLeave session, session.get('playerId'), (err) ->
    if err
      logger.error 'user leave error' + err

  # do something