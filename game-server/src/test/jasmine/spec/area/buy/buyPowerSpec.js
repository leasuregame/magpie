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
                        request('area.buyHandler.buyProduct',{id:5,times: 1},function(data) {
                            console.log(data);
                            expect(data.code).toEqual(200);
                            power += BUY_POWER.power;
                            gold -= BUY_POWER.gold;
                            expect(50).toEqual(data.msg.power);
                            expect(data.msg.consume).toEqual({
                                "key": "gold",
                                "value": gold
                            });
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

                beforeAll(function() {
                    doAjax('/update/player/' + 113 ,{
                        power: {
                            time: Date.now(),
                            value: 150
                        },
                        gold: 130
                    },function(){
                    });

                });

                beforeEach(function() {
                    loginWith('113','1',1);
                });

                describe('无法购买体力',function() {
                    it('购买一次',function() {

                        request('area.buyHandler.buyProduct',{id:5, times: 1},function(data) {

                            console.log(data);
                            expect(data.code).toEqual(501);
                            expect(data.msg).toEqual('体力已达上限');

                        });

                    });
                });



            });

            describe('购买上限',function() {

                beforeAll(function() {
                    doAjax('/player/113',{},function(msg) {
                        var player = msg.data;
                        console.log(player);
                        var dg = JSON.parse(player.dailyGift);
                        dg.powerBuyCount = 5;

                        doAjax('/update/player/' + 113 ,{
                            dailyGift:dg,
                            power: {
                                time: Date.now(),
                                value: 99
                            },
                            gold: 60
                        },function(){

                        });
                    });
                });

                beforeEach(function() {
                    loginWith('113','1',1);
                });

                describe('购买完体力超过上限',function() {
                    it('购买3次',function() {

                        request('area.buyHandler.buyProduct',{id:5, times: 3},function(data) {

                            console.log(data);
                            expect(data.code).toEqual(501);
                            expect(data.msg).toEqual('超过体力上限');

                        });

                    });
                });

                describe('购买完体力刚好到上限',function() {
                    it('购买2次',function() {

                        request('area.buyHandler.buyProduct',{id:5, times: 2},function(data) {
                            console.log(data);
                            expect(data.code).toEqual(200);
                            expect(51).toEqual(data.msg.power);
                            expect(data.msg.consume).toEqual({
                                "key": "gold",
                                "value": 20
                            });

                        });

                    });
                });

            });

            describe('当元宝不足时', function() {

                beforeAll(function() {
                    doAjax('/update/player/' + 113 ,{
                        power: {
                            time: Date.now(),
                            value: 0
                        },
                        gold: 10
                    },function(){

                    });
                });

                beforeEach(function() {
                    loginWith('113','1',1);
                });

                describe('无法购买体力',function(){
                    it('购买1次',function() {

                        request('area.buyHandler.buyProduct',{id:5, times: 1},function(data) {

                            console.log(data);
                            expect(data.code).toEqual(501);
                            expect(data.msg).toEqual('元宝不足');


                        });

                    });
                });

            });

            describe('当购买次数达到上限时',function() {

                beforeEach(function() {
                    doAjax('/player/113',{},function(msg) {
                        var player = msg.data;
                        console.log(player);
                        var dg = JSON.parse(player.dailyGift);

                        dg.powerBuyCount = 0;

                        doAjax('/update/player/' + 113 ,{
                            dailyGift: dg,
                            power: {
                                time: Date.now(),
                                value: 0
                            },
                            gold: 20
                        },function(){
                            loginWith('113','1',1);
                        });
                    });

                });

                it('无法购买体力',function() {

                    request('area.buyHandler.buyProduct',{id:5, times: 1},function(data) {

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

            describe('当购买次数多于所剩次数时',function() {

                beforeAll(function() {
                    doAjax('/player/113',{},function(msg) {
                        var player = msg.data;
                        console.log(player);
                        var dg = JSON.parse(player.dailyGift);

                        dg.powerBuyCount = 5;

                        doAjax('/update/player/' + 113 ,{
                            dailyGift: dg,
                            power: {
                                time: Date.now(),
                                value: 0
                            },
                            gold: 200
                        },function(){

                        });
                    });

                });

                beforeEach(function(){
                    loginWith('113','1',1);
                });

                it('无法购买体力',function() {

                    request('area.buyHandler.buyProduct',{id:5 , times: 6},function(data) {

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
