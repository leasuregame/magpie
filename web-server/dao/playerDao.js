var db = require('./db/db');
var sqlUtil = require('./util/sqlUtil');
var _ = require('underscore');
var async = require('async');

/**
 * 根据where返回
 * @param fields 所需筛选的column eg : ['id', 'name'] , 若为 [] 则按 select * 进行查询
 * @param where
 * @param areaId
 * @param cb
 */

exports.getPlayers = function(fields, where, areaId, cb) {
    if (arguments.length == 3) {
        cb = areaId;
        areaId = where;
        where = fields;
        fields = {};
    }
    selectPlayers(fields, where, areaId, cb);
};

exports.playersInAreas = function(fields, where, areas, cb) {
    if (arguments.length == 3) {
        cb = areas;
        areas = [1];
        where = fields;
        fields = {};
    }

    if (typeof areas == 'number') {
        areas = [areas];
    }

    async.map(areas, function(areaId, done) {
        selectPlayers(fields, where, areaId, done);
    }, function(err, results) {
        if (err) {
            cb(err)
        } else {
            var items = results.reduce(function(x, y) {
                return x.concat(y);
            }, []);
            cb(null, items);
        }
    });
};

var selectPlayers = function(fields, where, areaId, cb) {
    var queryWhere = '1 = 1';

    if (typeof where == 'object') {
        for (var key in where) {
            if (where[key]) {
                var val = where[key];
                if(key == 'name') {
                    queryWhere += sqlUtil.buildInWhere(key, val);
                }
                queryWhere += sqlUtil.buildBetweenWhere(key, val);
            }
        }
    } else {
        queryWhere = where;
    }

    var selColStr = "";
    if (_.isEmpty(fields)) {
        selColStr = '*';
    } else {
        selColStr = fields.toString();
    }

    var sql = 'select ' + selColStr + ' from player where ' + queryWhere;

    db(areaId).query(sql, cb);
};