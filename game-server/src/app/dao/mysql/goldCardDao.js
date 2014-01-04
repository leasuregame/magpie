var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var GoldCardDao = (function(_super) {
  utility.extends(GoldCardDao, _super);

  function GoldCardDao() {
    GoldCardDao.__super__.constructor.apply(this, arguments);
  }

  GoldCardDao.table = 'goldCard';

  var domain = function(attrs) {
    this.id = attrs.id;
    thid.orderId = attrs.orderId;
    this.playerId = attrs.playerId;
    this.type = attrs.type;
    this.flag = attrs.flag;
    this.created = attrs.created;
    this.validDate = attrs.validDate;
  };
  domain.DEFAULT_VALUES = {
    flag: 0,
    type: ''
  };
  domain.FIELDS = ['id', 'orderId', 'playerId', 'type', 'flag', 'created', 'validDate'];
  GoldCardDao.domain = domain;

  return GoldCardDao;
})(DaoBase);

module.exports = GoldCardDao;