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

  DamageOfRankDao.getRank = function(playerId, week, cb) {
        dbClient.query(
            'select c.rank, c.damage from ( ' +
                'select @rank:=@rank+1 as rank, a.* from ( ' +
                   'select e.playerId, e.damage from damageOfRank e where week = ? order by damage DESC ' +
                ') as a, (select @rank:=0) as b ' +
            ') c where c.playerId = ?', 
        [week, playerId], 
        function(err, res) {
            if (err) {
               return cb(err);
            } 

            if (!!res && res.length > 0) {
                return cb(null, res[0]);
            } else {
                return cb(null, null);
            }
        });
    };

    DamageOfRankDao.thisWeekDamageRank = function(cb) {
        dbClient.query('select playerId, name, damage, kneelCount from damageOfRank where week = ? order by damage DESC limit 5', [utility.thisWeek()], cb)
    };

    DamageOfRankDao.lastWeekDamageRank = function(cb) {
        dbClient.query('select playerId, name, damage, kneelCount from damageOfRank where week = ? order by damage DESC limit 5', [utility.lastWeek()], cb)
    };

    DamageOfRankDao.updateKneelCount = function(playerId, cb) {
      dbClient.query('update damageOfRank set kneelCount = kneelCount + 1 where playerId = ? and week = ?', [playerId, utility.thisWeek()], cb);
    };

  return DamageOfRankDao;
})(DaoBase);

module.exports = DamageOfRankDao;