var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var BossAttackDao = (function(_super) {
  utility.extends(BossAttackDao, _super);

  function BossAttackDao() {
    BossAttackDao.__super__.constructor.apply(this, arguments);
  }

  BossAttackDao.table = 'bossAttack';
  
  var domain = function(attrs) {
    this.id = attrs.id;
    this.bossId = attrs.bossId;
    this.playerId = attrs.playerId;
    this.damage = attrs.damage;
    this.money = attrs.money;
    this.honor = attrs.honor;
    this.moneyAdd = attrs.moneyAdd;
    this.honorAdd = attrs.honorAdd;
    this.battleLogId = attrs.battleLogId;
  };
  domain.DEFAULT_VALUES = {};
  domain.FIELDS = ['id', 'bossId', 'damage', 'playerId', 'money', 'honor', 'moneyAdd', 'honorAdd', 'battleLogId'];
  BossAttackDao.domain = domain;

  BossAttackDao.getByBossId = function(bossId, cb) {
    var sql = 'select b.playerId, p.name as attacker, b.damage, b.money, b.honor, b.moneyAdd, b.honorAdd, b.battleLogId from bossAttack b\
      join player p on b.playerId = p.id \
      where b.bossId = ' + bossId;
    dbClient.query(sql, [], function(err, res) {
      if (err) {
        logger.error('[SQL ERROR] when query bossAttack by bossId ' + bossId);
        return cb({
          code: err.code,
          msg: err.message
        });
      }

      if (!!res && res.length > 0) {
        cb(null, res);
      } else {
        cb(null, []);
      }
    });
  };

  return BossAttackDao;
})(DaoBase);

module.exports = BossAttackDao;