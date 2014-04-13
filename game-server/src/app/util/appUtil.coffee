path = require('path')
fs = require('fs')
sync = require('pomelo-sync-plugin')

util = module.exports

util.loadShareConfig = (app) ->
  confPath = path.join app.getBase(), '..', 'shared', 'conf.json'

  setSharedConf = (app, confPath) ->
    app.set 'sharedConf', JSON.parse(fs.readFileSync(confPath))

  setSharedConf app, confPath
  fs.watchFile confPath, () -> setSharedConf app, confPath

util.loadAreaInfo = (app) ->
  env = app.get 'env'
  serverConfigPath = path.join app.getBase(), 'config', 'servers.json'

  setAreas = (app, filepath) ->
    servers = JSON.parse fs.readFileSync(filepath)
    areas = servers[env].area
    idMap = {}
    idMap[area.area] = area.id for area in areas
    app.set 'areaIdMap', idMap

  setAreas app, serverConfigPath
  fs.watchFile serverConfigPath, () -> setAreas app, serverConfigPath

util.loadDatabaseInfo = (app, type) ->
  mysqlPath = path.join app.getBase(), 'config', 'mysql.json'
  env = app.get('env')
  mysqlConfig = JSON.parse(fs.readFileSync(mysqlPath))

  if type is 'userdb'
    app.set 'mysql', mysqlConfig[env]['userdb']
  
  if type is 'areadb' 
    areaId = app.get('curServer').area
    app.set 'mysql', mysqlConfig[env][areaId]

  dbClient = require(app.getBase() + '/app/dao/mysql/mysql').init(app)
  app.set('dbClient', dbClient)

  app.use sync, {
    sync: {
      path: app.getBase() + '/app/dao/mysql/mapping/' + (if type is 'userdb' then 'user' else 'area'),
      dbclient: dbClient,
      interval: 60000
    }
  }