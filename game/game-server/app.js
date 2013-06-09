var pomelo = require('pomelo');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'game-server');

// app configuration
app.configure('production|development', 'connector', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			heartbeat : 3,
			useDict : true,
			useProtobuf : true
		});

  app.loadConfig('mysql', app.getBase() + '/config/mysql.json');
  app.filter(pomelo.filters.timeout());
});

// configure sql database
app.configure( 'production|development', 'connector|battle', function(){
  var dbclient = require('./app/manager/mysql/mysql').init(app);
  app.set('dbclient', dbclient);
  //app.load(pomelo.sync, {path:__dirname + '/app/dao/mapping', dbclient: dbclient});
}

);

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
