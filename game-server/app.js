var pomelo = require('pomelo');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'game-server');

// app configuration
app.configure('production|development', 'connector', function () {
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
  app.load(pomelo.sync, {path:__dirname + '/app/dao/mysql/mapping', dbclient: dbclient, interval: 60000});

  var dao = require('./app/dao').init('mysql'); 
  app.set('dao', dao);
});

// start app
app.start();

process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
});