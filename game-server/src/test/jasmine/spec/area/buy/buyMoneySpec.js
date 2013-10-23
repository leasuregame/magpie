/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-21
 * Time: 上午11:58
 * To change this template use File | Settings | File Templates.
 */

describe("Area Server", function() {
    describe("Buy Handler", function() {
        describe("area.buyHandler.buyMoney", function() {

            beforeAll(function(){
                doAjax('/update/player/' + 112 ,{
                    money: 0,
                    gold: 200
                },function(){});
            });

            beforeEach(function(){
                loginWith('112','1',1);
            })

            describe("购买类型错误",function() {

                it('购买类型：0',function(){
                    request('area.buyHandler.buyMoney',{type: 0},function(data) {
                        console.log(data);
                        expect(data.code).toEqual(500);
                        expect(data.msg).toEqual('购买类型错误');

                    });
                });

                it('购买类型：4',function(){
                    request('area.buyHandler.buyMoney',{type: 4},function(data) {
                        console.log(data);
                        expect(data.code).toEqual(500);
                        expect(data.msg).toEqual('购买类型错误');

                    });
                })

            });

            var BUY_MONEY = { //购买仙币类型
                "1": {
                    "gold": 10,
                    "money": 1000 + 200
                },
                "2": {
                    "gold": 50,
                    "money": 5000 + 1000
                },
                "3": {
                    "gold": 100,
                    "money": 10000 + 3000
                }
            };

            describe("购买成功",function() {
                var money = 0;
                var gold = 200;

                var buyMoney = function(type) {
                    it('购买类型：' + type ,function() {
                        request('area.buyHandler.buyMoney',{type: type},function(data) {
                            console.log('type = ' + type ,data);
                            expect(data.code).toEqual(200);
                            money += BUY_MONEY[type].money;
                            gold -=  BUY_MONEY[type].gold;
                            expect(money).toEqual(data.msg.money);
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

            describe("元宝不足",function() {

                it('购买类型：3',function() {
                    request('area.buyHandler.buyMoney',{type: 3},function(data) {
                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('元宝不足');
                    });
                });

            });
        });
    });
});

