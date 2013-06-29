_pool = null

NND =
  ### 
  初始化mysql数据库连接池
  ###
  init: (app) ->
    _pool = require('./../pool').createMysqlPool(app)

  ###
  执行sql语句
  ###
  query: (sql, args, cb) ->
    _pool.acquire (err, client) ->
      if !!err
        console.error '[sqlqueryErr] ' + err.stack
        return

      client.query sql, args, (err, res) ->
        _pool.release client
        cb(err, res)

  ###
  关闭数据连接池
  ###
  shutdown: ->
    _pool.destroyAllNow()

###
mysql database CURD
###
sqlclient = 
  init: (app) ->
    if !!_pool
      return sqlclient
    else
      NND.init(app)
      sqlclient.insert = NND.query
      sqlclient.update = NND.query
      sqlclient.delete = NND.query
      sqlclient.query = NND.query
      return sqlclient

  shutdown: ->
    NND.shutdown()

module.exports = sqlclient