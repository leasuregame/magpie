var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var BossFriendRewardDao = (function(_super) {
  utility.extends(BossFriendRewardDao, _super);

  function BossFriendRewardDao() {
    BossFriendRewardDao.__super__.constructor.apply(this, arguments);
  }

  BossFriendRewardDao.table = 'bossFriendReward';
  
  var domain = function(attrs) {
    this.id = attrs.id;
    this.playerId = attrs.playerId;
    this.friendName = attrs.friendName;
    this.money = attrs.money;
    this.honor = attrs.week;
    this.created = attrs.created;
    this.got = attrs.got; 
  };
  domain.DEFAULT_VALUES = {};
  domain.FIELDS = ['id', 'friendName', 'playerId', 'money', 'got', 'honor', 'created'];
  BossFriendRewardDao.domain = domain;

  BossFriendRewardDao.getReward = function(playerId, cb) {
    var sql = "select sum(money) as money, sum(honor) as honor from bossFriendReward \
      where playerId = ? and got = 0";

    dbClient.query(sql, [playerId], function(err, res) {
      if (err) {
        logger.error('[SQL ERROR] when get reward from bossFriendReward by playerId ' + playerId);
        cb({
          code: err.code,
          msg: err.message
        });
      }

      if (!!res && res.length > 0) {
        cb(null, res[0]);
      } else {
        cb(null, null);
      }

    });
  };

  BossFriendRewardDao.rewardList = function(playerId, cb) {
    var sql = "select friendName as name, money, honor \
      from bossFriendReward \
      where playerId = ? and got = 0 \
      order by created DESC \
      limit 50";

    dbClient.query(sql, [playerId], function(err, res) {
      if (err) {
        logger.error('[SQL ERROR] when get friend reward list by player id ' + playerId);
        logger.error(err.stack);
        cb({
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

  return BossFriendRewardDao;
})(DaoBase);

module.exports = BossFriendRewardDao;