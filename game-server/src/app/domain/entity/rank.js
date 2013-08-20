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

var Rank = (function(_super) {
	utility.extends(Rank, _super);

	function Rank(param) {
		Rank.__super__.constructor.apply(this, arguments);
	}

	Rank.FIELDS = ['id', 'createTime', 'playerId', 'title', 'rank', 'ranking', 'counts'];
	Rank.DEFAULT_VALUES = {
        title: '',
        rank: 1,
        ranking: 0,
        counts: {
            challenge: 0,
            win: 0,
            lose: 0,
            winningStreak: 0,
            recentChallenger: []
        }
    };

	Rank.prototype.toJson = function() {
		return {
			id: this.id,
			playerId: this.playerId,
			title: this.title,
			rank: this.rank,
			ranking: this.ranking,
			counts: this.counts
		};
	};

	Rank.prototype.grantTitle = function(title, honnorPoint) {
		this.set('title', titleConfig.title)
	    this.increase('rank')
	    this.decrease('honnorPoint', honnorPoint)
	};

	Rank.prototype.pushRecent = function(id) {
		this._modifyCount('recentChallenger', function(counts, name) {
			var recentChallenger = counts[name];
			if (recentChallenger.length > 3) {
				recentChallenger.pop();
			}

			if (recentChallenger.indexOf(id) < 0) {
				recentChallenger.push(id);
			}
		});
	};

	Rank.prototype.incCount = function(name) {
		this._modifyCount(name, function(counts, name) {
			counts[name]++;
		});
	};

	Rank.prototype.resetCount = function(name) {
		this._modifyCount(name, function(counts, name) {
			counts[name] = 0;
		});
	};

	Rank.prototype._modifyCount = function(name, fn) {
		if (typeof this.counts !== 'object') {
			this.counts = {
				challenge: 0,
				win: 0,
				lose: 0,
				winningStreak: 0,
		        recentChallenger: []
			};
		}
		var counts = _.clone(this.counts);
		if (counts.hasOwnProperty(name)) {
			fn(counts, name);
		}
		this.set('counts', counts);
	};

	return Rank;
})(Entity);

module.exports = Rank;