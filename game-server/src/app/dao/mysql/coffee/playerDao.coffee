dbclient = require('pomelo').app.get('dbclient')
sqlHelper = require './../sqlHelper'
Player = require '../../../domain/coffee/player'
logger = require('pomelo-logger').getLogger(__filename)
_ = require 'underscore'

module.exports = playerDao =
  ###
  创建一个新的玩家
  @param {uid} 用户id，必须参数
  @param {name} 玩家名称，必须参数
  @param {params} 提供创建是额外的玩家信息，如： {money: 10000}
  @param {cb} 回调函数
  ###
  createPlayer: (uid, name, params, cb) ->
    if not uid or not name
      throw new Error("can not create user with not userid or username")

    fields = _.extend {user_id: uid, name: name}, params
    [sql, args] = sqlHelper.insertSql('player', fields)

    dbclient.insert sql, args, (err, res) ->
      if err
        logger.error ' [create user faild]', err.stack
        cb({code: err.code, msg: err.message}, null)
      else
        playerCallbackHandler(res, cb)

  ###
  更新玩家的信息
  @param {playerId} 玩家Id，必须参数
  @param {params} 需要更新的玩家属性，如：{name: '名称', lv: 20}
  @param {cb} 回调函数
  ###
  updatePlayer: (playerId, params, cb) ->
    if not playerId or params
      throw new Error("can not update player with not playerId or updated fields")

    [sql, args] = sqlHelper.updateSql('player', playerId, params)
    dbclient.update sql, args, (err, res) ->
      if err
        cb({code: err.number, msg: err.message}, null)
      else
        cb(null, res)


  getPlayerById: (playerId, cb) ->
    if playerId?
      [sql, args] = sqlHelper.selectSql('player', ['id', playerId])
      dbclient.query sql, args, (err, res) ->
        if err
          cb(err.message, null)
          return

        if !!res and res.length is 1
          playerCallbackHandler(res[0], cb)
        else
          cb(' Player not exists ', null)

  getPlayerByName: (name, cb) ->
    if name?
      [sql, args] = sqlHelper.selectSql('player', ['name', name])
      dbclient.query sql, args, (err, res) ->
        if err
          cb(err.message, null)
          return

        if !!res and res.length is 1
          playerCallbackHandler(res[0], cb)
        else
          cb(' Player not exists ', null)


playerCallbackHandler = (row, cb) ->
  player = new Player(
      id: row.insertId
      uid: row.user_id
      area_id: row.area_id
      name: row.name
      power: row.power
      lv: row.lv
      exp: row.exp
      money: row.money
      gold: row.gold
      formation: row.formation
      ability: row.ability
      task: row.task
      task_mark: row.task_mark
      pass: row.pass
      pass_mark: row.pass_mark
    )
  cb(null, player)

