var pomelo = require('pomelo');
var sync = require('pomelo-sync-plugin');
var area = require('./app/domain/area/area');
var MessageService = require('./app/service/messageService');
var ServerStateService = require('./app/service/serverStateService');
var routeUtil = require('./app/common/route');
var msgQueue = require('./app/common/msgQueue');
var cdFilter = require('./app/servers/area/filter/cdFilter');
var areaUtil = require('./app/util/areaUtil');
var counter = require('./app/components/counter');
var simpleWeb = require('./app/components/web');
var verifier = require('./app/components/verifier');
var PlayerManager = require('./app/manager/playerManager');
var fs = require('fs');
var path = require('path');

var watchSharedConf = function(app) {
  var confpath = path.join(__dirname, '..', 'shared', 'conf.json')

  function setSharedConf(app, confpath) {
    app.set('sharedConf', JSON.parse(
      fs.readFileSync(confpath));
    );
  };

  setSharedConf(app, confpath);
  fs.watchFile(confpath, function(curr, prev) {
    setSharedConf(app, confpath);
  });
};

var watchAreaServersInfo = function(app) {
  var env = app.get('env');
  var serverConfigPath = app.getBase() + '/config/servers.json');
  
  function setAreas(app, sPath) {
    var servers = JSON.parse(fs.readFileSync(sPath));
    var areas = servers[env].area;
    var idMap = {};
    for (var i = 0; i < areas.length; i++) {
      var area = areas[i];
      idMap[area.id] = area.area;
    }
    app.set('areaIdMap', idMap);
  };
  setAreas(app, serverConfigPath);
  fs.watchFile(serverConfigPath, function(curr, prev) {
    setAreas(app, serverConfigPath);
  });
};

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'game-server');
app.set('debug', false);

app.configure('production|development', function() {
  app.enable('systemMonitor');
});

app.configure('production|development', function() {
  var areaInfo = require('./app/modules/areaInfo');
  var onlineUser = require('./app/modules/onlineUser');
  var loginsOnArea = require('./app/modules/loginsOnArea');
  if (typeof app.registerAdmin === 'function') {
    app.registerAdmin(areaInfo, {
      app: app
    });
    app.registerAdmin(onlineUser, {
      app: app
    });
    app.registerAdmin(loginsOnArea, {
      app: app
    });
  }

  //Set areasIdMap, a map from area id to serverId.
  if (app.serverType !== 'master') {
    watchAreaServersInfo(app);
  }

  // proxy configures
  app.set('proxyConfig', {
    cacheMsg: true,
    interval: 30,
    lazyConnection: true
  });

  // remote configures
  app.set('remoteConfig', {
    cacheMsg: true,
    interval: 30
  });

  app.route('connector', routeUtil.connector);
  app.route('area', routeUtil.area);

  app.filter(pomelo.filters.timeout());
  app.rpcFilter(pomelo.rpcFilters.rpcLog());

  watchSharedConf(app);

  app.set('errorHandler', function(err, msg, resp, session, opts, cb){
    cb(err, resp, opts);
  });
});



// app configuration
app.configure('production|development', 'connector', function() {

  app.set('connectorConfig', {
    connector: pomelo.connectors.hybridconnector,
    heartbeat: 30,
    useDict: true,
    useProtobuf: true
  });
});

app.configure('production|development', 'gate', function() {
  app.set('connectorConfig', {
    connector: pomelo.connectors.hybridconnector,
    heartbeat: 30
  });

  app.set('serverStateService', new ServerStateService(app));
});

// configure sql database
app.configure('production|development', 'connector|auth', function() {
  var env = app.get('env');
  app.set('mysql', require(app.getBase() + '/config/mysql.json')[env]['userdb']);

  var dbclient = require('./app/dao/mysql/mysql').init(app);
  app.set('dbClient', dbclient);

  app.use(sync, {
    sync: {
      path: __dirname + '/app/dao/mysql/mapping/user',
      dbclient: dbclient,
      interval: 60000
    }
  });
});

app.configure('production|development', 'area', function() {
  app.set('messageService', new MessageService(app));
  app.set('playerManager', new PlayerManager(app));

  area.init({
    app: app
  });
  msgQueue.init({
    app: app
  });
  areaUtil.checkFlagFile(app);
  app.before(cdFilter());

  var areaId = app.get('curServer').area;
  var mysqlConfig = require(app.getBase() + '/config/mysql.json');
  var env = app.get('env');

  var val = mysqlConfig;
  if (mysqlConfig[env] && mysqlConfig[env][areaId]) {
    val = mysqlConfig[env][areaId];
  }
  app.set('mysql', val);

  var dbclient = require('./app/dao/mysql/mysql').init(app);
  app.set('dbClient', dbclient);

  app.use(sync, {
    sync: {
      path: __dirname + '/app/dao/mysql/mapping/area',
      dbclient: dbclient,
      interval: 60000
    }
  });

  app.load(counter);
  app.load(verifier);
});

app.configure('production|development', 'connector|auth|area', function() {
  var dao = require('./app/dao').init('mysql');
  app.set('dao', dao);

  var platform = require(app.getBase() + '/config/platform.json').platform;
  app.set('platform', platform);
});

app.configure('development', 'connector|auth|area', function() {
  app.set('debug', true);
});

app.configure('production|development', 'notice', function() {
  app.load(simpleWeb);
});

// start app
app.start();

process.on('uncaughtException', function(err) {
  console.error(' Caught exception: ' + err.stack);
});