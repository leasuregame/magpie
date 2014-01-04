var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");
var GoldCard = require('../../domain/entity/goldCard');

var GoldCardDao = (function(_super) {
  utility.extends(GoldCardDao, _super);

  function GoldCardDao() {
    GoldCardDao.__super__.constructor.apply(this, arguments);
  }

  GoldCardDao.table = 'goldCard';
  GoldCardDao.domain = GoldCard;

  return GoldCardDao;
})(DaoBase);

module.exports = GoldCardDao;