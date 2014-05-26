var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");
var Boss = require("../../domain/entity/boss");
var sprintf = require('sprintf-js').sprintf;

var BossDao = (function(_super) {
  utility.extends(BossDao, _super);

  function BossDao() {
    BossDao.__super__.constructor.apply(this, arguments);
  }

  BossDao.table = 'boss';
  BossDao.domain = Boss;

  /*
      Boss状态: 
        SLEEP: 1,     沉睡
        AWAKE: 2,     苏醒
        RUNAWAY: 3,   逃跑
        TIMEOUT: 4,   超时
        DEATH: 5,     死亡
        DISAPPEAR: 6  消失
   */
  BossDao.bossList = function(playerId, friendIds, cb) {
    var now = new Date().getTime();

    var tmpl = 'select * from boss where \
      (playerId = %(playerId)s and status in (1,2,4) and createTime + 50400000 > %(now)s) or \
      (playerId in (%(allIds)s) and status in (3,5) and deathTime + 7200000 > %(now)s)';
   
    var sql = sprintf(tmpl, {
      playerId: playerId,
      now: now.toString(),
      allIds: friendIds.concat([playerId]).toString()
    });

    if (!!friendIds && friendIds.length > 0) {
      sql += ' or ' + sprintf('(playerId in (%(friendIds)s) and (status = 2 or (status = 4 and atkCount > 0)) and createTime + 50400000 >  %(now)s)', { 
            now: now.toString(), 
            friendIds: friendIds.toString() 
      });
    }

    dbClient.query(sql, [], function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when fetch boss list " + BossDao.table + "]");
        logger.error(err.stack);
        return cb({
          code: err.code,
          msg: err.message
        });
      }

      if ( !! res && res.length > 0) {
        return cb(null, res.map(function(data) {
          var entity = new BossDao.domain(data);
          return entity;
        }));
      } else {
        return cb(null, []);
      }
    }); 
  };

  BossDao.bossExists = function(playerId, cb) {
    var now = new Date().getTime();

    // 获取状态位沉睡或苏醒的，未超时的boss（12小时以内）
    var tmpl = 'select count(id) as num from boss where \
      playerId = %(playerId)s and (status in (1,2) and createTime + 43200000 > %(now)s)';
      //or (status in (3,5) and deathTime + 7200000 > %(now)s)';
    var sql = sprintf(tmpl, {playerId: playerId, now: now});
    dbClient.query(sql, [], function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when fetch boss count by playerId " + playerId + "]");
        logger.error(err.stack);
        return cb({
          code: err.code,
          msg: err.message
        });
      }

      if (!!res && res.length > 0) {
        cb(null, !!res[0].num);
      } else {
        cb(null, false);
      }

    });
  };

  return BossDao;
})(DaoBase);

module.exports = BossDao;