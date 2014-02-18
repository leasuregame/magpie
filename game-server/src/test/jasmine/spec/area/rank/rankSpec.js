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
                        targetId: 100,
                        ranking: 15
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
                        targetId: 2,
                        ranking: 14
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
                        targetId: 1,
                        ranking: 20003
                    }, function(data) {
                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('不能挑战自己');
                    });
                });
            });

            describe("对方名次发生变化时", function(){
                beforeEach(function(){
                    loginWith('1', '1', 1);
                });

                it('should can not challenge', function(){
                    request('area.rankHandler.challenge', {
                        targetId: 2,
                        ranking: 100
                    }, function(data) {
                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('对方排名已发生改变');
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
                        targetId: 1,
                        ranking: 20003
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
                        targetId: 101,
                        ranking: 20002
                    }, function(data) {
                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('对方排名已发生改变');
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
                    targetId: 101,
                    ranking: 20002
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
                                elixir: 10000
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
                                elixir: 8000
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
                                elixir: 5000
                            }                            
                        });
                    });

                    request('area.rankHandler.getRankingReward', {
                        ranking: 100
                    }, function(data) {
                        console.log(data);
                        expect(data).toEqual({
                            code: 200,
                            msg: {
                                elixir: 3000
                            }                            
                        });
                    });

                    request('area.rankHandler.getRankingReward', {
                        ranking: 500
                    }, function(data) {
                        console.log(data);
                        expect(data).toEqual({
                            code: 200,
                            msg: {
                                elixir: 2000
                            }                            
                        });
                    });

                });

            });

            describe('when ranking is 500', function() {
                beforeAll(function() {
                    doAjax('/update/rank/' + 4, {
                        ranking: 500
                    }, function() {
                        loginWith('2', '1', 1);
                    });
                });

                var before_player, before_rank;
                beforeEach(function(){
                    doAjax('/player/2', {}, function(res){
                        before_player = res.data;
                    });

                    doAjax('/rank/4', {}, function(res) {
                        before_rank = res.data;
                    });
                });

                it('should can only get ranking reward of 500, once', function() {
                    request('area.rankHandler.getRankingReward', {
                        ranking: 500
                    }, function(data) {
                        console.log(data);
                        expect(data).toEqual({
                            code: 200,
                            msg: {
                                elixir: 2000
                            }                            
                        });
                    });

                    request('area.rankHandler.getRankingReward', {
                        ranking: 500
                    }, function(data) {
                        console.log(data);
                        expect(data).toEqual({
                            code: 501,
                            msg: '不能重复领取500的排名奖励'                         
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

                    doAjax('/player/2', {}, function(res){
                        expect(res.data.elixir).toEqual(before_player.elixir + 2000);
                    });

                    doAjax('/rank/4', {}, function(res){
                        expect(res.data.gotRewards).toEqual('[500]');
                    });
                    expect(before_rank.gotRewards).toEqual('[]');
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

        

    });
});