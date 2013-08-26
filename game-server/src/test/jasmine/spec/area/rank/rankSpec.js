var checkChallengeResults = function(rankId, ranking, challenger, isWin, data) {
  var challenge = 1,
    win = 1,
    lose = 0,
    winningStreak = 1,
    recentChallenger = [challenger];

  if (!isWin) {
    win = 0;
    lose = 1;
    winningStreak = 0;
  }

  doAjax('/rank/' + rankId, {}, function(res) {
    console.log(res);
    expect(JSON.parse(res.data.counts)).toEqual({
      challenge: challenge,
      win: win,
      lose: lose,
      winningStreak: winningStreak,
      recentChallenger: recentChallenger
    });
    expect(res.data.ranking).toEqual(ranking);
  });
};

describe("Area Server", function() {

  describe("Rank Handler", function() {
    beforeAll(function() {
      doAjax('/loaddata/all', {}, function(data) {
        expect(data).toEqual('done');
      });
    });

    describe("challenge", function() {
      describe("when one challenge to other", function() {
        beforeEach(function() {
          loginWith('user4', '1', 1);
        });

        it("should can be return battle log", function() {
          request('area.rankHandler.challenge', {
            targetId: 100
          }, function(data) {
            console.log(data);
            expect(data.code).toEqual(200);
            expect(data.msg.battleLog).toBeBattleLog();
            expect(['own', 'enemy']).toContain(data.msg.battleLog.winner);

            var isWin = data.msg.battleLog.winner == 'own';
            expect(data.msg.battleLog.rewards).hasProperties([
              'exp', 'money', 'elixir'
            ]);

            if (isWin) {
              checkChallengeResults(2, 20001, 100, isWin, data);
              checkChallengeResults(1, 20000, 101, !isWin, data);
            } else {
              checkChallengeResults(2, 20000, 100, isWin, data);
              checkChallengeResults(1, 20001, 101, !isWin, data);
            }
          });
        });

      });
    });

    describe("ranking list", function() {
      var ids = [20000, 17000, 15000, 13000, 11000, 10700, 10300, 10199, 10013, 10001];
      var steps = [100, 80, 60, 40, 20, 15, 10, 5, 1, 1];

      var genRankings = function(rank, stepIndex) {
        var top10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        if (rank <= 10) {
          return top10;
        }
        var results = []
        for (var i = 0; i < 10; i++) {
          results.push(rank - steps[stepIndex] * i);
        }
        return _.union(top10, results.reverse());
      };

      ids.map(function(id, index) {

        describe("when my ranking is " + (id - 9999), function() {
          beforeEach(function() {
            loginWith('user4', '1', 1);
          });

          it('should can be return correct ranking list for (' + (id - 9999) + ')', function() {
            request('area.rankHandler.rankingList', {
              playerId: id
            }, function(data) {
              var cur_ranking = id - 9999;
              //expect(data).toEqual('');
              //expect(data.msg[data.msg.length - 1].ranking).toEqual(cur_ranking);

              expect(_.map(data.msg, function(p) {
                return p.ranking;
              }).sort(function(a, b) {
                return a - b;
              })).toEqual(genRankings(cur_ranking, index));
              console.log(data);
            });
          });

        });

      });

    });

  });
});