var table = require('../manager/table');
var logger = require('pomelo-logger').getLogger(__filename);
var utility = require('../common/utility');
var messageService = null;

var app = require('pomelo').app;
if (typeof app !== "undefined" && app !== null) {
    messageService = app.get('messageService');
}

var _ = require('underscore');

Achievement = function() {}

Achievement.levelTo = function(player, lv) {
	checkIsReached(player, 'levelTo', lv);
};

Achievement.passTo = function(player, layer) {
	checkIsReached(player, 'passTo', layer);
};

Achievement.winCount = function(player, count) {
	checkIsReached(player, 'winCount', count);
};

Achievement.winningStreak = function(player, count) {
	checkIsReached(player, 'winningStreak', count);
};

Achievement.rankingToOne = function(player) {
	checkIsReached(player, 'rankingToOne', 1);
};

Achievement.friends = function(player, count) {
	checkIsReached_alpha(player, 'friends', count);
};

Achievement.elixirTo = function(player, eli) {
	checkIsReached_alpha(player, 'elixirTo', eli);
};

Achievement.energyTo = function(player, energy) {
	checkIsReached_alpha(player, 'energyTo', energy);
};

Achievement.powerConsume = function(player, power) {
	checkIsReached_alpha(player, 'powerConsume', power);
};

Achievement.moneyConsume = function(player, money) {
	checkIsReached_alpha(player, 'moneyConsume', money);
};

Achievement.goldConsume = function(player, gold) {
	checkIsReached_alpha(player, 'goldConsume', gold);
};

Achievement.gaveBless = function(player) {
	checkIsReached_alpha(player, 'gaveBless', 1);
};

Achievement.receivedBless = function(player) {
	checkIsReached_alpha(player, 'receivedBless', 1);
};

Achievement.vip = function(player) {
	checkIsReached_alpha(player, 'vip', 1);
};

Achievement.star5card = function(player) {
	checkIsReached_alpha(player, 'star5card', 1);
};

Achievement.star5cardFullLevel = function(player) {
	checkIsReached_alpha(player, 'star5cardLevelTo', 1);
};

Achievement.psTo10 = function(player) {
	checkIsReached_alpha(player, 'psTo10', 1);
};

Achievement.luckyCardCount = function(player) {
	checkIsReached_alpha(player, 'luckyCardCount', 1);
};

Achievement.highLuckyCardCount = function(player) {
	checkIsReached_alpha(player, 'highLuckyCardCount', 1);
};

Achievement.soLucky = function(player) {
	checkIsReached_alpha(player, 'soLucky', 1);
};

Achievement.v587 = function(player) {
	checkIsReached_alpha(player, 'v587', 1);
};

Achievement.taskPoinTo = function(player) {
	checkIsReached_alpha(player, 'taskPoinTo', 1);
};

Achievement.taskChapterPassTo = function(player, chapter) {
	checkIsReached(player, 'taskChapterPassTo', chapter);
};

Achievement.passFirstWin = function(player) {
	checkIsReached_alpha(player, 'passFirstWin', 1);
};

Achievement.taskPartPassTo = function(player, chapter) {
	// 5个大章为为一个part 
	if (charpter % 5 == 0) {
		checkIsReached(player, 'taskPartPassTo', part);
	}	
};

var checkIsReached_alpha = function(player, method, incVal) {
	var need = incVal;
	var items = _.where(_.values(player.achievement), {
		method: method
	});
	if (!_.isEmpty(items)) {
		need = items[0].got + incVal;
	}
	checkIsReached(player, method, need);
};

var checkIsReached = function(player, method, need) {
	var achs = reachedAchievements(method, need);
	achs.forEach(function(ach) {
		if ( (typeof player.achievement[ach.id] == 'undefined') || 
			(typeof player.achievement[ach.id] != 'undefined' && !player.achievement[ach.id].isAchieve) ) {
			reachAchievement(player, ach.id);
		}
	});
	updateAchievement(player, method, need);
};

var updateAchievement = function(player, method, got) {
	var ach = utility.deepCopy(player.achievement);
	var items = _.where(_.values(ach), {
		method: method
	});

	if (!_.isEmpty(items)) {
		items.forEach(function(i) {
			if (!i.isAchieve) {
				i.got = got;
			}
		});
	}
	table.getTable('achievement')
		.filter(function(id, row) {
			return row.method == method && !_.has(ach, id);
		})
		.forEach(function(r) {
			ach[r.id] = {
				method: r.method,
				isAchieve: false,
				isTake: false,
				got: got
			}
		});
	// reset achievement of player
	player.achievement = ach;
};

var reachedAchievements = function(methodName, need) {
	return table.getTable('achievement').filter(function(id, row) {
		return row.method == methodName && need >= row.need;
	});
};

var reachAchievement = function(player, id) {
	player.achieve(id);
	player.save();
	sendMessage(player, id);
};

var sendMessage = function(player, achId) {
	if (messageService != null && typeof(messageService.pushByPid) != 'undefined') {
		messageService.pushByPid(player.id, {
			route: 'onAchieve',
			msg: {
				achieveId: achId
			}
		}, function(err, res) {
			logger.info('push message(route: onAchieve):', err, res);
		});
	}
};

module.exports = Achievement;