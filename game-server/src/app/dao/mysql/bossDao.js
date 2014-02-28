var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");
var Boss = require("../../domain/entity/boss");

var BossDao = (function(_super) {
  utility.extends(BossDao, _super);

  function BossDao() {
    BossDao.__super__.constructor.apply(this, arguments);
  }

  BossDao.table = 'boss';
  BossDao.domain = Boss;

  return BossDao;
})(DaoBase);

module.exports = BossDao;