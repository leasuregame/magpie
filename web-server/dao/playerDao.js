var db = require('./db/db');
var sqlUtil = require('./util/sqlUtil');

/**
 * 根据where返回
 * @param where
 * @param areaId
 * @param cb
 */
exports.getPlayers = function(where, areaId, cb) {
    if (arguments.length == 2) {
        cb = areaId;
        areaId = 1;
    }

    var queryWhere = '1 = 1';

    for(var key in where) {
        if(where[key]) {
            var val = where[key];
            queryWhere += sqlUtil.buildBetweenWhere(key, val);
        }
    }

    var sql = 'select * from player where ' + queryWhere;

    db(areaId).query(sql, cb);
};

exports.getSysMsg = function (where, areaId, cb) {

};