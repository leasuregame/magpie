describe("Area Server", function() {

    describe("Task Handler", function() {

        describe('area.taskHandler.resetPassMark', function() {

            var mike = {
                id: 102,
                playerId: 102,
                areaId: 1,
                account: 'mike',
                password: '1'
            };

            beforeAll(function() {
                doAjax('/loaddata/csv', {}, function(data) {
                    expect(data).toEqual('done');
                });
            });

            describe('when can reset pass mark', function() {

                beforeEach(function() {
                    doAjax('/update/player/102', {
                        pass: JSON.stringify({
                            layer: 30,
                            mark: [1073741823],
                            mystical: {
                                diff: 1,
                                isTrigger: false,
                                isClear: false
                            },
                            resetTimes: 2
                        })
                    }, function() {
                        loginWith(mike.account, mike.password, mike.areaId);
                    });
                });

                it('should can reset pass mark', function() {
                    request('area.taskHandler.resetPassMark', {}, function(data) {
                        console.log(data);
                        expect(data.code).toEqual(200);
                        expect(data.msg).toBeDefined();
                        expect(data.msg).hasProperties([
                            'gold',
                            'canReset'
                        ]);
                        expect(data.msg.canReset).toEqual(false);

                        doAjax('/player/' + mike.playerId, {}, function(res) {
                            expect(res.data.gold).toEqual(data.msg.gold);
                        });
                    });
                });
            });

            describe('can not reset pass mark', function() {

                var mike = {
                    id: 102,
                    playerId: 102,
                    areaId: 1,
                    account: 'mike',
                    password: '1'
                };



                describe('when reset times is use out', function() {

                    beforeEach(function() {
                        doAjax('/update/player/102', {
                            gold: 10000,
                            pass: JSON.stringify({
                                layer: 30,
                                mark: [1073741823],
                                mystical: {
                                    diff: 1,
                                    isTrigger: false,
                                    isClear: false
                                },
                                resetTimes: 0
                            })
                        }, function() {
                            loginWith(mike.account, mike.password, mike.areaId);
                        });
                    });

                    it('should can not reset pass mark', function() {

                        request('area.taskHandler.resetPassMark', {}, function(data) {
                            console.log(data);
                            expect(data.code).toEqual(501);
                            expect(data.msg).toEqual('重置关卡次数已用光');
                        });
                    });

                });

                describe('when gold is not enough', function() {

                    beforeEach(function() {
                        doAjax('/update/player/101', {
                            gold: 180
                        }, function() {
                            loginWith('user4', '1', 1);
                        });
                    });

                    it('should can not reset pass mark', function() {


                        request('area.taskHandler.resetPassMark', {}, function(data) {
                            console.log(data);
                            expect(data.code).toEqual(501);
                            expect(data.msg).toEqual('元宝不足');
                        });
                    });
                });

                describe('when not pass to be reseted 1', function(){
                    beforeEach(function(){
                        doAjax('/update/player/100', {
                            passLayer: 0
                        }, function() {
                            loginWith('arthur', '1', 1);
                        });
                    });

                    it('should can not reset pass mark', function(){
                        request('area.taskHandler.resetPassMark', {}, function(data) {
                            console.log(data);
                            expect(data.code).toEqual(501);
                            expect(data.msg).toEqual('没有关卡可以重置');
                        });
                    });
                });

                describe('when not pass to be reseted 2', function(){
                    beforeEach(function(){
                        doAjax('/update/player/101', {
                            gold: 1000,
                            passLayer: 10
                        }, function() {
                            loginWith('user4', '1', 1);
                        });
                    });

                    it('should can not reset pass mark', function(){
                        request('area.taskHandler.resetPassMark', {}, function(data) {
                            console.log(data);
                            expect(data.code).toEqual(501);
                            expect(data.msg).toEqual('没有关卡可以重置');
                        });
                    });
                });

            });

        });
    });

});