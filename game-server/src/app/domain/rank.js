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

var Rank = (function(_super) {
	utility.extends(Rank, _super);

	function Rank(param) {
		Rank.__super__.constructor.apply(this, arguments);
	}

	Rank.fields = ['id', 'createTime', 'playerId', 'ranking', 'counts'];

	Rank.prototype.toJson = function() {
		return {
			id: this.id,
			playerId: this.playerId,
			ranking: this.ranking,
			counts: this.counts
		};
	};

	return Rank;
})(Entity);

module.exports = Rank;