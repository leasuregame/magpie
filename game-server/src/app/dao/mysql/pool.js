var createMysqlPool, _poolModule;

_poolModule = require('generic-pool');

createMysqlPool = function(app, configKey) {
    var mysqlConfig,
        configKey = configKey || 'mysql';

    mysqlConfig = app.get(configKey);
    return _poolModule.Pool({
        name: 'mysql',
        create: function(callback) {
            var client, mysql;

            function connect(cb) {
                mysql = require('mysql');
                client = mysql.createConnection({
                    host: mysqlConfig.host,
                    user: mysqlConfig.user,
                    port: mysqlConfig.port,
                    password: mysqlConfig.password,
                    database: mysqlConfig.database,
                    insecureAuth: true
                });

                client.on('close', function(err) {
                    console.log('[sql connection close]: ', err);
                });

                client.connect(handleError);
                client.on('error', handleError);
                if (typeof cb == 'function') {
                    cb(null, client);    
                } else {
                    return client;
                }                
            }

            function handleError(err) {
                if (err) {
                    if (err.code == 'PROTOCOL_CONNECTION_LOST') {
                        console.log(err);
                        connect();
                    } else {
                        console.log('[sql connection error]: ', err);
                    }
                }
            }

            return connect(callback);
        },
        destroy: function(client) {
            return client.end();
        },
        max: 10,
        idleTimeoutMillis: 30000,
        log: false
    });
};

exports.createMysqlPool = createMysqlPool;