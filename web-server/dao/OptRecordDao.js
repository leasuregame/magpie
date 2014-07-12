var db = require('./db/recordDb');
var sqlUtil = require('./util/sqlUtil');
var util = require('util');
var TAB_NAME = 'optionRecord';
var RECORD_TYPE = {
    sendMsgOpt : 1,
    rechargeOpt : 2
};

/**
 * select from table
 * @param baseWhere     a where sql
 * @param where         a object to combine where sql
 * @param cb
 */
function getRecords(baseWhere, where, cb) {
    var queryWhere = baseWhere;
    for(var key in where) {
        if(where[key]) {
            var val = where[key];
            if(key == 'createTime') {
                queryWhere += sqlUtil.buildBetweenWhere(key, val);
            } else {
                queryWhere += sqlUtil.buildInWhere(key, val);
            }
        }
    }
    var sql = util.format('select * from %s where %s order by createTime desc', TAB_NAME, queryWhere);
    console.log(sql);
    db.query(sql, cb);
}

/**
 * 根据where返回'发送系统消息的操作'
 * @param where
 * @param cb
 */
exports.getSendMsgRecords = function(where, cb) {
    var baseWhere = 'type = ' + RECORD_TYPE.sendMsgOpt;
    getRecords(baseWhere, where, cb);
};

/**
 * 根据where返回'后台充值的操作'
 * @param where
 * @param cb
 */
exports.getRechargeRecords = function(where, cb) {
    var baseWhere = 'type = ' + RECORD_TYPE.rechargeOpt;
    getRecords(baseWhere, where, cb);
};

/**
 * insert
 * @param param [operator, detail, status] | [param, param, param ...]
 * @param cb
 */
function addRecord (param, type, cb) {

    // for id
    param.splice(0, 0, null);
    // createTime
    param.push(new Date().getTime());
    // record type
    param.push(type);
    db.insert(TAB_NAME, param, cb);
}

/**
 * 插入'发送系统消息的操作'
 * @param param
 * @param cb
 */
exports.addSendMsgRecord = function (param, cb) {
    addRecord(param, RECORD_TYPE.sendMsgOpt, cb);
};

/**
 * 插入'后台充值的操作'
 * @param param
 * @param cb
 */
exports.addRechargeRecord = function (param, cb) {
    addRecord(param, RECORD_TYPE.rechargeOpt, cb);
};