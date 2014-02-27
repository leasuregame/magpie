var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");
var Boss = require("../../doamin/entity/boss");

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
  BuyRecordDao.domain = domain;

  return BossAttackDao;
})(DaoBase);

module.exports = BossAttackDao;