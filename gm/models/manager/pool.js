/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-8-27
 * Time: 下午2:52
 * To change this template use File | Settings | File Templates.
 */

var poolModule = require('generic-pool');

createPool = function(config) {

    return poolModule.Pool({
        name     : 'mysql',
        create   : function(callback) {
            var Client = require('mysql').Client;
            var c = new Client();
            c.user     = config.user;
            c.password = config.password;
            c.database = config.database;
            c.host = config.host;
            c.port = config.port;
            c.connect();

            // parameter order: err, resource
            // new in 1.0.6
            callback(null, c);
        },
        destroy  : function(client) { client.end(); },
        max      : 10,
        // optional. if you set this, make sure to drain() (see step 3)
        min      : 2,
        // specifies how long a resource can stay idle in pool before being removed
        idleTimeoutMillis : 30000,
        // if true, logs via console.log - can also be a function
        log : true
    });
}

module.exports = createPool;
