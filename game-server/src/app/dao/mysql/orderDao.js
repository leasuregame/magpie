var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var TbOrderDao = (function(_super) {
	utility.extends(TbOrderDao, _super);

	function TbOrderDao() {
		TbOrderDao.__super__.constructor.apply(this, arguments);
	}

	TbOrderDao.table = 'tbOrder';

	var domain = function(attrs) {
		this.tradeNo = attrs.tradeNo;
		this.tborderNo = attrs.tborderNo;
		this.playerId = attrs.playerId;
		this.amount = attrs.amount;
		this.partner = attrs.partner;
		this.paydes = attrs.paydes;
		this.status = attrs.status;
		this.created = attrs.created;
	};
	domain.DEFAULT_VALUES = {};
	domain.FIELDS = ['tradeNo', 'tborderNo', 'playerId', 'amount', 'partner', 'paydes', 'status', 'created'];
	TbOrderDao.domain = domain;

	TbOrderDao.rechargeOnPeriod = function(playerId, startDate, endDate, cb) {
		var sql = 'select sum(amount)/100 as cash from tbOrder where playerId = ? and created between ? and ?';
		dbClient.query(sql, [playerId, startDate, endDate], function(err, res) {
			if (err) {
				logger.error("[SQL ERROR, when query tborder]", sql);
				logger.error(err.stack);
				return cb({
					code: err.code,
					msg: err.message
				});
			}

			if ( !! res && res.length > 0) {
				cb(null, res[0].cash);
			} else {
				cb(null, 0);
			}
		});

	};

	return TbOrderDao;
})(DaoBase);

module.exports = TbOrderDao;