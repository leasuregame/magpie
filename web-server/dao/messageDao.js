var db = require('./db/db');
var sqlUtil = require('./util/sqlUtil');
var DB_NAME = 'message';
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
    createTime : 'valite'
}

/**
 * 根据where返回
 * @param where {sender, receiver, type, status, createTime}
 * @param areaId
 * @param cb
 */
exports.getMessgae = function(where, areaId, cb) {
    if (arguments.length == 2) {
        cb = areaId;
        areaId = 1;
    }

    var queryWhere = '1 = 1';

    for(var key in where) {
        var val = where[key];
        if(val) {
            switch (key) {
                case dbFields.sender :
                case dbFields.receiver :
                case dbFields.type :
                case dbFields.status :
                    queryWhere += sqlUtil.buildInWhere(key, val);
                    break;
                case dbFields.createTime :
                    queryWhere += sqlUtil.buildBetweenWhere(key, val);
                    break;
                default : break;
            }
        }
    }

    var val = where[key];
    queryWhere += sqlUtil.buildBetweenWhere(key, val);

    var sql = 'select * from ' + DB_NAME + ' where ' + queryWhere;

    db(areaId).query(sql, cb);
};

