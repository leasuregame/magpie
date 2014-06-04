var db = require('./db/db');
var sqlUtil = require('./util/sqlUtil');
var _ = require('underscore');

/**
 * 根据where返回
 * @param cols 所需筛选的column eg : ['id', 'name'] , 若为 [] 则按 select * 进行查询
 * @param where
 * @param areaId
 * @param cb
 */
exports.getPlayers = function(cols, where, areaId, cb) {
    if (arguments.length == 3) {
        where = cols;
        areaId = where;
        cb = areaId;
        cols = {};
    }

    var queryWhere = '1 = 1';

    for(var key in where) {
        if(where[key]) {
            var val = where[key];
            queryWhere += sqlUtil.buildBetweenWhere(key, val);
        }
    }

    var selColStr = "";
    if(_.isEmpty(cols)) {
        selColStr = '*';
    } else {
        selColStr = cols.toString();
    }

    var sql = 'select ' + selColStr + ' from player where ' + queryWhere;

    db(areaId).query(sql, cb);
};