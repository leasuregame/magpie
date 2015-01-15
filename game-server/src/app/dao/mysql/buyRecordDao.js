var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var BuyRecordDao = (function(_super) {
	utility.extends(BuyRecordDao, _super);

	function BuyRecordDao() {
		BuyRecordDao.__super__.constructor.apply(this, arguments);
	}

	BuyRecordDao.table = 'buyRecord';

	var domain = function(attrs) {
		this.id = attrs.id;
		this.createTime = attrs.createTime;
		this.qty = attrs.qty;
		this.playerId = attrs.playerId;
		this.receiptData = attrs.receiptData;
		this.productId = attrs.productId;
		this.purchaseDate = attrs.purchaseDate;
        this.amount = attrs.amount;
		this.isVerify = attrs.isVerify;
		this.status = attrs.status;
	};
	domain.DEFAULT_VALUES = {isVerify: 0};
	domain.FIELDS = ['id', 'createTime', 'amount', 'qty', 'playerId', 'receiptData', 'productId', 'purchaseDate', 'isVerify', 'status', 'verifyResult'];
	BuyRecordDao.domain = domain;

    BuyRecordDao.rechargeOnPeriod = function(playerId, startDate, endDate, cb) {
        var sql = 'select sum(amount) as cash from buyRecord where status = 0 and playerId = ? and date(purchaseDate) between ? and ?';
        dbClient.query(sql, [playerId, startDate, endDate], function(err, res) {
            if (err) {
                logger.error("[SQL ERROR, when query tborder]", sql);
                logger.error(err.stack);
                return cb({
                    code: err.code,
                    msg: err.message
                });
            }
            console.log(err, res);

            if ( !! res && res.length > 0) {
                cb(null, res[0].cash);
            } else {
                cb(null, 0);
            }
        });
    };

    BuyRecordDao.amountGroupByDate = function(playerId, dates, cb) {
        var sql = "select sum(amount) cash from buyRecord where status = 0 and date(purchaseDate) in (" +
            dates.map(function(d) {return "'"+d+"'";}).join(',') +
            ") group by date(purchaseDate)";
        console.log(sql);
        dbClient.query(sql, [], function(err, res) {
            if (err) {
                logger.error("[SQL ERROR, when query tborder]", sql);
                logger.error(err.stack);
                return cb({
                    code: err.code,
                    msg: err.message
                });
            }
            console.log(err, res);

            if ( !! res && res.length > 0) {
                cb(null, res);
            } else {
                cb(null, []);
            }
        });
    };

	return BuyRecordDao;
})(DaoBase);

module.exports = BuyRecordDao;