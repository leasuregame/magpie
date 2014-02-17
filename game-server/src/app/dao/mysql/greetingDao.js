var sqlHelper = require("./sqlHelper");
var app = require("pomelo").app;
var dbClient = app.get("dbClient");
var logger = require("pomelo-logger").getLogger(__filename);
var BattleLog = require("../../domain/entity/battleLog");
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");


var GreetingDao = (function(_super) {
  utility.extends(GreetingDao, _super);

  function GreetingDao() {
    GreetingDao.__super__.constructor.apply(this, arguments);
  }

  var domain = function(attrs) {
    this.id = attrs.id;
    this.playerId = attrs.playerId;
    this.playerName = attrs.playerName;
    this.content = attrs.content;
    this.created = attrs.created;
  };

  domain.DEFAULT_VALUES = {
    content: ''
  };
  domain.FIELDS = ['id', 'playerId', 'playerName', 'content', 'created'];

  GreetingDao.table = 'greeting';
  GreetingDao.domain = domain;

  return GreetingDao;
})(DaoBase);

module.exports = GreetingDao;