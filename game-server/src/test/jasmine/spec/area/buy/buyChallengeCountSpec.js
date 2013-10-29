/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-21
 * Time: 下午3:45
 * To change this template use File | Settings | File Templates.
 */

describe("Area Server", function() {
    describe("Buy Handler", function() {
        describe("area.buyHandler.buyChallengeCount", function() {

            beforeAll(function() {
                doAjax('/loaddata/csv', {}, function() {
                    doAjax('/update/player/' + 114 ,{
                        gold: 200
                    },function(){});
                });

            });


            var BUY_CHALLENGECOUNT = { //购买体力
                "gold": 20
            };

            var challengeCount = 10;
            var challengeBuyCount = 10;
            var gold = 200;

            describe('购买失败', function() {
                beforeEach(function() {
                    loginWith('114','1',1);
                });
                it('一次性购买11次',function() {
                    request('area.buyHandler.buyProduct',{id:6,times: 11},function(data) {
                        console.log(data);
                        expect(data).toEqual({
                            code: 501,
                            msg: '超过购买次数上限'
                        });
                    });
                })
            });

            describe('购买成功', function() {

                beforeEach(function() {
                    loginWith('114','1',1);
                });

                var buyPower = function(time) {
                    it('第' + time + '次购买' ,function() {
                        request('area.buyHandler.buyProduct',{id:6,times: 1},function(data) {
                            console.log(data);
                            expect(data.code).toEqual(200);
                            challengeCount++;
                            challengeBuyCount--;
                            gold -= BUY_CHALLENGECOUNT.gold;
                            expect(data.msg.challengeCount).toEqual(1);
                            expect(data.msg.consume).toEqual({
                                "key": "gold",
                                "value": gold
                            });
                            doAjax('/player/114',{},function(msg) {
                                player = msg.data;
                                console.log(player);
                                expect(challengeCount).toEqual(JSON.parse(player.dailyGift).challengeCount);
                                expect(challengeBuyCount).toEqual(JSON.parse(player.dailyGift).challengeBuyCount);
                                expect(gold).toEqual(player.gold);
                            });

                        })
                    })
                };

                for(var i = 1;i <= 10;i++) {
                    (function(i) {
                        buyPower(i);
                    })(i);
                };

            });

            describe('当购买次数达到上限时', function() {

                beforeEach(function() {
                    loginWith('114','1',1);
                });

                it('无法购买有奖竞技次数',function() {

                    request('area.buyHandler.buyProduct',{id:6,times: 1},function(data) {

                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('购买次数已经用完');
                        doAjax('/player/114',{},function(msg) {
                            player = msg.data;
                            console.log(player);
                            expect(JSON.parse(player.dailyGift).challengeCount).toEqual(20);
                            expect(player.gold).toEqual(0);
                        });

                    });

                });


            });

            describe('当元宝不足时', function() {

                beforeEach(function() {
                    doAjax('/player/114',{},function(msg) {
                        player = msg.data;
                        console.log(player);
                        var dg = JSON.parse(player.dailyGift);

                        dg.challengeCount = 0;
                        dg.challengeBuyCount = 1;

                        doAjax('/update/player/' + 114 ,{
                            dailyGift: dg,
                            gold: 10
                        },function(){
                            loginWith('114','1',1);
                        });
                    });
                });


                it('无法购买有奖竞技次数',function() {

                    request('area.buyHandler.buyProduct',{id:6,times: 1},function(data) {

                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('元宝不足');
                        doAjax('/player/114',{},function(msg) {
                            player = msg.data;
                            console.log(player);
                            expect(JSON.parse(player.dailyGift).challengeCount).toEqual('0');
                            expect(JSON.parse(player.dailyGift).challengeBuyCount).toEqual('1');
                            expect(player.gold).toEqual(10);
                        });

                    });

                });
            });

        });

    });
});
