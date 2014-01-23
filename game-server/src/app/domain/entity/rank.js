/**
 * Created with Sublime 2
 * User: arthur
 * Date: 13-7-15
 * Time: 下午18:17
 */


/*
 * rank
 * */

var Entity = require('./entity');
var utility = require('../../common/utility');
var table = require('../../manager/table');
var _ = require('underscore');

//RANKINGS = [1, 10, 50, 100, 500, 1000, 5000]

var addEvents = function(rank) {
	rank.on('ranking.change', function(ranking) {
		if (rank.historyRanking == 0 || (ranking != 0 && ranking < rank.historyRanking)) {
			rank.set('historyRanking', ranking);
			rank.save();
		}
	});

	rank.on('winningStreak.change', function(count) {
		if (rank.winStreakCount < count) {
			rank.set('winStreakCount', count);
		}
	});

	rank.emit('ranking.change', rank.ranking);
}

var Rank = (function(_super) {
	utility.extends(Rank, _super);

	function Rank(param) {
		Rank.__super__.constructor.apply(this, arguments);
		addEvents(this);

		if (this.historyRanking == 0) {
			this.historyRanking = this.ranking;
		}
	}

	Rank.FIELDS = [
		'id', 'createTime', 'playerId', 'ranking', 'challengeCount', 'startCount', 'winCount', 
		'loseCount', 'winStreakCount', 'winningStreak', 'recentChallenger', 'gotRewards', 'historyRanking'
	];
	Rank.DEFAULT_VALUES = {
		ranking: 0,
		challengeCount: 0,
		startCount: 0,
		winCount: 0,
		loseCount: 0,
		winStreakCount: 0,
		winningStreak: 0,
		recentChallenger: [],
		gotRewards: [],
		historyRanking: 0
	};

	Rank.prototype.toJson = function() {
		return {
			id: this.id,
			playerId: this.playerId,
			ranking: this.ranking,
			counts: {
				challenge: this.challengeCount,
				win: this.winCount,
				lose: this.loseCount,
				winningStreak: this.winningStreak,
				recentChallenger: this.recentChallenger
			},
			rankingRewards: this.rankingRewards()
		};
	};

	Rank.prototype.stats = function() {
		return {
			historyRanking: this.historyRanking,
			winStreakCount: this.winStreakCount,
			winningStreak: this.winningStreak,
			challengeCount: this.startCount,
			beChallengeCount: this.challengeCount - this.startCount,
			winCount: this.winCount,
			loseCount: this.loseCount,
			avgWinRate: this.challengeCount > 0 ? (this.winCount/this.challengeCount*100).toFixed(1)+'%' : '0.0%'
		};
	};

	Rank.prototype.pushRecent = function(id) {
		var rc = _.clone(this.recentChallenger);
		var beatBackCount = table.getTableItem('ranking_list',1).beat_back_count
		if (rc.length >= beatBackCount) {
			rc.splice(0,1);
		}
		if (rc.indexOf(id) < 0) {
			rc.push(id);
		}
		// 更新最近挑战的玩家信息
		this.recentChallenger = rc;
	};

	Rank.prototype.incCount = function(name) {
		this.increase(name);
	};

	Rank.prototype.resetCount = function(name) {
		if (['winCount', 'loseCount', 'winningStreak', 'challengeCount'].indexOf(name) > 0) {
			this.set(name, 0);
		}
	};

	Rank.prototype.setWinStreakCount = function() {
		if (this.winStreakCount < this.winningStreak) {
			this.set('winStreakCount', this.winningStreak);
		}
	};

	Rank.prototype.getRankingReward = function(ranking) {
		if (this.canGetRankingReward(ranking)) {
			var rew = _.clone(this.gotRewards);
			rew.push(ranking);
			this.gotRewards = rew;
		}
	};

	Rank.prototype.canGetRankingReward = function(ranking) {
		return RANKINGS(this.historyRanking).indexOf(ranking) > -1 && this.gotRewards.indexOf(ranking) < 0;
	};

	Rank.prototype.hasGotReward = function(ranking) {
		return this.gotRewards.indexOf(ranking) > -1;
	};

	Rank.prototype.rankingRewards = function() {
		return _.difference(RANKINGS(this.historyRanking), this.gotRewards)
			.sort(function(x, y) { return y - x; });
	};

	Rank.prototype.rewardsNotHave = function(){
		var self = this;
		return table.getTable('ranking_reward')
			.map(function(row) {
				return row.id;
			})
			.filter(function(i) {
				return i < self.historyRanking;
			})
			.sort(function(x, y) {
				return y - x;
			});
	};

	return Rank;
})(Entity);

var RANKINGS = function(hr) {
	if (hr == 0) {
		return [];
	}

	return table.getTable('ranking_reward')
		.map(function(row) {
			return row.id;
		})
		.filter(function(i) {
			return i >= hr;
		});
};

module.exports = Rank;