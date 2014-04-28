var table = require('../manager/table');
var logger = require('pomelo-logger').getLogger(__filename);
var utility = require('../common/utility');
var _ = require('underscore');
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
	checkIsReached(player, 'winningStreak', count, true);
};

Achievement.rankingToOne = function(player) {
	checkIsReached(player, 'rankingToOne', 1);
};

Achievement.friends = function(player) {
	checkIsReached_alpha(player, 'friends', 1);
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

Achievement.star5card = function(player, count) {
	if (_.isNumber(count) || count > 0) {
		checkIsReached(player, 'star5card', count);
	} else {
		checkIsReached_alpha(player, 'star5card', 1);
	}	
};

Achievement.star6card = function(player, count) {
	if (_.isNumber(count) || count > 0) {
		checkIsReached(player, 'star6card', count);
	} else {
		checkIsReached_alpha(player, 'star6card', 1);
	}	
};

Achievement.star7card = function(player) {
	checkIsReached_alpha(player, 'star7card', 1);
};

Achievement.star5cardFullLevel = function(player) {
	checkIsReached_alpha(player, 'star5cardFullLevel', 1);
};

Achievement.star6cardFullLevel = function(player) {
	checkIsReached_alpha(player, 'star6cardFullLevel', 1);
};

Achievement.star7cardFullLevel = function(player) {
	checkIsReached_alpha(player, 'star7cardFullLevel', 1);
};

Achievement.psTo10 = function(player) {
	checkIsReached_alpha(player, 'psTo10', 1);
};

Achievement.luckyCardCount = function(player, count) {
	checkIsReached_alpha(player, 'luckyCardCount', count);
};

Achievement.highLuckyCardCount = function(player, count) {
	checkIsReached_alpha(player, 'highLuckyCardCount', count);
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
	if (chapter % 5 == 0) {
		checkIsReached(player, 'taskPartPassTo', parseInt(chapter/5));
	}	
};

Achievement.vipTo = function(player, vip) {
	checkIsReached(player, 'vipTo', vip);
};

Achievement.passPhaseTo = function(player, phase) {
	checkIsReached(player, 'passPhaseTo', phase);
};

var checkIsReached_alpha = function(player, method, incVal, useMax) {
	var need = incVal;
	var items = _.where(_.values(player.achievement), {
		method: method,
		isAchieve: false
	});
	if (!_.isEmpty(items)) {
		need = items[0].got + incVal;
	}
	checkIsReached(player, method, need, useMax);
};

var checkIsReached = function(player, method, need, useMax) {
	var achs = reachedAchievements(method, need);
	
	achs.forEach(function(ach) {
		if ( isAchieved(player, ach.id) ) {
			reachAchievement(player, ach.id);
		}
	});
	updateAchievement(player, method, need, useMax);
};

var isAchieved = function(player, id) {
	return (typeof player.achievement[id] == 'undefined') || 
				 (typeof player.achievement[id] != 'undefined' && !player.achievement[id].isAchieve);
};

var resetAchievementIfChange = function(ach) {	
	_.each(ach, function(val, id) {
		var d = table.getTableItem('achievement', id);
		if (val.isAchieve && d && val.got < d.need) {
			val.isAchieve = false;
			val.isTake = false;
		}
	});
};

var updateAchievement = function(player, method, got, useMax) {
	var ach = utility.deepCopy(player.achievement);
	resetAchievementIfChange(ach);

	var items = _.where(_.values(ach), {
		method: method
	});

	if (!_.isEmpty(items)) {
		items.forEach(function(i) {
			if (!i.isAchieve) {
				if (useMax) {
					i.got = _.max([i.got, got]);
				} else {
					i.got = got;
				}
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
	player.save()
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

var onlyOneAchieved = function(achivement) {
	return _.values(achivement).filter(function(a) {
		return a.isAchieve;
	}).length == 1;
};

var sendMessage = function(player, achId) {
	if (messageService != null && typeof(messageService.pushByPid) != 'undefined') {
		messageService.pushByPid(player.id, {
			route: 'onAchieve',
			msg: {
				achieveId: achId,
				firstTime: onlyOneAchieved(player.achievement) ? true : void 0
			}
		}, function(err, res) {
			logger.info('push message(route: onAchieve):', err, res);
		});
	}
};

module.exports = Achievement;
