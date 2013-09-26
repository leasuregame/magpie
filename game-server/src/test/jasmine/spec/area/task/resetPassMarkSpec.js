describe("Area Server", function() {

    describe("Task Handler", function() {

        describe('area.taskHandler.resetPassMark',function() {

            var mike = {
                id: 102,
                playerId: 102,
                areaId: 1,
                account: 'mike',
                password: '1'
            };

            beforeEach(function() {
                doAjax('/update/player/102', {
                    pass: JSON.stringify({
                        layer:30,
                        mark:[1073741823],
                        mystical: {
                            diff: 1,
                            isTrigger: false,
                            isClear: false
                        },
                        resetTimes:2
                    })
                }, function() {
                    loginWith(mike.account, mike.password, mike.areaId);
                });
            });

            it('should can reset pass mark',function(){
                request('area.taskHandler.resetPassMark', {}, function(data) {
                    console.log(data);
                    expect(data.code).toEqual(200);
                    expect(data.msg).toBeDefined();
                    expect(data.msg).hasProperties([
                        'gold',
                        'canReset'
                    ]);
                    expect(data.msg.canReset).toEqual(true)

                    doAjax('/player/' + mike.playerId, {}, function(res) {
                        //expect(JSON.parse(res.data.pass.mark)).toEqual(data.msg.passMark);
                        expect(res.data.gold).toEqual(data.msg.gold);
                    });

                });
            });
        });

        describe('can not reset pass mark',function(){

            var mike = {
                id: 102,
                playerId: 102,
                areaId: 1,
                account: 'mike',
                password: '1'
            };

            beforeEach(function() {
                doAjax('/update/player/102', {
                    gold:10000,
                    pass: JSON.stringify({
                        layer:30,
                        mark:[1073741823],
                        mystical: {
                            diff: 1,
                            isTrigger: false,
                            isClear: false
                        },
                        resetTimes:0
                    })
                }, function() {
                    loginWith(mike.account, mike.password, mike.areaId);
                });
            });


            it('when gold is already enough',function(){
                doAjax('/update/player/102', {

                    pass: JSON.stringify({
                        layer:30,
                        mark:[1073741823],
                        mystical: {
                            diff: 1,
                            isTrigger: false,
                            isClear: false
                        },
                        resetTimes:0
                    })
                },function(){
                    loginWith(mike.account, mike.password, mike.areaId);
                    request('area.taskHandler.resetPassMark', {}, function(data) {
                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('重置关卡次数已用光');
                    });
                });
            });

            it('when gold is not enough',function(){
                doAjax('/update/player/102', {
                    gold:180
                },function(){
                    loginWith(mike.account, mike.password, mike.areaId);
                    request('area.taskHandler.resetPassMark', {}, function(data) {
                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('元宝不足');
                    });
                });
            });


        });
    });

});