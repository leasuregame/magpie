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
        if (arguments.length == 1) {
            fields = table.data;
            table = table.table;
        }
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
            where = table.where;
            data = table.data;
            table = table.table;
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
        var orderby, fields, where, limit;
        if (arguments.length == 1) {
            fields = table.fields || ''
            where = table.where;
            orderby = table.orderby || '';
            limit = table.limit || -1;
            table = table.table;
        }
        var stm = Statement.where(where);
        fields = fields == '' ? ' * ' : fields.join(',');
        where = stm.where == '' ? '' : ' where ' + stm.where;
        orderby = orderby == '' ? '' : ' order by ' + orderby;
        limit = limit == -1 ? '' : ' limit ' + limit;
        var sql = "select * from " + table + where + orderby + limit;
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
        if (arguments.length == 1) {
            where = table.where;
            table = table.table;
        }
        var stm = Statement.where(where);
        var sql = "delete from " + table + " where " + stm.where;

        return {
            sql: sql, 
            args: stm.args
        };
    },

    topPlayersSql: function(orderBy, limit) {
        return util.format("select * from player order by `%s` limit %s", orderBy, limit);
    },

    existsSql: function(options) {
        var stm = Statement.where(options.where);
        var where = stm.where == '' ? '' : ' where ' + stm.where;
        var sql =  util.format("select count(*) as exist from `%s` %s", options.table, where);
        return {
            sql: sql,
            args: stm.args
        }
    }
};

var Statement = {
    where: function(params) {
        var where_str = '';
        var args = []
        
        if (typeof params === 'string') {
            where_str = params;
        } else if (typeof params === 'object') {
            for (var key in params) {
                if (params[key] == null) {
                    where_str += '`'+key + '` is ? and '
                } else {
                    where_str += '`'+key + '` = ? and ';
                }                
                args.push(params[key]);
            }
            where_str = where_str.slice(0, -4);
        }

        return {
            where: where_str,
            args: args
        };
    }
};

var FUNCTION_MAPPING = {
    'insert': sqlHelper.insertSql,
    'update': sqlHelper.updateSql,
    'select': sqlHelper.selectSql,
    'delete': sqlHelper.deleteSql, 
    'exists': sqlHelper.existsSql
};

module.exports = sqlHelper;
