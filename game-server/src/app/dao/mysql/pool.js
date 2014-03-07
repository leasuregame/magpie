var createMysqlPool, _poolModule;

_poolModule = require('generic-pool');

createMysqlPool = function (app) {
    var mysqlConfig;

    mysqlConfig = app.get('mysql');
    return _poolModule.Pool({
        name: 'mysql',
        create: function (callback) {
            var client, mysql;

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
            })
            client.on('error', function(err) {
                console.log('[sql connection error]: ', err);
            });
            return callback(null, client);
        },
        destroy: function (client) {
            return client.end();
        },
        max: 30,
        idleTimeoutMillis: 30000,
        log: true
    });
};

exports.createMysqlPool = createMysqlPool;
