_poolModule = require 'generic-pool'

createMysqlPool = (app) ->
  mysqlConfig = app.get('mysql')
  return _poolModule.Pool({
    name: 'mysql'
    create: (callback) ->
      mysql = require 'mysql'
      client = mysql.createConnection({
        host: mysqlConfig.host
        user: mysqlConfig.user
        password: mysqlConfig.password
        database: mysqlConfig.database
      })
      callback(null, client)
    destroy: (client) ->
      client.end()
    max: 10,
    idleTimeoutMillis: 30000
    log: false
  })

exports.createMysqlPool = createMysqlPool