var db = require('./db/db');
var sqlUtil = require('./util/sqlUtil');

/**
 * 获得每个player的最新一次记录,根据where返回
 * @param where
 * @param areaId
 * @param cb
 */
exports.getRecords = function(where, areaId, cb) {
    if (arguments.length == 2) {
        cb = areaId;
        areaId = where;
        where = {};
    }

    var queryWhere = '1 = 1 ';

    for(var key in where) {
        if(where[key]) {
            var val = where[key];
            queryWhere += sqlUtil.buildBetweenWhere(key, val);
        }
    }

    var sql = 'SELECT source, SUM(expense) as expense, COUNT(distinct playerId) as playerCounts ' +
        ' from playerConsumptionRecord' +
        ' where ' + queryWhere +
        ' group by source order by source';

    console.log(sql);

    db(areaId).query(sql, cb);
};