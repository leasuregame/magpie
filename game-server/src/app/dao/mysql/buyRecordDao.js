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
		this.isVerify = attrs.isVerify;
	};
	domain.DEFAULT_VALUES = {};
	domain.FIELDS = ['id', 'createTime', 'qty', 'playerId', 'receiptData', 'productId', 'purchaseDate', 'isVerify'];
	BuyRecordDao.domain = domain;

	return BuyRecordDao;
})(DaoBase);

module.exports = BuyRecordDao;