var db = require('./db/recordDb');
var sqlUtil = require('./util/sqlUtil');
var util = require('util');
var TAB_NAME = 'sendRewardRecord';

/**
 * 根据where返回
 * @param where
 * @param areaId
 * @param cb
 */
exports.getRecords = function(where, cb) {
    var queryWhere = '1 = 1';

    for(var key in where) {
        if(where[key]) {
            var val = where[key];
            queryWhere += sqlUtil.buildBetweenWhere(key, val);
        }
    }

    var sql = util.format('select * from %s where %s', TAB_NAME, queryWhere);
    db.query(sql, cb);
};

/**
 * insert
 * @param param [operator, detail, status] | [param, param, param ...]
 * @param cb
 */
exports.addRecord = function (param, cb) {

    if(param[0] instanceof Array) {
        for(var i in param) {
            param[i].splice(0, 0, null);
            param[i].push(new Date().getTime());
        }
    } else {
        param.splice(0, 0, null);
        param.push(new Date().getTime());
    }

    console.log("param", param);

    db.insert(TAB_NAME, param, cb);
};