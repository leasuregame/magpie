var Rank = require('../../domain/entity/rank');
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var RankDao = (function (_super) {
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

    RankDao.getRankingsByPids = function(pids,cb) {

        this.fetchMany({
            where: " playerId in (" + pids.toString() + ")",
            fields: ['ranking']
        },cb)

    };

    RankDao.getPidsByRankings = function(rankings, cb) {
        var start = Date.now();
        this.fetchMany({
            where: " ranking in (" + rankings.toString() + ")",
            fields: ['playerId','ranking']
        },function(err,plys){
            var end = Date.now();
            console.log('get get Pids By Rankings: ', (end - start)/1000);
            cb(err,plys);
        });

    }

    RankDao.select = RankDao.fetchMany;

    return RankDao;
})(DaoBase);

module.exports = RankDao;