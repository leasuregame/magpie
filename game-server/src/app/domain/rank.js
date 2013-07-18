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
var utility = require('../common/utility');
var _ = require('underscore');

var Rank = (function(_super) {
	utility.extends(Rank, _super);

	function Rank(param) {
		Rank.__super__.constructor.apply(this, arguments);
	}

	Rank.fields = ['id', 'createTime', 'playerId', 'honorPoint', 'title', 'rank', 'ranking', 'counts'];

	Rank.prototype.toJson = function() {
		return {
			id: this.id,
			playerId: this.playerId,
			honnorPoint: this.honnorPoint,
			title: this.title,
			rank: this.rank,
			ranking: this.ranking,
			counts: this.counts
		};
	};

	Rank.prototype.incCount = function(name) {
		var counts = _.clone(this.counts);
		if (counts.hasOwnProperty(name)) {
			counts[name]++;
		}
		this.set('counts', counts);
	};

	Rank.prototype.resetCount = function(name) {
		var counts = _.clone(this.counts);
		if (counts.hasOwnProperty(name)) {
			counts[name] = 0;
		}
		this.set('counts', counts);
	};

	return Rank;
})(Entity);

module.exports = Rank;