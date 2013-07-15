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

var FIELDS = {
	id: true,
	createTime: true,
	playerId: true,
	ranking: true,
	counts: true
};

var Rank = (function(_super) {
	utility.extends(Rank, _super);

	function Rank(param) {
		Rank.__super__.constructor.apply(this, arguments);
		this._fields = FIELDS;
	}

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