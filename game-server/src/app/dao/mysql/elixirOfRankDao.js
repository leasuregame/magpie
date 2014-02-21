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

    return ElixirOfRankDao;
})(DaoBase);

module.exports = ElixirOfRankDao;