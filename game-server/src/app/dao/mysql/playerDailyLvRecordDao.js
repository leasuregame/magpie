var app = require('pomelo').app;
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var playerDailyLvRecordDao = (function (_super) {
    utility.extends(LvRecordDao, _super);

    function LvRecordDao() {
        LvRecordDao.__super__.constructor.apply(this, arguments);
    }

    LvRecordDao.table = 'playerDailyLvRecord';

    var domain = function(attrs) {
        this.id = attrs.id;
        this.playerId = attrs.playerId;
        this.recordDate = attrs.recordDate;
        this.playerLv = attrs.playerLv;
        this.loginCount = attrs.loginCount;
        this.createTime = attrs.createTime;
    };
    domain.DEFAULT_VALUES = {};
    domain.FIELDS = ['id', 'playerId', 'recordDate', 'playerLv', 'loginCount', 'createTime'];
    LvRecordDao.domain = domain;

    LvRecordDao.createRecord = function(options, cb){
        options.data.createTime = utility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
        this.create(options, cb);
    };

    return LvRecordDao;
})(DaoBase);

module.exports = playerDailyLvRecordDao;