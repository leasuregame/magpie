var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var DamageOfRankDao = (function(_super) {
  utility.extends(DamageOfRankDao, _super);

  function DamageOfRankDao() {
    DamageOfRankDao.__super__.constructor.apply(this, arguments);
  }

  DamageOfRankDao.table = 'damageOfRank';
  
  var domain = function(attrs) {
    this.playerId = attrs.playerId;
    this.damage = attrs.damage;
    this.name = attrs.name;
    this.week = attrs.week;
    this.kneelCount = attrs.kneelCount;
    this.got = attrs.got;
  };
  domain.DEFAULT_VALUES = {};
  domain.FIELDS = ['id', 'damage', 'playerId', 'kneelCount', 'got', 'week', 'name'];
  DamageOfRankDao.domain = domain;

  return DamageOfRankDao;
})(DaoBase);

module.exports = DamageOfRankDao;