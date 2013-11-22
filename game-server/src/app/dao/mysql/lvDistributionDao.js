var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var lvDistributionDao = (function(_super) {
	utility.extends(lvDistributionDao, _super);

	function lvDistributionDao() {
		lvDistributionDao.__super__.constructor.apply(this, arguments);
	}

	lvDistributionDao.table = 'lvDistribution';

	var domain = function(attrs) {
		this.id = attrs.id;
		this.createTime = attrs.createTime;
		this.qty = attrs.qty;
		this.lv = attrs.lv;
		this.playerCreateTime = attrs.playerCreateTime;
	};
	domain.DEFAULT_VALUES = {
		qty: 0,
		createTime: 0
	};
	domain.FIELDS = ['id', 'createTime', 'qty', 'lv', 'playerCreateTime'];
	lvDistributionDao.domain = domain;

	return lvDistributionDao;
})(DaoBase);

module.exports = lvDistributionDao;