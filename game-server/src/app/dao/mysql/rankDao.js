var Rank = require('../../domain/rank');
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

    RankDao.select = RankDao.fetchMany;

    return RankDao;
})(DaoBase);

module.exports = RankDao;