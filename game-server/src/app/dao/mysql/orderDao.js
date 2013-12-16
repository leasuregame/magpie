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
		this.tradeNo = attrs.tradeNo,
		this.playerId = attrs.playerId,
		this.amount = attrs.amount,
		this.partner = attrs.partner,
		this.paydes = attrs.paydes,
		this.created = attrs.created
	};
	domain.DEFAULT_VALUES = {};
	domain.FIELDS = ['tradeNo', 'playerId', 'amount', 'partner', 'paydes', 'created'];
	TbOrderDao.domain = domain;

	return TbOrderDao;
})(DaoBase);

module.exports = TbOrderDao;