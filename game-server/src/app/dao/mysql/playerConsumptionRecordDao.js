var app = require('pomelo').app;
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var playerConsumptionRecordDao = (function (_super) {
    utility.extends(ConsumptionRecordDao, _super);

    function ConsumptionRecordDao() {
        ConsumptionRecordDao.__super__.constructor.apply(this, arguments);
    }

    ConsumptionRecordDao.table = 'playerConsumptionRecord';

    var domain = function(attrs) {
        this.id = attrs.id;
        this.playerId = attrs.playerId;
        this.resourceType = attrs.resourceType;
        this.expense = attrs.expense;
        this.source = attrs.source;
        this.createTime = attrs.createTime;
    };
    domain.DEFAULT_VALUES = {};
    domain.FIELDS = ['id', 'playerId', 'resourceType', 'expense', 'source', 'createTime'];
    ConsumptionRecordDao.domain = domain;

    ConsumptionRecordDao.createRecord = function(options, cb){
        options.data.createTime = utility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
        this.create(options, cb);
    };

    return ConsumptionRecordDao;
})(DaoBase);

module.exports = playerConsumptionRecordDao;