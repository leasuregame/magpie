var db = require('./db/db');
var sqlUtil = require('./util/sqlUtil');
var util = require('util');
var _ = require('underscore');

/**
 * 根据where返回
 * @param fields 所需筛选的column eg : ['id', 'name'] , 若为 [] 则按 select * 进行查询
 * @param where
 * @param areaId
 * @param cb
 */
exports.getRecords = function(fields, where, areaId, cb) {
    if (arguments.length == 3) {
        cb = areaId;
        areaId = where;
        where = fields;
        fields = {};
    }

    var queryWhere = '';

    for(var key in where) {
        if(where[key]) {
            var val = where[key];
            if(key == 'createTime')
                queryWhere += sqlUtil.buildBetweenWhere(key, val);
            else
                queryWhere += sqlUtil.buildInWhere(key, val);
        }
    }

    var selColStr = "";
    if(_.isEmpty(fields)) {
        selColStr = 'r.*, p.name as playerName';
    } else {
        _.each(fields, function(field){
            selColStr += 'r.' + field + ',';
        });
        selColStr = selColStr.substr(0, selColStr.length);
        if(_.indexOf(fields, 'playerId') > -1) {
            selColStr += ', p.name as playerName';
        }
    }

    var sql = 'select ' + selColStr + ' , ' + areaId + ' as areaId' +
        ' from backendRecharge as r, player as p' +
        ' where r.playerId = p.id ' + queryWhere;

    console.log(sql);

    db(areaId).query(sql, cb);
};