var Rank = require('../../app/domain/entity/rank');

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
				winningStreak: 0,
                recentChallenger: []
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
		//_rank.should.be.equal('');
		_rank.getSaveData().should.eql({ranking: 12});
	});
});


describe('.toJson()',function(){
    it('should can to Json',function(){
        var rank = new Rank({
            id: 1,
            createTime: 0,
            playerId: 1,
            ranking: 10,
            counts: {
                challenge: 0,
                win: 0,
                lose: 0,
                winningStreak: 0,
                recentChallenger: []
            }
        });

        rank.toJson().should.eql({
            id: 1,
           // createTime: 0,
            playerId: 1,
            ranking: 10,
            counts: {
                challenge: 0,
                win: 0,
                lose: 0,
                winningStreak: 0,
                recentChallenger: []
            }
        });

    });
});
describe('rank couts',function(){

    var rank;

    beforeEach(function(){
        rank = new Rank({
            counts: {
                challenge: 2,
                win: 1,
                lose: 1,
                winningStreak: 1,
                recentChallenger: [1,2,3]
            }
        });
    });

    describe('.pushRecent()',function(){

        it('should can push recent by given id',function(){
            rank.pushRecent(4);
            rank.counts.recentChallenger.length.should.equal(3);
            rank.counts.recentChallenger.should.eql([2,3,4]);
        });
    });

    describe('.incCount()',function(){
        it('should can incCount by given name',function(){
            rank.incCount('challenge');
            rank.incCount('win');
            rank.incCount('winningStreak');
            rank.counts.should.eql({
                challenge: 3,
                win: 2,
                lose: 1,
                winningStreak: 2,
                recentChallenger: [1,2,3]
            });
        });
    });

    describe('.resetCount',function(){
        it('should can resetCount by given name',function(){
            rank.resetCount('challenge');

            rank.counts.should.eql({
                challenge: 0,
                win: 1,
                lose: 1,
                winningStreak: 1,
                recentChallenger: [1,2,3]
            })

        });
    });

});
