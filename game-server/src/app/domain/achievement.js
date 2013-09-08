var table = require('../manager/table');
var logger = require('pomelo-logger').getLogger(__filename);
var utility = require('../common/utility');
var _ = require('underscore');
var Achievement = module.exports;

Achievement = function() {}

Achievement.levelTo = function(player, lv) {
	checkIsReached(player, 'levelTo', lv);
};

Achievement.passTo = function(player, layer) {
	checkIsReached(player, 'passTo', layer);
};

Achievement.winCount = function(player, count) {
	var idMap = {
		50: 5,
		5000: 6
	};
	if (palyer.rank.counts.win == count) {
		reachAchievement(player, idMap[layer]);
	}
};

Achievement.winningStreak = function(player, count) {
	var id = 7;
	if (player.rank.counts.winningStreak == count) {
		reachAchievement(player, id);
	}
};

Achievement.rankingTo = function(player, rk) {
	var id = 8;
	if (player.rank.ranking == rk) {
		reachAchievement(player, id);
	}
};

Achievement.friends = function(player, count) {
	var id = 10;

};

var checkIsReached = function(player, method, need) {
	var id = reachedAchievementId(method, need);
	if (id) {
		reachAchievement(player, id);
	} else {
		updateAchievement(player, method, need);
	}
};

var updateAchievement = (player, method, got) {
	var ach = utility.deepCopy(player.achievement);
	var items = _.where(_.values(ach), {method: method});
	if (!_.isEmpty(items)) {
		items.forEach(function(i) {
			i.got = got;
		})
	}
	// reset achievement of player
	player.achievement = ach;
};

var reachedAchievementId = function(methodName, need) {
		var rows = table.getTable('achievement').filter(function(row) {
			return row.method = methodName;
		});
		var reached = _.findWhere(rows, {need: need});
		return reached !== null ? reached.id : null;
	};

var reachAchievement = function(player, id) {
	data = table.getTableItem('achievement', id);
	if (data) {
		player.increase('gold', data.gold);
		player.increase('energy', data.energy);
		player.achieve(id);
		player.save();
	} else {
		logger.warn('can not find achievement data by id ' + id);
	}
	
};