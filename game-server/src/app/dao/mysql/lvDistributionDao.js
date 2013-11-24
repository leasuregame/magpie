var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");
var async = require('async');

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
		this.playerCreateDate = attrs.playerCreateDate;
	};
	domain.DEFAULT_VALUES = {
		qty: 0,
		createTime: 0
	};
	domain.FIELDS = ['id', 'createTime', 'qty', 'lv', 'playerCreateDate'];
	lvDistributionDao.domain = domain;

	lvDistributionDao.analyseLvDistribution = function(){
		var sql = 'select lv, count(id) as qty, Date(created) as playerCreateDate from player group by lv, playerCreateDate';
		dbClient.query(sql, [], function(err, results) {
			if (err) {
				logger.error('faild to get lv distribution', err);
			}

			if (!!results && results.length > 0) {
				async.each(results, function(row, done){
					var data = {
						createTime: utility.dateFormat(new Date(), "yyyy-MM-dd"),
						lv: row.lv,
						qty: row.qty,
						playerCreateDate: row.playerCreateDate
					};
					dbClient.query('insert into lvDistribution set ?', data, function(err, res) {
						if (err) {
							done(err)
						} else {
							done()
						}
					});
				}, function(err) {
					if (err) {
						logger.error('faild to create lv distribution with error: ', err);
					}
				});
			} else {
				logger.warn('can not find any lv distribution record.')
			}
		});
	};

	return lvDistributionDao;
})(DaoBase);

module.exports = lvDistributionDao;

//select lv, count(id) as qty from player where createTime between 1385222400000 and 1403971200000 group by lv  
