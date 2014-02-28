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

  BossDao.bossList = function(playerId, friendIds, cb) {
    var now = new Date().getTime();
    
    var tmpl = 'select * from boss where playerId = %(playerId)s and status in (1,2) and createTime + 50400000 > %(now)s \
      union \
      select * from boss where playerId in (%(friendIds)s) and status = 2 and createTime + 50400000 >  %(now)s\
      union \
      select * from boss where playerId in (%(allIds)s) and status in (3,5) and deathTime + 7200000 > %(now)s';
   
    var sql = sprintf(tmpl, {
      playerId: playerId,
      now: now.toString(),
      friendIds: friendIds.toString(),
      allIds: friendIds.concat([playerId]).toString()
    });

    console.log(sql);

    dbClient.query(sql, function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when fetch boss list " + BossDao.table + "]", stm);
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

  return BossDao;
})(DaoBase);

module.exports = BossDao;