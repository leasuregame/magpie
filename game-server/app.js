var pomelo = require('pomelo');
var area = require('./app/domain/area/area');
var MessageService = require('./app/service/messageService');
var routeUtil = require('./app/common/route');
var msgQueue = require('./app/common/msgQueue');
var argsFilter = require('./app/servers/area/filter/argsFilter');
var loginFilter = require('./app/servers/connector/filter/loginFilter');
var areaUtil = require('./app/util/areaUtil');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'game-server');
app.set('debug', false);

app.configure('production', function() {
  app.enable('systemMonitor');
});

app.configure('production|development', function() {
  //Set areasIdMap, a map from area id to serverId.
  if (app.serverType !== 'master') {
    var areas = app.get('servers').area;
    var areaIdMap = {};
    for (var id in areas) {
      areaIdMap[areas[id].area] = areas[id].id;
    }
    app.set('areaIdMap', areaIdMap);

    var battles = app.get('servers').battle;
    var battleIdMap = {};
    for (var id in battles) {
      battleIdMap[battles[id].area] = battles[id].id;
    }
    app.set('battleIdMap', battleIdMap);
  }

  // proxy configures
  app.set('proxyConfig', {
    cacheMsg: true,
    interval: 30,
    lazyConnection: true,
    enableRpcLog: true
  });

  // remote configures
  app.set('remoteConfig', {
    cacheMsg: true,
    interval: 30
  });

  app.route('connector', routeUtil.connector);
  app.route('area', routeUtil.area);

  app.filter(pomelo.filters.timeout());
});



// app configuration
app.configure('production|development', 'connector', function() {

  app.set('connectorConfig', {
    connector: pomelo.connectors.hybridconnector,
    heartbeat: 3,
    useDict: true,
    useProtobuf: true
  });

  //app.filter(loginFilter());
});

app.configure('production|development', 'gate', function(){
  app.set('connectorConfig', {
    connector: pomelo.connectors.hybridconnector
  });
});

// configure sql database
app.configure('production|development', 'connector|auth', function() {
  var env = app.get('env');
  app.set('mysql', require(app.getBase() + '/config/mysql1.json')[env]['userdb']);

  var dbclient = require('./app/dao/mysql/mysql').init(app);
  app.set('dbClient', dbclient);

  app.load(pomelo.sync, {
    path: __dirname + '/app/dao/mysql/mapping/user',
    dbclient: dbclient,
    interval: 60000
  });
});

app.configure('production|development', 'area', function() {
  app.set('messageService', new MessageService(app));

  area.init({app: app});
  msgQueue.init({app: app});
  areaUtil.checkFlagFile(app);
  //app.filter(argsFilter());
});

app.configure('production|development', 'area', function() {
  var areaId = app.get('curServer').area;
  var mysqlConfig = require(app.getBase() + '/config/mysql1.json');
  var env = app.get('env');

  var val = mysqlConfig;
  if (mysqlConfig[env] && mysqlConfig[env][areaId]) {
    val = mysqlConfig[env][areaId];
  }
  app.set('mysql', val);

  var dbclient = require('./app/dao/mysql/mysql').init(app);
  app.set('dbClient', dbclient);

  app.load(pomelo.sync, {
    path: __dirname + '/app/dao/mysql/mapping/area',
    dbclient: dbclient,
    interval: 60000
  });
});

app.configure('production|development', 'connector|auth|area', function() {
  var dao = require('./app/dao').init('mysql');
  app.set('dao', dao);
});

app.configure('development', 'connector|auth|area', function() {
  app.set('debug', true);
});

// start app
app.start();

process.on('uncaughtException', function(err) {
  console.error(' Caught exception: ' + err.stack);
});