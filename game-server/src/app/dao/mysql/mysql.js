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
        return _pool.acquire(function (err, client) {
            if ( !! err) {
                console.error('[sqlqueryErr] ' + err.stack);
                return;
            }
            queues(client, true);
            var trans = client.startTransaction();

            function error(e, info) {
                console.log('check transaction: ', e, info);
                if (e && trans.rollback) {
                    trans.rollback();
                    throw e;
                }
            }
            for (var i = 0; i < sqlList.length; i++) {
                trans.query(sqlList[i].sql, sqlList[i].args, error);
            }
            trans.commit(cb);
        });
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