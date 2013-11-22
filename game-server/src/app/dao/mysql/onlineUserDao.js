var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var OnlineUserDao = (function(_super) {
	utility.extends(OnlineUserDao, _super);

	function OnlineUserDao() {
		OnlineUserDao.__super__.constructor.apply(this, arguments);
	}

	OnlineUserDao.table = 'friend';

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
	OnlineUserDao.domain = domain;

	return OnlineUserDao;
})(DaoBase);

module.exports = OnlineUserDao;