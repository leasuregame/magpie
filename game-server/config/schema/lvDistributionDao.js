var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var LvDistributionDao = (function(_super) {
	utility.extends(LvDistributionDao, _super);

	function LvDistributionDao() {
		LvDistributionDao.__super__.constructor.apply(this, arguments);
	}

	LvDistributionDao.table = 'friend';

	var domain = function(attrs) {
		this.id = attrs.id;
		this.createTime = attrs.createTime;
		this.qty = attrs.qty;
	};
	domain.DEFAULT_VALUES = {
		qty: 0,
		createTime: 0
	};
	domain.FIELDS = ['id', 'createTime', 'qty'];
	LvDistributionDao.domain = domain;

	return LvDistributionDao;
})(DaoBase);

module.exports = LvDistributionDao;