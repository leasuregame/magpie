var Rank = require('../../domain/entity/rank');
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");
var dbClient = require('pomelo').app.get('dbClient');

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
        var sql = "select ranking from rank where id in (" + pids.toString() + ")";
        dbClient.query(sql,[],cb);
    };

    RankDao.getPidsByRankings = function(rankings, cb) {
        var sql = "select playerId,ranking from rank where ranking in (" + rankings.toString() + ")";
        dbClient.query(sql,[],cb);
    };

    RankDao.select = RankDao.fetchMany;

    return RankDao;
})(DaoBase);

module.exports = RankDao;