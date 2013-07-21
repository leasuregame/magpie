var sqlHelper = require('./sqlHelper');
var dbClient = require('pomelo').app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = module.exports;

var ACTION = {
  INSERT: 'insert',
  UPDATE: 'update',
  DELETE: 'delete',
  SELECT: 'select'
}

DaoBase = {
  DEFAULT_VALUES = {},
  table: ''
  domain: null,

  create: function(options, cb) {
    var _this = this;
    var data = _.clone(this.DEFAULT_VALUES);
    _.extend(options.data, data);
    options.table = this.table;
    var stm = sqlHelper.generateSql(ACTION.INSERT, options);
    return dbClient.query(stm..sql, stm.args, function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when create " + _this.table + "]", err.stack)
        return cb({
          code: err.code,
          msg: err.message
        });
      }

      return cb(null, new _this.domain(_.extend({id: res.insertId}, data)));
    });
  }, 

  fetchOne: function(options, cb) {
    var _this = this;
    options.table = this.table;
    var stm = sqlHelper.generateSql(ACTION.SELECT, options);
    return dbClient.query(stm.sql, stm.args, function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when fetch " + _this.table + "]", err.stack)
        return cb({
          code: err.code,
          msg: err.message
        });
      }

      if (!!res && res.length == 1) {
        return cb(null, new _this.domain(res[0]));
      } else {
        return cb(null, {code: 404, msg: 'can not find ' + _this.table})
      }
    });
  }, 

  fetchMany: function(options, cb) {
    var _this = this;
    options.table = this.table;
    var stm = sqlHelper.generateSql(ACTION.SELECT, options);
    return dbClient.query(stm.sql, stm.args, function(err, res){
      if (err) {
        logger.error("[SQL ERROR, when fetch " + _this.table + "s]", err.stack)
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
  }, 

  update: function(options, cb) {
    var _this = this;
    options.table = this.table;
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
  }

};
