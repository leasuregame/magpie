var sqlHelper = require('./sqlHelper');
var dbClient = require('pomelo').app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var _ = require('underscore');

var ACTION = {
  INSERT: 'insert',
  UPDATE: 'update',
  DELETE: 'delete',
  SELECT: 'select'
}

var DaoBase = (function() {
  function DaoBase() {}

  DaoBase.DEFAULT_VALUES = {};
  DaoBase.table = '';
  DaoBase.domain = null;

  DaoBase.create =  function(options, cb) {
    var _this = this;
    var data = _.clone(this.DEFAULT_VALUES);
    _.extend(options.data, data);
    options.table = options.table || this.table;
    var stm = sqlHelper.generateSql(ACTION.INSERT, options);
    return dbClient.query(stm.sql, stm.args, function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when create " + _this.table + "]", err.stack)
        return cb({
          code: err.code,
          msg: err.message
        });
      }

      return cb(null, new _this.domain(_.extend({id: res.insertId}, options.data)));
    });
  };

  DaoBase.fetchOne = function(options, cb) {
    var _this = this;
    return this.fetchMany(options, function(err, res){
      if (!!res && res.length == 0) {
        return cb({code: 404, msg: 'can not find ' + _this.table}, null)
      }
      return cb(err, !!res ? res[0] : null);
    });
  };

  DaoBase.fetchMany = function(options, cb) {
    var _this = this;
    options.table = options.table || this.table;
    var stm = sqlHelper.generateSql(ACTION.SELECT, options);
    return dbClient.query(stm.sql, stm.args, function(err, res){
      if (err) {
        logger.error("[SQL ERROR, when fetch " + _this.table + "]", err.stack)
        return cb({
          code: err.code,
          msg: err.message
        });
      }

      if (!!res && res.length > 0) {
        return cb(null, res.map(function(data) {
          return new _this.domain(data);
        }));
      } else {
        return cb(null, []);
      }
    });
  };

  DaoBase.update = function(options, cb) {
    var _this = this;
    options.table = options.table || this.table;
    var stm = sqlHelper.generateSql(ACTION.UPDATE, options);
    return dbClient.query(stm.sql, stm.args, function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when update " + _this.table + "s]", err.stack)
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
        logger.error("[SQL ERROR, when delete " + _this.table + "s]", err.stack)
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

  return DaoBase;
})();

module.exports = DaoBase;