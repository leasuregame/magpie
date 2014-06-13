var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var WorldCupDao = (function(_super) {
  utility.extends(WorldCupDao, _super);

  function WorldCupDao() {
    WorldCupDao.__super__.constructor.apply(this, arguments);
  }

  WorldCupDao.table = 'worldCup';

  var domain = function(attrs) {
    this.id = attrs.id;
    this.playerId = attrs.playerId;
    this.gameDate = attrs.gameDate;
    this.answer = JSON.parse(attrs.answer);
    this.got = attrs.got;
    this.created = attrs.created;
  };
  domain.DEFAULT_VALUES = {bingo: false, got: 0};
  domain.FIELDS = ['id', 'playerId', 'gameDate', 'answer', 'got', 'created', 'bingo'];
  WorldCupDao.domain = domain;

  return WorldCupDao;
})(DaoBase);

module.exports = WorldCupDao;