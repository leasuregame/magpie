var db = require('./db/db');
var sqlUtil = require('./util/sqlUtil');

/**
 * 获得每个player的最新一次记录,根据where返回
 * @param where
 * @param areaId
 * @param cb
 */
exports.getLastRecords = function(where, areaId, cb) {
    if (arguments.length == 2) {
        cb = areaId;
        areaId = where;
        where = {};
    }

    var queryWhere = '';

    for(var key in where) {
        if(where[key]) {
            var val = where[key];
            queryWhere += sqlUtil.buildBetweenWhere(key, val);
        }
    }

    var sql = 'SELECT playerId, MAX(playerLv) as playerLv, MAX(recordDate) as recordDate ' +
        ' from playerDailyLvRecord as rec, player as p' +
        ' where rec.playerId = p.id ' + queryWhere +
        ' group by playerId';

    db(areaId).query(sql, cb);
};