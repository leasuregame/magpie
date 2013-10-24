/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-21
 * Time: 下午3:45
 * To change this template use File | Settings | File Templates.
 */

describe("Area Server", function() {
    describe("Buy Handler", function() {
        describe("area.buyHandler.buyPower", function() {


            var BUY_POWER = { //购买体力
                "gold": 20,
                "power": 50
            };

            var power = 0;
            var gold = 130;

            describe('购买成功',function() {


                beforeAll(function() {
                    doAjax('/update/player/' + 113 ,{
                        power: {
                            time: Date.now(),
                            value: 0
                        },
                        gold: 130
                    },function(){

                    });

                });

                beforeEach(function() {
                    loginWith('113','1',1);
                });

                var buyPower = function(time) {
                    it('第' + time + '次购买' ,function() {
                        request('area.buyHandler.buyPower',{time: 1},function(data) {
                            console.log(data);
                            expect(data.code).toEqual(200);
                            power += BUY_POWER.power;
                            gold -= BUY_POWER.gold;
                            expect(power).toEqual(data.msg.power);
                            doAjax('/player/113',{},function(msg) {
                                player = msg.data;
                                console.log(player);
                                expect(power).toEqual(JSON.parse(player.power).value);
                                expect(gold).toEqual(player.gold);
                            });

                        })
                    })
                };

                for(var i = 1;i <= 3;i++) {
                    (function(i) {
                        buyPower(i);
                    })(i);
                };

            });

            describe('当体力达到上限时', function() {

                beforeEach(function() {
                    doAjax('/update/player/' + 113 ,{
                        power: {
                            time: Date.now(),
                            value: 150
                        },
                        gold: 130
                    },function(){
                        loginWith('113','1',1);
                    });

                });

                it('无法购买体力',function() {

                    request('area.buyHandler.buyPower',{time: 1},function(data) {

                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('体力已达上限');
                        doAjax('/player/113',{},function(msg) {
                            player = msg.data;
                            console.log(player);
                            expect(JSON.parse(player.power).value).toEqual('150'    );
                            expect(player.gold).toEqual(130);
                        });

                    });

                });


            });

            describe('当元宝不足时', function() {

                beforeEach(function() {
                    doAjax('/update/player/' + 113 ,{
                        power: {
                            time: Date.now(),
                            value: 0
                        },
                        gold: 10
                    },function(){
                        loginWith('113','1',1);
                    });
                });


                it('无法购买体力',function() {

                    request('area.buyHandler.buyPower',{time: 1},function(data) {

                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('元宝不足');
                        doAjax('/player/113',{},function(msg) {
                            player = msg.data;
                            console.log(player);
                            expect(JSON.parse(player.power).value).toEqual('0');
                            expect(player.gold).toEqual(10);
                        });

                    });

                });
            });

            describe('当购买次数达到上限时',function() {

                beforeEach(function() {
                    doAjax('/player/113',{},function(msg) {
                        player = msg.data;
                        console.log(player);
                        var dg = JSON.parse(player.dailyGift);

                        dg.powerBuyCount = 0;

                        doAjax('/update/player/' + 113 ,{
                            dailyGift: dg,
                            gold: 20
                        },function(){
                            loginWith('113','1',1);
                        });
                    });

                });

                it('无法购买体力',function() {

                    request('area.buyHandler.buyPower',{time: 1},function(data) {

                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('购买次数已经用完');
                        doAjax('/player/113',{},function(msg) {
                            player = msg.data;
                            console.log(player);
                            expect(JSON.parse(player.power).value).toEqual('0');
                            expect(player.gold).toEqual(20);
                        });

                    });

                });

            });

            describe('当购买次数多余所剩次数时',function() {

                beforeEach(function() {
                    doAjax('/player/113',{},function(msg) {
                        player = msg.data;
                        console.log(player);
                        var dg = JSON.parse(player.dailyGift);

                        dg.powerBuyCount = 5;

                        doAjax('/update/player/' + 113 ,{
                            dailyGift: dg,
                            gold: 200
                        },function(){
                            loginWith('113','1',1);
                        });
                    });

                });

                it('无法购买体力',function() {

                    request('area.buyHandler.buyPower',{time: 6},function(data) {

                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('所剩购买次数不足');
                        doAjax('/player/113',{},function(msg) {
                            player = msg.data;
                            console.log(player);
                            expect(JSON.parse(player.power).value).toEqual('0');
                            expect(player.gold).toEqual(200);
                        });

                    });

                });

            });

        });

    });
});
