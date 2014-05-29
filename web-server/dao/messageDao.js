var db = require('./db/db');
var sqlUtil = require('./util/sqlUtil');
var util = require('util');

var DB_NAME = 'message';
var PLAYER_DB_NAME = 'player';
var SERV_MSG_REC_CODE = -1;
var dbFields = {
    id : 'id',
    msgId : 'msgId',
    sender : 'sender',
    receiver : 'receiver',
    type : 'type',
    options : 'options',
    content : 'content',
    status : 'status',
    createTime : 'createTime',
    validDate : 'validDate'
};

/**
 * 根据where返回
 * @param where {sender:(number|*), receiver:(number|*), type:number, status:number, createTime:[dateTime, dateTime]}
 * @param areaId
 * @param cb
 */
exports.getPlayerMessage = function(where, areaId, cb) {
    if (arguments.length == 2) {
        cb = areaId;
        areaId = 1;
    }

    var queryWhere = buildWhereSql(where);

    var sql = util.format('select m.*, p.name, p.areaId from %s m, %s p where m.%s = p.%s and %s order by m.id desc', DB_NAME, PLAYER_DB_NAME, dbFields.receiver, 'id', queryWhere);

    console.log("areaId : " + areaId, sql);

    db(areaId).query(sql, cb);
};

exports.getServMessage = function(where, areaId, cb){
    if (arguments.length == 2) {
        cb = areaId;
        areaId = 1;
    }

    where.receiver = SERV_MSG_REC_CODE;
    var queryWhere = buildWhereSql(where);

    var sql = util.format('select m.* from %s m where %s order by m.id desc', DB_NAME, queryWhere);

    console.log("serv areaId : " + areaId, sql);

    where.receiver = undefined;
    db(areaId).query(sql, cb);
};

function buildWhereSql(where) {
    var queryWhere = '1 = 1';
    for(var key in where) {
        var val = where[key];
        if(val) {
            switch (key) {
                case dbFields.sender :
                case dbFields.receiver :
                case dbFields.type :
                case dbFields.status :
                    if(val) {
                        queryWhere += sqlUtil.buildInWhere(key, val);
                    }
                    break;
                case dbFields.createTime :
                case dbFields.validDate :
                    if(val) {
                        queryWhere += sqlUtil.buildBetweenWhere(key, val);
                    }
                    break;
                default : break;
            }
        }
    }
    return queryWhere;
}
