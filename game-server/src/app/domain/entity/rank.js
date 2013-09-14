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
var _ = require('underscore');

RANKINGS = [1, 10, 50, 100, 500, 1000, 5000]

var Rank = (function(_super) {
	utility.extends(Rank, _super);

	function Rank(param) {
		Rank.__super__.constructor.apply(this, arguments);
	}

	Rank.FIELDS = [
		'id', 'createTime', 'playerId', 'ranking', 'challengeCount', 'winCount', 
		'loseCount', 'winningStreak', 'recentChallenger', 'gotRewards'
	];
	Rank.DEFAULT_VALUES = {
		ranking: 0,
		challengeCount: 0,
		winCount: 0,
		loseCount: 0,
		winningStreak: 0,
		recentChallenger: [],
		gotRewards: []
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
			gotRewards: this.gotRewards
		};
	};

	Rank.prototype.pushRecent = function(id) {
		var rc = _.clone(this.recentChallenger);
		if (rc.length >= 3) {
			rc = rc.slice(-3);
			rc.shift();
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

	Rank.prototype.getRankingReward = function() {
		if (this.canGetRankingReward()) {
			var rew = _.clone(this.gotRewards);
			rew.push(ranking);
			this.gotRewards = rew;
		}
	};

	Rank.prototype.canGetRankingReward = function() {
		return RANKINGS.indexOf(this.ranking) > 0 && this.gotRewards.indexOf(ranking) < 0;
	};

	return Rank;
})(Entity);

module.exports = Rank;