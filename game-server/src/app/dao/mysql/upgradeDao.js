var app = require("pomelo").app;
var dbClient = app.get("dbClient");
var logger = require("pomelo-logger").getLogger(__filename);
var utility = require("../../common/utility");

var DaoBase = require("./daoBase");

var UpgradeDao = (function (_super) {
    utility.extends(UpgradeDao, _super);

    function UpgradeDao() {
        UpgradeDao.__super__.constructor.apply(this, arguments);
    }

    UpgradeDao.table = 'upgradeVersion';
    var domain = function(attrs) {
        this.id = attrs.id;
        this.version = attrs.version;
        this.path = attrs.path;
    };
    domain.DEFAULT_VALUES = { };

    domain.FIELDS = ['id', 'version', 'path'];
    UpgradeDao.domain = domain;

    return UpgradeDao;
})(DaoBase);

module.exports = UpgradeDao;