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

app.configure('production|development', 'connector|battle', function () {
    app.loadConfig('mysql', app.getBase() + '/config/mysql.json');
    app.loadConfig('ttserver', app.getBase() + '/config/ttserver.json');
});

// configure sql database
app.configure('production|development', 'connector|battle', function() {
  var dbclient = require('./app/dao/mysql/mysql').init(app);
  app.set('dbClient', dbclient);
  //app.load(pomelo.sync, {path:__dirname + '/app/dao/mapping', dbclient: dbclient});

  var dao = require('./app/dao').init('mysql');
  app.set('dao', dao);
});

// start app
app.start();

process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
});