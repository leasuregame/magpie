describe("Area Server", function() {

    describe("Rank Handler", function() {
        describe("ranking list", function() {
            beforeAll(function() {
                doAjax('/loaddata/all', {}, function(data) {
                    expect(data).toEqual('done');
                });
            });

            var ids = [20000, 17000, 15000, 13000, 11000, 10700, 10300, 10199, 10013, 10001];
            var steps = [106, 83, 62, 41, 19, 14, 11, 5, 1, 1];

            var genRankings = function(rank, stepIndex) {
                var top = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                var results = [];
                if (rank <= 10) {
                    results.push(11);
                } else
                    for (var i = 0; i < 11; i++) {
                        results.push(rank - steps[stepIndex] * i);
                    }
                return _.union(top, results.reverse());
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
                            expect(data.msg.rank.rankList[data.msg.rank.rankList.length - 1].ranking).toEqual(cur_ranking);

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
                            playerId: 10009
                        }, function(data) {
                            console.log(data);
                            var rankList = data.msg.rank.rankList;
                            expect(rankList.length).toEqual(11);
                            for (var i = 0; i < 9; i++)
                                expect(rankList[i].type).toEqual(1);

                            expect(rankList[9].type).toEqual(0);
                            expect(rankList[10].type).toEqual(1);
                        });
                    });

                });

                describe("when players ranking is not in top 10", function() {

                    beforeEach(function() {
                        loginWith('4', '1', 1);
                    });

                    it('should can be return correct ranking list', function() {
                        request('area.rankHandler.rankingList', {
                            playerId: 10900
                        }, function(data) {
                            console.log(data);
                            var rankList = data.msg.rank.rankList;
                            expect(rankList.length).toEqual(24);
                            for (var i = 0; i < 10; i++)
                                expect(rankList[i].type).toEqual(0);
                            for (var i = 10; i < 20; i++)
                                expect(rankList[i].type).toEqual(1);
                            for (var i = 21; i < 24; i++)
                                expect(rankList[i].type).toEqual(3);
                            expect(rankList[20].type).toEqual(0);

                        });
                    });

                });

            });

        });
    });
});