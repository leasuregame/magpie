var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var BackendRechargeDao = (function(_super) {
    utility.extends(BackendRechargeDao, _super);

    function BackendRechargeDao() {
        BackendRechargeDao.__super__.constructor.apply(this, arguments);
    }

    BackendRechargeDao.table = 'backendRecharge';

    var domain = function(attrs) {
        this.id = attrs.id;
        this.playerId = attrs.playerId;
        this.type = attrs.type;
        this.productId = attrs.productId;
        this.qty = attrs.qty;
        this.amount = attrs.amount;
        this.gain = attrs.gain;
        this.createTime = attrs.createTime;
    };
    domain.DEFAULT_VALUES = {};
    domain.FIELDS = ['id', 'playerId', 'type', 'productId', 'qty', 'amount', 'gain', 'createTime'];
    BackendRechargeDao.domain = domain;

    BackendRechargeDao.createRecharge = function(options, cb){
        options.data.createTime = utility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
        this.create(options, cb);
    };

    return BackendRechargeDao;
})(DaoBase);

module.exports = BackendRechargeDao;