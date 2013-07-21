/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-25
 * Time: 下午6:10
 * To change this template use File | Settings | File Templates.
 */


/*
 * sql helper
 * */

var util = require('util');

var sqlHelper = {
    generateSql: function(type, options) {
        return FUNCTION_MAPPING[type](options);
    },

    /*
     * 对某个表插入一行数据
     * @param {string} table 插入表表名
     * @param {object} fields 字面量，数据列，如：{tableId: 10, value 10}
     * @return {array} 包含两个数据，sql语句和填入值
     * */
    insertSql: function (table, fields) {
        fields.createTime = Date.now();
        var sql = "insert into " + table + " set ?";

        return { 
            sql: sql, 
            args: fields
        };
    },

    /*
     * 根据表名和ID更新数据
     * @param {string} table 插入表表名
     * @param {object} where 字面量，数据列，如：{id: 100000} or {name: "hehe"}
     * @param {object} data 字面量，数据列，如：{tableId: 10, value 5}
     * @return {array} 包含两个数据，sql语句和填入值
     * */
    updateSql: function (table, where, data) {
        if (arguments.length == 1) {
            where = table.where,
            data = table.data,
            table = table.table
        }
        var _sets = "";
        var _values = [];
        var key;
        var value;

        for (key in data) {
            value = data[key];
            _sets += "`" + key + "`=?,";
            if (typeof value == 'object') {
                _values.push(JSON.stringify(value));
            } else{
                _values.push(value);
            }
        }

        var whereStm = Statement.where(where);
        var sql = "update " + table + " set " + (_sets.slice(0, -1)) + " where " + whereStm.where;

        return {
            sql: sql, 
            args: _values.concat(whereStm.args)
        };
    },

    /*
     * 根据表名和where字面量数据查找行
     * @param {string} table 插入表表名
     * @param {object} where 字面量，数据列，如：{id: 100000} or {name: "hehe"}
     * @return {array} 包含两个数据，sql语句和填入值
     * */
    selectSql: function (table, where, limit) {
        var stm = Statement.where(where);        
        var sql = "select * from " + table + " where " + stm.where;
        return {
            sql: sql, 
            args: stm.args
        };
    },

    /*
     * 根据表名和where字面量数据删除行
     * @param {string} table 插入表表名
     * @param {object} where 字面量，数据列，如：{id: 100000} or {name: "hehe"}
     * @return {array} 包含两个数据，sql语句和填入值
     * */
    deleteSql: function (table, where) {
        var stm = Statement.where(where);
        var sql = "delete from " + table + " where " + stm.where;

        return {
            sql: sql, 
            args: stm.args
        };
    },

    topPlayersSql: function(orderBy, limit) {
        return util.format("select * from player order by `%s` limit %s", orderBy, limit);
    }
};

var Statement = {
    where: function(params) {
        var where_str = '';
        var args = []
        
        for (var key in params) {
            where_str += key + ' = ? and ';
            args.push(params[key]);
        }
        return {
            where: where_str.slice(0, -4), 
            args: args
        };
    }
};

var FUNCTION_MAPPING = {
    'insert': sqlHelper.insertSql,
    'update': sqlHelper.updateSql,
    'select': sqlHelper.selectSql,
    'delete': sqlHelper.deleteSql
};

module.exports = sqlHelper;
