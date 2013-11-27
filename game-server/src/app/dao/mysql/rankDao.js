var Rank = require('../../domain/entity/rank');
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");
var dbClient = require('pomelo').app.get('dbClient');

var RankDao = (function(_super) {
    utility.extends(RankDao, _super);

    function RankDao() {
        RankDao.__super__.constructor.apply(this, arguments);
    }

    RankDao.table = 'rank';
    RankDao.domain = Rank;
    RankDao.syncKey = 'rankSync.updateRank';

    RankDao.createRank = RankDao.create;
    RankDao.getRank = RankDao.fetchOne;

    RankDao.top10 = function(cb) {
        this.fetchMany({
            orderby: 'ranking',
            limit: 10
        }, cb);
    };

    RankDao.getRankingsByPids = function(pids, cb) {
        var sql = "select ranking from rank where id in (" + pids.toString() + ")";
        dbClient.query(sql, [], cb);
    };

    RankDao.getPidsByRankings = function(rankings, cb) {
        var sql = "select playerId,ranking from rank where ranking in (" + rankings.toString() + ")";
        dbClient.query(sql, [], cb);
    };

    RankDao.initRankingInfo = function(pid, cb) {
        var sql = "select max(ranking) + 1 as next_ranking from rank";
        dbClient.query(sql, [], function(err, res) {
            if (err) {
                return cb(err);
            }
            console.log('init ranking : ', res);
            if ( !! res && res.length > 0) {
                RankDao.create({
                    data: {
                        playerId: pid,
                        ranking: res[0].next_ranking
                    }
                }, function(err, rank) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, rank);
                });
            } 

        });
    };

    RankDao.select = RankDao.fetchMany;

    return RankDao;
})(DaoBase);

module.exports = RankDao;