var checkChallengeResults = function(rankId, ranking, challenger, isWin, data) {
  var challenge = 1,
    win = 1,
    lose = 0,
    winningStreak = 1,
    recentChallenger = challenger == null ? [] : [challenger];

  if (!isWin) {
    win = 0;
    lose = 1;
    winningStreak = 0;
  }

  doAjax('/rank/' + rankId, {}, function(res) {
    console.log(res);
    expect(res.data.challengeCount).toEqual(challenge);
    expect(res.data.winCount).toEqual(win);
    expect(res.data.loseCount).toEqual(lose);
    expect(res.data.winningStreak).toEqual(winningStreak);
    expect(res.data.recentChallenger).toEqual(JSON.stringify(recentChallenger));
    expect(res.data.ranking).toEqual(ranking);
  });
};

describe("Area Server", function() {

  describe("Rank Handler", function() {

    describe("challenge 1", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function(data) {
          expect(data).toEqual('done');
        });
      });
      describe("高排位挑战低排位", function() {
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
              'exp', 'money', 'elixir', 'ranking_elixir'
            ]);

            if (isWin) {
              checkChallengeResults(1, 20001, 101, !isWin, data);
              checkChallengeResults(2, 20000, null, isWin, data);
            } else {
              checkChallengeResults(1, 20001, 101, !isWin, data);
              checkChallengeResults(2, 20000, null, isWin, data);
            }
          });
        });

      });

      describe("低排位挑战高排位", function() {
        beforeEach(function() {
          loginWith('1', '1', 1);
        });

        it("should can be return battle log", function() {
          request('area.rankHandler.challenge', {
            targetId: 2
          }, function(data) {
            console.log(data);
            expect(data.code).toEqual(200);
            expect(data.msg.battleLog).toBeBattleLog();
            expect(['own', 'enemy']).toContain(data.msg.battleLog.winner);

            var isWin = data.msg.battleLog.winner == 'own';
            expect(data.msg.battleLog.rewards).hasProperties([
              'exp', 'money', 'elixir', 'ranking_elixir'
            ]);

            if (isWin) {
              checkChallengeResults(5, 20002, null, isWin, data);
              checkChallengeResults(4, 20003, 1, !isWin, data);
            } else {
              checkChallengeResults(5, 20003, null, isWin, data);
              checkChallengeResults(4, 20002, 1, !isWin, data);
            }
          });
        });

      });
    });

    describe("challenge 2", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function(data) {
          expect(data).toEqual('done');
        });
      });
      describe("高排位挑战低排位", function() {
        beforeEach(function() {
          loginWith('2', '1', 1);
        });

        it("should can be return battle log", function() {
          request('area.rankHandler.challenge', {
            targetId: 1
          }, function(data) {
            console.log(data);
            expect(data.code).toEqual(200);
            expect(data.msg.battleLog).toBeBattleLog();
            expect(['own', 'enemy']).toContain(data.msg.battleLog.winner);

            var isWin = data.msg.battleLog.winner == 'own';
            expect(data.msg.battleLog.rewards).hasProperties([
              'exp', 'money', 'elixir', 'ranking_elixir'
            ]);

            if (isWin) {
              checkChallengeResults(5, 20003, 2, !isWin, data);
              checkChallengeResults(4, 20002, null, isWin, data);
            } else {
              checkChallengeResults(5, 20003, 2, !isWin, data);
              checkChallengeResults(4, 20002, null, isWin, data);
            }
          });
        });

      });

      describe("低排位挑战高排位", function() {
        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        it("should can be return battle log", function() {
          request('area.rankHandler.challenge', {
            targetId: 101
          }, function(data) {
            console.log(data);
            expect(data.code).toEqual(200);
            expect(data.msg.battleLog).toBeBattleLog();
            expect(['own', 'enemy']).toContain(data.msg.battleLog.winner);

            var isWin = data.msg.battleLog.winner == 'own';
            expect(data.msg.battleLog.rewards).hasProperties([
              'exp', 'money', 'elixir', 'ranking_elixir'
            ]);

            if (isWin) {
              checkChallengeResults(1, 20000, null, isWin, data);
              checkChallengeResults(2, 20001, 100, !isWin, data);
            } else {
              checkChallengeResults(1, 20001, null, isWin, data);
              checkChallengeResults(2, 20000, 100, !isWin, data);
            }
          });
        });

      });
    });

    describe("get ranking rewards", function(){
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function(data) {
          expect(data).toEqual('done');
        });
      });

      describe('when ranking is 1', function(){
        beforeAll(function(){
          doAjax('/update/rank/' + 5, {
            ranking: 100
          }, function(){
            loginWith('1', '1', 1);
          });
        });

        it('should can get rankng reward', function(){
          request('area.rankHandler.getRankingReward', {
            ranking: 1
          }, function(data) {
            console.log(data);
            expect(data).toEqual({});
          });

          request('area.rankHandler.getRankingReward', {
            ranking: 100
          }, function(data) {
            console.log(data);
            expect(data).toEqual({});
          });

          request('area.rankHandler.getRankingReward', {
            ranking: 500
          }, function(data) {
            console.log(data);
            expect(data).toEqual({});
          });

          request('area.rankHandler.getRankingReward', {
            ranking: 1000
          }, function(data) {
            console.log(data);
            expect(data).toEqual({});
          });

        });


      });
    });

    describe("ranking list", function() {
      beforeAll(function() {
        doAjax('/loaddata/all', {}, function(data) {
          expect(data).toEqual('done');
        });
      });

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
            console.log(Date.now());
            loginWith('user4', '1', 1);
          });

          it('should can be return correct ranking list for (' + (id - 9999) + ')', function() {
            var s = Date.now();
            request('area.rankHandler.rankingList', {
              playerId: id
            }, function(data) {
              console.log(Date.now(), (Date.now() - s) / 1000, data);
              var cur_ranking = id - 9999;
              //expect(data).toEqual('');
              //expect(data.msg[data.msg.length - 1].ranking).toEqual(cur_ranking);

              expect(_.map(data.msg, function(p) {
                return p.ranking;
              }).sort(function(a, b) {
                return a - b;
              })).toEqual(genRankings(cur_ranking, index));

            });
          });

        });

      });

    });

  });
});