var queues = require('mysql-queues');
var NND, sqlclient, _pool;

_pool = null;

NND = {
    /*
     初始化mysql数据库连接池
     */

    init: function (app) {
        return _pool = require('./pool').createMysqlPool(app);
    },
    /*
     执行sql语句
     */

    query: function (sql, args, cb) {
        return _pool.acquire(function (err, client) {
            if ( !! err) {
                console.error('[sqlqueryErr] ' + err.stack);
                return;
            }
            return client.query(sql, args, function (err, res) {
                _pool.release(client);
                return cb(err, res);
            });
        });
    },

    queues: function (sqlList, cb) {
        //return _pool.acquire(function (err, client) {
            // if ( !! err) {
            //     console.error('[sqlqueryErr] ' + err.stack);
            //     return;
            // }
            var mysql = require('mysql');
            var client = mysql.createConnection({
                host: '127.0.0.1',
                user: 'dev',
                password: '1',
                port: 3306,
                database: 'magpie',
            });
            client.connect();

            // for (var i = 0; i < sqlList.length; i++) {
            //     client.query(sqlList[i].sql, sqlList[i].args);
            // }

            queues(client, true);
            
            var trans = client.startTransaction();

            function error(e) {
                if (e && trans.rollback) {
                    trans.rollback();
                    throw e;
                }
            }
            
            for (var i = 0; i < sqlList.length; i++) {
                trans.query(sqlList[i].sql, sqlList[i].args, error);
            }
            trans.commit(cb);
            //trans.execute();
            console.log('execute queues...');
        //});
    },
    /*
     关闭数据连接池
     */

    shutdown: function () {
        return _pool.destroyAllNow();
    }
};

/*
 mysql database CURD
 */


sqlclient = {
    init: function (app) {
        if ( !! _pool) {
            return sqlclient;
        } else {
            NND.init(app);
            sqlclient.insert = NND.query;
            sqlclient.update = NND.query;
            sqlclient.delete = NND.query;
            sqlclient.query = NND.query;
            sqlclient.queues = NND.queues;
            return sqlclient;
        }
    },
    shutdown: function () {
        return NND.shutdown();
    }
};

module.exports = sqlclient;