var createMysqlPool, _poolModule;

_poolModule = require('generic-pool');

createMysqlPool = function (config) {
    var mysqlConfig;

    mysqlConfig = config;
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
            return callback(null, client);
        },
        destroy: function (client) {
            return client.end();
        },
        max: 10,
        idleTimeoutMillis: 30000,
        log: false
    });
};

exports.createMysqlPool = createMysqlPool;
