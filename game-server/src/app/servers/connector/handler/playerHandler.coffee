dao = require('pomelo').app.get('dao')
async = require('async')
logger = require('pomelo-logger').getLogger(__filename)

CHINESE_REG = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,6}$/
EMPTY_SPACE_REG = /\s+/g

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::createPlayer = (msg, session, next) ->
  name = msg.name
  areaId = session.get('areaId') or msg.areaId
  userId = session.get('userId') or msg.userId

  if EMPTY_SPACE_REG.test(name)
    return next(null, {code: 501, msg: '角色名称不能包含空格'})

  if not CHINESE_REG.test(name)
    return next(null, {code: 501, msg: '只能输入1-6位汉字、字母或数字'})

  @app.rpc.area.playerRemote.createPlayer session, {
    name: name
    userId: userId
    areaId: areaId
    serverId: @app.getServerId()
  }, (err, player) =>
    if err and err.code is 404
      return next(null, {code: 501, msg: "玩家已存在"})

    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    afterCreatePlayer(@app, session, userId, areaId, player, next)

afterCreatePlayer = (app, session, userId, areaId, player, next) ->
  async.waterfall [
    (cb) ->
      dao.user.fetchOne {
        where: id: userId
        sync: true
      }, cb

    (user, cb) ->
      if _.isArray(user.roles)
        roles = _.clone(user.roles)
      else
        roles = []
      roles.push areaId if areaId not in roles
      user.roles = roles
      user.lastLoginArea = areaId
      user.save()
      cb()
      
    (cb) ->
      session.bind userId+'*'+areaId, cb

    (cb) =>
      session.set('playerId', player.id)
      session.set('areaId', player.areaId)
      session.set('playerName', player.name)
      session.on('closed', onUserLeave.bind(null, app))
      session.pushAll(cb)
  ], (err) ->
    if err
      logger.error('创建玩家失败，' + err.stack)
      return next(null, {code: 501, msg: '创建失败，请重新登录'})

    next(null, {code: 200, msg: {player: player}})

onUserLeave = (app, session, reason) ->
  if not session or not session.uid
    return

  app.rpc.area.playerRemote.playerLeave session, session.get('playerId'), session.uid, app.getServerId(), (err) ->
    if err
      logger.error 'user leave error' + err

  # do something