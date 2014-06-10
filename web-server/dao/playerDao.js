var db = require('./db/db');
var sqlUtil = require('./util/sqlUtil');
var _ = require('underscore');

/**
 * 根据where返回
 * @param fields 所需筛选的column eg : ['id', 'name'] , 若为 [] 则按 select * 进行查询
 * @param where
 * @param areaId
 * @param cb
 */
exports.getPlayers = function(fields, where, areaId, cb) {
    if (arguments.length == 3) {
        where = fields;
        areaId = where;
        cb = areaId;
        fields = {};
    }

    var queryWhere = '1 = 1';

    for(var key in where) {
        if(where[key]) {
            var val = where[key];
            queryWhere += sqlUtil.buildBetweenWhere(key, val);
        }
    }

    var selColStr = "";
    if(_.isEmpty(fields)) {
        selColStr = '*';
    } else {
        selColStr = fields.toString();
    }

    var sql = 'select ' + selColStr + ' from player where ' + queryWhere;

    db(areaId).query(sql, cb);
};