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

            beforeAll(function() {
                doAjax('/loaddata/csv', {}, function() {});
            });

            var BUY_POWER = { //购买体力
                "gold": 20,
                "power": 50
            };

            var power = 0;
            var gold = 320;

            describe('购买成功',function() {


                beforeAll(function() {
                    doAjax('/update/player/' + 113 ,{
                        power: JSON.stringify({
                            time: Date.now(),
                            value: 0
                        }),
                        gold: 320,
                        cash: 3856,
                        vip: 7
                    },function(){

                    });
                });

                beforeEach(function() {
                    loginWith('113','1',1);
                });

                var buyPower = function(time) {
                    it('第' + time + '次购买' ,function() {
                        console.log('第' + time + '次购买');
                        request('area.buyHandler.buyProduct',{id:2,times: 1},function(data) {
                            console.log(data);
                            if (data.code == 200) {
                                expect(data.code).toEqual(200);
                                power += BUY_POWER.power;
                                goldConsume = BUY_POWER.gold + 10*(time-1);
                                if (goldConsume > 60) {
                                    goldConsume = 60;
                                }
                                gold -= goldConsume;
                                
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
                            } else {
                                expect(data).toEqual({
                                    code: 501,
                                    msg: '魔石不足'
                                });
                            }
                            

                        })
                    })
                };

                for(var i = 1;i <= 8;i++) {
                    (function(i) {
                        buyPower(i);
                    })(i);
                };

            });

            describe('当魔石不足时', function() {

                beforeEach(function() {
                    doAjax('/player/113',{},function(msg) {
                        var player = msg.data;
                        console.log(player);
                        var dg = JSON.parse(player.dailyGift);

                        dg.powerBuyCount = 5;

                        doAjax('/update/player/' + 113 ,{
                            dailyGift: dg,
                            power: JSON.stringify({
                                time: Date.now(),
                                value: 0
                            }),
                            gold: 10
                        },function(){
                            loginWith('113','1',1);
                        });
                    });
                });

                describe('无法购买体力',function(){
                    it('购买1次',function() {

                        request('area.buyHandler.buyProduct',{id:2, times: 1},function(data) {

                            console.log(data);
                            expect(data.code).toEqual(501);
                            expect(data.msg).toEqual('魔石不足');


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
                            power: JSON.stringify({
                                time: Date.now(),
                                value: 0
                            }),
                            gold: 20
                        },function(){
                            loginWith('113','1',1);
                        });
                    });

                });

                it('无法购买体力',function() {

                    request('area.buyHandler.buyProduct',{id:2, times: 1},function(data) {

                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('体力购买次数已用完，VIP可购买更多');
                        doAjax('/player/113',{},function(msg) {
                            player = msg.data;
                            console.log(player);
                            expect(JSON.parse(player.power).value).toEqual(0);
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

                        dg.powerBuyCount = 1;

                        doAjax('/update/player/' + 113 ,{
                            dailyGift: dg,
                            power: JSON.stringify({
                                time: Date.now(),
                                value: 0
                            }),
                            gold: 200
                        },function(){

                        });
                    });

                });

                beforeEach(function(){
                    loginWith('113','1',1);
                });

                it('无法购买体力',function() {

                    request('area.buyHandler.buyProduct',{id:2 , times: 2},function(data) {

                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('所剩购买次数不足');
                        doAjax('/player/113',{},function(msg) {
                            player = msg.data;
                            console.log(player);
                            expect(JSON.parse(player.power).value).toEqual(0);
                            expect(player.gold).toEqual(200);
                        });

                    });

                });

            });

        });

    });
});
