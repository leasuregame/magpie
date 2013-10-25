/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-21
 * Time: 上午11:58
 * To change this template use File | Settings | File Templates.
 */

describe("Area Server", function() {
    describe("Buy Handler", function() {
        describe("area.buyHandler.buyProduct", function() {



            describe("购买成功",function() {


                var BUY_MONEY = { //购买仙币类型
                    "1": {
                        "gold": 10,
                        "money": 1100
                    },
                    "2": {
                        "gold": 50,
                        "money": 6500
                    },
                    "3": {
                        "gold": 100,
                        "money": 15000
                    }
                };

                var money = 0;
                var gold = 200;

                beforeAll(function(){
                    doAjax('/update/player/' + 112 ,{
                        gold: 200,
                        money: 0
                    },function(){
                    });

                });

                beforeEach(function() {
                    loginWith('112','1',1);
                });

                var buyMoney = function(type) {
                    it('购买类型：' + type ,function() {
                        request('area.buyHandler.buyProduct',{id: type + 1,times: 1},function(data) {
                            console.log('type = ' + type ,data);
                            expect(data.code).toEqual(200);
                            money += BUY_MONEY[type].money;
                            gold -=  BUY_MONEY[type].gold;
                            expect(data.msg.money).toEqual(BUY_MONEY[type].money);
                            expect(data.msg.consume).toEqual({
                                "key": "gold",
                                "value": gold
                            });
                            doAjax('/player/112',{},function(msg) {
                                player = msg.data;
                                console.log(player);
                                expect(money).toEqual(player.money);
                                expect(gold).toEqual(player.gold);

                            });
                        });
                    });
                };

                for (var i = 1; i <= 3; i++) {
                    (function(i) {
                        buyMoney(i)
                    })(i);
                }


            });


            describe("购买失败", function() {

                beforeAll(function(){
                    doAjax('/update/player/' + 113 ,{
                        gold: 1000000
                    },function(){

                    });

                });

                beforeEach(function() {
                    loginWith('113','1',1);
                });

                describe("购买完仙币超出上限", function() {

                    it('购买类型：3,次数：10000',function(){
                        request('area.buyHandler.buyProduct',{id: 4,times: 10000},function(data) {
                            console.log(data);
                            expect(data.code).toEqual(501);
                            expect(data.msg).toEqual('超过仙币上限');

                        });
                    });

                });



            });


            describe("购买失败", function() {

                beforeAll(function(){
                    doAjax('/update/player/' + 114 ,{
                        gold: 50
                    },function(){

                    });

                });

                beforeEach(function() {
                    loginWith('114','1',1);
                });

                describe("元宝不足",function() {

                    it('一次性购买10次，购买类型：1',function() {
                        request('area.buyHandler.buyProduct',{id: 2,times: 10},function(data) {
                            console.log(data);
                            expect(data.code).toEqual(501);
                            expect(data.msg).toEqual('元宝不足');
                        });
                    });

                    it('一次性购买10次，购买类型：2',function() {
                        request('area.buyHandler.buyProduct',{id: 3,times: 10},function(data) {
                            console.log(data);
                            expect(data.code).toEqual(501);
                            expect(data.msg).toEqual('元宝不足');
                        });
                    });

                    it('一次性购买10次，购买类型：3',function() {
                        request('area.buyHandler.buyProduct',{id: 4,times: 10},function(data) {
                            console.log(data);
                            expect(data.code).toEqual(501);
                            expect(data.msg).toEqual('元宝不足');
                        });
                    });

                });
            });




        });
    });
});

