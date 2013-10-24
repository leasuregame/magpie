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
                            checkChallengeResults(1, 20001, null, !isWin, data);
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
                            checkChallengeResults(4, 20002, null, !isWin, data);
                        }
                    });
                });

            });

            describe("挑战自己", function() {
                beforeEach(function() {
                    loginWith('1', '1', 1);
                });

                it("should can not be return battle log", function() {
                    request('area.rankHandler.challenge', {
                        targetId: 1
                    }, function(data) {
                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('不能挑战自己');
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
                            checkChallengeResults(5, 20003, null, !isWin, data);
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
                            checkChallengeResults(2, 20000, null, !isWin, data);
                        }
                    });
                });

            });
        });

        describe('挑战后获得经验，玩家升级', function() {
            beforeEach(function() {
                doAjax('/update/player/1', {
                    lv: 25,
                    exp: 388
                }, function() {
                    loginWith('1', '1', 1);
                });
            });

            it('player should be upgrated', function() {
                request('area.rankHandler.challenge', {
                    targetId: 101
                }, function(data) {
                    console.log(data);
                    expect(data.msg.upgradeInfo).toEqual({
                        lv: 26,
                        rewards: {
                            money: 250,
                            energy: 90,
                            skillPoint: 200,
                            elixir: 200
                        },
                        friendsCount: 20
                    });

                    doAjax('/player/1', {}, function(res){
                        expect(res.data.exp).toEqual(data.msg.exp);
                    })
                });
            });
        });

        describe("获取排名奖励", function() {
            beforeAll(function() {
                doAjax('/loaddata/csv', {}, function(data) {
                    expect(data).toEqual('done');
                });
            });

            describe('when ranking is 1', function() {
                beforeAll(function() {
                    doAjax('/update/rank/' + 5, {
                        ranking: 1
                    }, function() {
                        loginWith('1', '1', 1);
                    });
                });

                it('should can get rankng reward', function() {
                    request('area.rankHandler.getRankingReward', {
                        ranking: 1
                    }, function(data) {
                        console.log(data);
                        expect(data).toEqual({
                            code: 200,
                            msg: {
                                rankingRewards: [500, 100, 50, 10]
                            }
                        });
                    });

                    request('area.rankHandler.getRankingReward', {
                        ranking: 10
                    }, function(data) {
                        console.log(data);
                        expect(data).toEqual({
                            code: 200,
                            msg: {
                                rankingRewards: [500, 100, 50]
                            }
                        });
                    });

                    request('area.rankHandler.getRankingReward', {
                        ranking: 50
                    }, function(data) {
                        console.log(data);
                        expect(data).toEqual({
                            code: 200,
                            msg: {
                                rankingRewards: [500, 100]
                            }
                        });
                    });

                });

            });

            describe('when ranking is 500', function() {
                beforeAll(function() {
                    doAjax('/update/rank/' + 5, {
                        ranking: 500
                    }, function() {
                        loginWith('1', '1', 1);
                    });
                });

                it('should only can get ranking reward of 5000', function() {
                    request('area.rankHandler.getRankingReward', {
                        ranking: 500
                    }, function(data) {
                        console.log(data);
                        expect(data).toEqual({
                            code: 200,
                            msg: {
                                rankingRewards: []
                            }
                        });
                    });

                    request('area.rankHandler.getRankingReward', {
                        ranking: 100
                    }, function(data) {
                        console.log(data);
                        expect(data).toEqual({
                            code: 501,
                            msg: '不能领取该排名奖励'
                        });
                    });
                });

            });

            describe('when ranking parameter is not right', function() {
                beforeAll(function() {
                    loginWith('1', '1', 1);
                });

                it('should can not get ranking reward', function() {
                    request('area.rankHandler.getRankingReward', {
                        ranking: 501
                    }, function(data) {
                        console.log(data);
                        expect(data).toEqual({
                            code: 501,
                            msg: '找不到501的排名奖励'
                        });
                    });

                    request('area.rankHandler.getRankingReward', {
                        ranking: 101
                    }, function(data) {
                        console.log(data);
                        expect(data).toEqual({
                            code: 501,
                            msg: '找不到101的排名奖励'
                        });
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
            var steps = [106, 83, 62, 41, 19, 14, 11, 5, 1, 1];

            var genRankings = function(rank, stepIndex) {
                var top3 = [1, 2, 3];
                var results = [];
                if (rank <= 3) {
                    results.push(5);
                    results.push(4);
                } else
                    for (var i = 0; i < 6; i++) {
                        results.push(rank - steps[stepIndex] * i);
                    }
                return _.union(top3, results.reverse());
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

                            expect(_.map(data.msg.rank.rankList, function(p) {
                                return p.ranking;
                            }).sort(function(a, b) {
                                return a - b;
                            })).toEqual(genRankings(cur_ranking, index));

                        });
                    });

                });

            });

            describe("when rank info is empty", function() {
                beforeEach(function() {
                    loginWith('poorman', '1', 1);
                });

                it('should remain that can not find rank info', function() {
                    request('area.rankHandler.rankingList', {}, function(data) {
                        console.log(data);
                        expect(data).toEqual({
                            code: 501,
                            msg: '找不到竞技信息'
                        });
                    });
                });
            });

            describe("when player level is less than 10", function() {
                beforeEach(function() {
                    loginWith('user1', '1', 1);
                });

                it('should remain that can not find rank info', function() {
                    request('area.rankHandler.rankingList', {}, function(data) {
                        console.log(data);
                        expect(data).toEqual({
                            code: 501,
                            msg: '10级开放'
                        });
                    });
                });
            });

            describe("when my recentChallenger has playerIds", function() {

                describe("when players ranking is in top 10", function() {

                    beforeEach(function() {
                        loginWith('3', '1', 1);
                    });

                    it('should can be return correct ranking list', function() {
                        request('area.rankHandler.rankingList', {
                            playerId: 3
                        }, function(data) {
                            console.log(data);
                            var rankList = data.msg.rank.rankList;
                            expect(rankList.length).toEqual(9);
                            for (var i = 0; i < 3; i++)
                                expect(rankList[i].type).toEqual(2);
                            for (var i = 3; i < 8; i++)
                                expect(rankList[i].type).toEqual(1);

                            expect(rankList[9].type).toEqual(0);
                        });
                    })

                });

                describe("when players ranking is not in top 10", function() {

                    beforeEach(function() {
                        loginWith('4', '1', 1);
                    });

                    it('should can be return correct ranking list', function() {
                        request('area.rankHandler.rankingList', {
                            playerId: 4
                        }, function(data) {
                            console.log(data);
                            var rankList = data.msg.rank.rankList;
                            expect(rankList.length).toEqual(10);
                            for (var i = 0; i < 3; i++)
                                expect(rankList[i].type).toEqual(0);
                            for (var i = 3; i < 8; i++)
                                expect(rankList[i].type).toEqual(1);
                            expect(rankList[8].type).toEqual(2);
                            expect(rankList[9].type).toEqual(0);

                        });
                    });

                });

            });

        });

    });
});