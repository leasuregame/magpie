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

  GreetingDao.getLatest = function(limit, cb) {
    var sql = "select g.playerId, g.playerName, g.content, g.created, p.vip \
      from greeting g \
      left join player p on g.playerId = p.id \
      order by g.created DESC \
      limit ?";
    dbClient.query(sql, [limit], cb);
  };

  return GreetingDao;
})(DaoBase);

module.exports = GreetingDao;