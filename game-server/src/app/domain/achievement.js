var table = require('../manager/table');
var logger = require('pomelo-logger').getLogger(__filename);
var utility = require('../common/utility');
var _ = require('underscore');

Achievement = function() {}

Achievement.levelTo = function(player, lv) {
	checkIsReached(player, 'levelTo', lv);
};

Achievement.passTo = function(player, layer) {
	checkIsReached(player, 'passTo', layer);
};

Achievement.winCount = function(player, ranking) {
	checkIsReached(player, 'winCount', ranking);
};

Achievement.winningStreak = function(player, ranking) {
	checkIsReached(player, 'winningStreak', ranking);
};

Achievement.rankingTo = function(player, rk) {
	checkIsReached(player, 'rankingTo', rk)
};

Achievement.friends = function(player, count) {
	checkIsReached(player, 'friends', count);
};

var checkIsReached = function(player, method, need) {
	var id = reachedAchievementId(method, need);
	if (id) {
		reachAchievement(player, id);
	} else {
		updateAchievement(player, method, need);
	}
};

var updateAchievement = function(player, method, got) {
	var ach = utility.deepCopy(player.achievement);
	var items = _.where(_.values(ach), {
		method: method
	});
	if (!_.isEmpty(items)) {
		items.forEach(function(i) {
			i.got = got;
		})
	} else {
		table.getTable('achievement')
			.filter(function(id, row) {
				return row.method == method;
			})
			.forEach(function(r) {
				if (_.isUndefined(ach[r.id])) {
					ach[r.id] = {
						method: r.method,
						isAchieve: false,
						got: got,
						need: r.args
					}
				}
			});
	}
	// reset achievement of player
	player.achievement = ach;
};

var reachedAchievementId = function(methodName, need) {
	var rows = table.getTable('achievement').filter(function(id, row) {
		return row.method == methodName;
	});

	var reached = _.findWhere(rows, {
		args: need
	});
	return !_.isUndefined(reached) ? reached.id : null;
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

module.exports = Achievement;