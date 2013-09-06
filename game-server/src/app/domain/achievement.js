var table = require('../manager/table');
var logger = require('pomelo-logger').getLogger(__filename);
var Achievement = module.exports;

Achievement = function() {}

Achievement.levelTo = function(player, lv) {
	var idMap = {
		50: 1,
		90: 2
	};
	if (Object.keys(idMap).indexOf(lv) > 0) {
		reachAchievement(player, idMap[lv]);
	}
};

Achievement.passTo = function(player, layer) {
	var idMap = {
		50: 3,
		100: 4
	};
	if (player.pass.layer == layer) {
		reachAchievement(player, idMap[layer]);
	}
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

var reachAchievement = function(player, id) {
	data = table.getTableItem('achievement', id);
	if (data) {
		player.increase('gold', data.gold);
		player.increase('energy', data.energy);
		player.
		player.save();
	} else {
		logger.warn('can not find achievement data by id ' + id);
	}
	
};