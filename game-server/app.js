// load .env value to process.env
require('dotenv').load();

var pomelo = require('pomelo');
var area = require('./app/domain/area/area');
var MessageService = require('./app/service/messageService');
var ServerStateService = require('./app/service/serverStateService');
var routeUtil = require('./app/common/route');
var msgQueue = require('./app/common/msgQueue');
var cdFilter = require('./app/servers/area/filter/cdFilter');
var sensitiveWordFilter = require('./app/servers/area/filter/sensitiveWordFilter');
var areaUtil = require('./app/util/areaUtil');
var counter = require('./app/components/counter');
var simpleWeb = require('./app/components/web');
var verifier = require('./app/components/verifier');

var worldCupRewardNotice = require('./app/components/worldCupRewardNotice');

var PlayerManager = require('./app/manager/playerManager');
var appUtil = require('./app/util/appUtil');
var fs = require('fs');
var path = require('path');

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
    appUtil.loadAreaInfo(app);
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

  appUtil.loadShareConfig(app, 'sharedConf', 'conf.json');
  appUtil.loadShareConfig(app, 'versionConf', 'version.json');
  
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
  appUtil.loadDatabaseInfo(app, 'userdb');
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
  // app.before(sensitiveWordFilter());

  appUtil.loadDatabaseInfo(app, 'areadb');
  appUtil.loadShareDatabaseInfo(app);

  var dao_share = require('./app/dao').init('mysql', 'share');
  app.set('dao_share', dao_share);

  app.set('useSanbox', true);

  app.load(counter);
  app.load(verifier);
  app.load(worldCupRewardNotice);
});

app.configure('production|development', 'connector|auth|area', function() {
  var dao = require('./app/dao').init('mysql');
  app.set('dao', dao);

  var platform = require(app.getBase() + '/config/platform.json').platform;
  app.set('platform', platform);
});

app.configure('development', 'connector|auth|area', function() {
  app.set('debug', true);
  app.set('useSanbox', true);
});

app.configure('production|development', 'notice', function() {
  app.load(simpleWeb);
});

// start app
app.start();

process.on('uncaughtException', function(err) {
  console.error(' Uncaught exception: ' + err.stack);
});