var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");
var Boss = require("../../doamin/entity/boss");

var BossFriendRewardDao = (function(_super) {
  utility.extends(BossFriendRewardDao, _super);

  function BossFriendRewardDao() {
    BossFriendRewardDao.__super__.constructor.apply(this, arguments);
  }

  BossFriendRewardDao.table = 'bossFriendReward';
  
  var domain = function(attrs) {
    this.id = attrs.id;
    this.playerId = attrs.playerId;
    this.friendId = attrs.friendId;
    this.money = attrs.money;
    this.honor = attrs.week;
    this.created = attrs.created;
    this.got = attrs.got; 
  };
  domain.DEFAULT_VALUES = {};
  domain.FIELDS = ['id', 'friendId', 'playerId', 'money', 'got', 'honor', 'created'];
  BuyRecordDao.domain = domain;

  return BossFriendRewardDao;
})(DaoBase);

module.exports = BossFriendRewardDao;