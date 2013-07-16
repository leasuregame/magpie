var Rank = require('../../app/domain/rank');

describe('Rank Entity', function(){
	var _rank;

	beforeEach(function(){
		_rank = new Rank({
			id: 1,
			createTime: 0,
			playerId: 1,
			ranking: 10,
			counts: {
				challenge: 0,
				win: 0,
				lose: 0,
				winningStreak: 0
			}
		});
	});


	it('.get()', function(){
		_rank.get('id').should.be.equal(1);
		_rank.get('ranking').should.be.equal(10);
	});

	it('.set()', function(){
		_rank.set('ranking', 11);
		_rank.get('ranking').should.be.equal(11);
	});

	it('.changedData', function(){
		_rank.set('ranking', 12);
		_rank.should.be.equal('');
		_rank.changedData().should.eql({ranking: 12});
	});
});
