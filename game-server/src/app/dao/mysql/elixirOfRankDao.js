var app = require("pomelo").app;
var dbClient = app.get("dbClient");
var logger = require("pomelo-logger").getLogger(__filename);
var utility = require("../../common/utility");

var DaoBase = require("./daoBase");

var ElixirOfRankDao = (function (_super) {
    utility.extends(ElixirOfRankDao, _super);

    function ElixirOfRankDao() {
        ElixirOfRankDao.__super__.constructor.apply(this, arguments);
    }

    ElixirOfRankDao.table = 'elixirOfRank';
    var domain = function(attrs) {
        this.playerId = attrs.playerId;
        this.week = attrs.week;
        this.name = attrs.name;
        this.elixir = attrs.elixir;
        this.got = attrs.got;
    };
    domain.DEFAULT_VALUES = {
        elixir: 0,
        got: 0
    };

    domain.FIELDS = ['playerId', 'week', 'name', 'elixir', 'got'];
    ElixirOfRankDao.domain = domain;

    ElixirOfRankDao.getRank = function(playerId, week, cb) {
        dbClient.query(
            'select c.rank, c.elixir from ( ' +
                'select @rank:=@rank+1 as rank, a.* from ( ' +
                   'select e.playerId, e.elixir from elixirOfRank e where week = ? order by elixir DESC ' +
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

    ElixirOfRankDao.thisWeekElixirRank = function(cb) {
        dbClient.query('select playerId, name, elixir from elixirOfRank where week = ? order by elixir DESC limit 50', [utility.thisWeek()], cb)
    };

    ElixirOfRankDao.lastWeekElixirRank = function(cb) {
        dbClient.query('select playerId, name, elixir from elixirOfRank where week = ? order by elixir DESC limit 50', [utility.lastWeek()], cb)
    };

    return ElixirOfRankDao;
})(DaoBase);

module.exports = ElixirOfRankDao;

//SELECT t.*, @rownum := @rownum + 1 AS rowNumber FROM (select * from rank r order by r.ranking) t, (SELECT @rownum := 0) A

// set @rank=0; select a.rank from (select @rank:=@rank+1 as rank, playerId from elixirOfRank where week = 201407 order by elixir DESC) as a where a.playerId = 101

// SET @rank=0; select a.* from (SELECT @rank:=@rank+1 AS rank, uid, name, feng FROM fengshu ORDER BY feng DESC) as a order by a.name;