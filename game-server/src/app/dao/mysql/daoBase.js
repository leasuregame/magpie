var sqlHelper = require('./sqlHelper');
var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var _ = require('underscore');
var utility = require('../../common/utility');
var uuid = require('node-uuid');

var ACTION = {
  INSERT: 'insert',
  UPDATE: 'update',
  DELETE: 'delete',
  SELECT: 'select',
  EXISTS: 'exists'
};

var addSyncEvent = function(syncKey, entity, cb) {
  entity.on('save', function(cb) {
    var fn;
    // 实时更新
    fn = app.get('sync').flush;

    // 周期性更新
    // fn = app.get('sync').exec;
    fn.call(app.get('sync'),
      syncKey,
      entity.id, {
        id: entity.id,
        data: entity.getSaveData(),
        cb: cb
      }
    );
  });

  entity.on('persist', function(data, cb) {
    app.get('sync').flush(syncKey, data.id, {
      id: data.id,
      data: data,
      cb: cb
    });
  });
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
   *   fields: [array]  the fields to be selected, empty means all
   *   where: [object] or [string], 条件对象或者条件语句，如：{id: 1} or 'id = 1'
   *   limit: [number], 需要返回记录的行数
   *   orderby: [string], 排序字段的名称
   *   sync: [boolean]    标记是否启用sync，按周期自动更新
   * }
   */

  DaoBase.create = function(options, cb) {
    var _this = this,
      key;
    var data = _.pick(this.domain.DEFAULT_VALUES, this.domain.FIELDS);
    _.extend(data, options.data);
    options.table = options.table || this.table;

    if (_.contains(this.domain.FIELDS, 'createTime') && !data.createTime) {
      data.createTime = Date.now();
    }

    if (this.table == 'player') {
      if (!data.created) {
        data.created = utility.dateFormat(new Date(), 'yyyy-MM-dd h:mm:ss')
      }
      if (!data.uniqueId) {
        data.uniqueId = uuid.v1();
      }

    }

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

      var entity = new _this.domain(_.extend({}, options.data, {id: res.insertId}));
      if (options.sync) {
        addSyncEvent(_this.syncKey, entity);
      }
      return cb(null, entity);
    });
  };

  DaoBase.fetchOne = function(options, cb) {
    var _this = this;
    return this.fetchMany(options, function(err, res) {
      if ( !! res && res.length === 0) {
        return cb({
          code: 404,
          msg: 'can not find ' + _this.table
        }, null);
      }
      return cb(err, !! res ? res[0] : null);
    });
  };

  DaoBase.fetchMany = function(options, cb) {
    var _this = this;
    options.table = options.table || this.table;
    var stm = sqlHelper.generateSql(ACTION.SELECT, options);
    //console.log('fetchMnay: ', stm);
    return dbClient.query(stm.sql, stm.args, function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when fetch " + _this.table + "]", stm);
        logger.error(err.stack);
        return cb({
          code: err.code,
          msg: err.message
        });
      }

      if ( !! res && res.length > 0) {
        return cb(null, res.map(function(data) {
          var entity = new _this.domain(data);
          if (options.sync) {
            addSyncEvent(_this.syncKey, entity);
          }
          return entity;
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
        logger.error("[SQL ERROR, when update " + _this.table + "s]", err.stack);
        return cb({
          code: err.code,
          msg: err.message
        });
      }

      if ( !! res && res.affectedRows > 0) {
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

      if ( !! res && res.affectedRows > 0) {
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
        logger.error("[SQL ERROR, when query " + _this.table + "s]", err.stack);
        return cb({
          code: err.code,
          msg: err.message
        });
      }

      if ( !! res && res.length > 0) {
        return cb(null, res.map(function(data) {
          return new _this.domain(data);
        }));
      } else {
        return cb(null, []);
      }
    });
  };

  DaoBase.exists = function(options, cb) {
    var _this = this;
    options.table = options.table || this.table;
    var stm = sqlHelper.generateSql(ACTION.EXISTS, options);

    return dbClient.query(stm.sql, stm.args, function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when query " + _this.table + "s]", err.stack);
        return cb({
          code: err.code,
          msg: err.message
        });
      }

      if ( !! res && res.length > 0) {
        return cb(null, !! res[0].exist);
      } else {
        return cb(null, false);
      }
    });
  };

  return DaoBase;
})();

module.exports = DaoBase;