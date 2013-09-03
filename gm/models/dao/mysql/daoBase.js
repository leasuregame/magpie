var sqlHelper = require('./sqlHelper');
var express = require('express');
var dbClient = require('./mysql');
var logger =  require('../../../logger').logger('daoBase');
var _ = require('underscore');

var ACTION = {
  INSERT: 'insert',
  UPDATE: 'update',
  DELETE: 'delete',
  SELECT: 'select'
};



var DaoBase = (function() {
  function DaoBase() {}

  DaoBase.table = '';
  DaoBase.domain = null;
  DaoBase.syncKey = '';

  /*
   * options = {
   *   table: [string], 需要操作的表的名称
   *   data: [object],  操作的数据对象
   *   where: [object] or [string], 条件对象或者条件语句，如：{id: 1} or 'id = 1'
   *   limit: [number], 需要返回记录的行数
   *   orderby: [string], 排序字段的名称
   *   sync: [boolean]    标记是否启用sync，按周期自动更新
   * }
   */

  DaoBase.create = function(options, cb) {
    var _this = this, key;
    var data = _.pick(this.domain.DEFAULT_VALUES, this.domain.FIELDS);
    _.extend(data, options.data);
    options.table = options.table || this.table;

    for (key in data) {
      if (typeof data[key] === 'object') {
        data[key] = JSON.stringify(data[key]);
      }
    }

    options.data = data;
    var stm = sqlHelper.generateSql(ACTION.INSERT, options);
    return dbClient.query(stm.sql, stm.args, function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when create " + _this.table + "]", stm);
        logger.error(err.stack);
        return cb({
          code: err.code,
          msg: err.message
        }, null);
      }
      return cb(null, res);
    });
  };

  DaoBase.fetchOne = function(options, cb) {
    var _this = this;
    return this.fetchMany(options, function(err, res) {
      if (!!res && res.length === 0) {
        return cb({
          code: 404,
          msg: 'can not find ' + _this.table
        }, null);
      }
      return cb(err, !!res ? res[0] : null);
    });
  };

  DaoBase.fetchMany = function(options, cb) {
    var _this = this;
    options.table = options.table || this.table;
    var stm = sqlHelper.generateSql(ACTION.SELECT, options);
    //console.log('fetch manay:', stm);
    //logger.info('fetch manay:', stm);
    return dbClient.query(stm.sql, stm.args, function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when fetch " + _this.table + "]", stm);
        logger.error(err.stack);
        return cb({
          code: err.code,
          msg: err.message
        });
      }

        return cb(null,res);

    });
  };

  DaoBase.update = function(options, cb) {
    var _this = this;
    options.table = options.table || this.table;
    var stm = sqlHelper.generateSql(ACTION.UPDATE, options);
    console.log(stm);
    return dbClient.query(stm.sql, stm.args, function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when update " + _this.table + "s]", err.stack);
        return cb({
          code: err.code,
          msg: err.message
        });
      }

      if (!!res && res.affectedRows > 0) {
        return cb(null, true);
      } else {
        return cb(null, false);
      }
    });
  };

  DaoBase.delete = function(options, cb) {
    var _this = this;
    options.table = options.table || this.table;
    var stm = sqlHelper.generateSql(ACTION.DELETE, options);
    return dbClient.query(stm.sql, stm.args, function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when delete " + _this.table + "s]", err.stack);
        return cb({
          code: err.code,
          msg: err.message
        });
      }

      if (!!res && res.affectedRows > 0) {
        return cb(null, true);
      } else {
        return cb(null, false);
      }
    });
  };

  DaoBase.query = function(sql, args, cb) {
    var _this = this;
    return dbClient.query(sql, args, function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when delete " + _this.table + "s]", err.stack);
        return cb({
          code: err.code,
          msg: err.message
        });
      }

       return cb(null,res);
      /*
      if (!!res && res.length > 0) {
        return cb(null, res.map(function(data) {
          return new _this.domain(data);
        }));
      } else {
        return cb(null, []);
      } */
    });
  };

  return DaoBase;
})();

module.exports = DaoBase;