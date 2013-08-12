var pomelo = require('pomelo');
var area = require('./app/domain/area/area');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'game-server');
app.set('debug', false);

// app configuration
app.configure('production|development', 'connector', function() {
  app.set('connectorConfig', {
    connector: pomelo.connectors.hybridconnector,
    heartbeat: 3,
    useDict: true,
    useProtobuf: true
  });

  app.filter(pomelo.filters.timeout());
});

// configure sql database
app.configure('production|development', 'connector|battle|logic', function() {
  app.loadConfig('mysql', app.getBase() + '/config/mysql.json');

  var dbclient = require('./app/dao/mysql/mysql').init(app);
  app.set('dbClient', dbclient);
  app.load(pomelo.sync, {
    path: __dirname + '/app/dao/mysql/mapping',
    dbclient: dbclient,
    interval: 60000
  });

  var dao = require('./app/dao').init('mysql');
  app.set('dao', dao);

});

// app.configure('production|development', 'logic', function(){
//   area.init();
// });

// app.configure('production|development', 'area|battle', function(){
//   loadMysqlConfig(app.getBase() + '/config/mysql1.json');
// });

app.configure('development', 'connector|battle|logic', function() {
  app.set('debug', true);
});

// start app
app.start();

process.on('uncaughtException', function(err) {
  console.error(' Caught exception: ' + err.stack);
});

var loadMysqlConfig = function(path) {
  var areaId = app.get('curServer').area;
  var mysqlConfig = require(path);
  var env = app.get('env');

  var val = mysqlConfig;
  if (mysqlConfig[env] && mysqlConfig[env][areaId]) {
    val = mysqlConfig[env][areaId];
  }
  app.set('mysql', val);
};