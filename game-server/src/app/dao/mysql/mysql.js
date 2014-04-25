var queues = require('mysql-queues');
var NND, sqlclient, _pool;

function Mysql(app, key) {
    this._pool = null;
    this.key = key;
    this.init(app, key);
}

Mysql.prototype.init = function(app, key) {
    return this._pool = require('./pool').createMysqlPool(app, key);
};

Mysql.prototype.query = function(sql, args, cb) {
    if (typeof args == 'function') {
        cb = args;
        args = [];
    }

    var self = this;
    return this._pool.acquire(function(err, client) {
        if ( !! err) {
            console.error('[sqlqueryErr] ' + err.stack);
            return;
        }

        return client.query(sql, args, function(err, res) {
            self._pool.release(client);
            return cb(err, res);
        });
    });
};

Mysql.prototype.queues = function(sqlList, cb) {
    var self = this;
    return this._pool.acquire(function(err, client) {
        if ( !! err) {
            console.error('[sqlqueryErr] ' + err.stack);
            return;
        }

        queues(client, false);
        var trans = client.startTransaction();

        function error(e, info) {
            if (e && trans.rollback) {
                trans.rollback(function(err, info) {
                    return cb(e, false);
                });
            }
            // if (info.affectedRows < 1 && trans.rollback) {
            //     trans.rollback(function(err, info){
            //         return cb({code: 501, msg: 'not all data is complete'}, false);
            //     });
            // }
        }
        for (var i = 0; i < sqlList.length; i++) {
            var sql = sqlList[i].sql;
            var args = sqlList[i].args;
            trans.query(sql, args, error);
        }
        trans.commit(function(err, info) {
            self._pool.release(client);
            return cb(err, true);
        });
    });
};

Mysql.prototype.shutdown = function() {
    return this._pool.destroyAllNow();
};

Mysql.prototype.insert = Mysql.prototype.query;
Mysql.prototype.update = Mysql.prototype.query;
Mysql.prototype.delete = Mysql.prototype.query;
Mysql.prototype.queues = Mysql.prototype.query;

module.exports = Mysql;

// /*
//  mysql database CURD
//  */


// sqlclient = {
//     init: function(app, key) {
//         if ( !! _pool) {
//             return sqlclient;
//         } else {
//             NND.init(app, key);
//             sqlclient.insert = NND.query;
//             sqlclient.update = NND.query;
//             sqlclient.delete = NND.query;
//             sqlclient.query = NND.query;
//             sqlclient.queues = NND.queues;
//             return sqlclient;
//         }
//     },
//     shutdown: function() {
//         return NND.shutdown();
//     }
// };

// module.exports = sqlclient;