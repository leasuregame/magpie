/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-2
 * Time: 下午6:26
 * To change this template use File | Settings | File Templates.
 */


/*
 * player test
 *
 * insert -> dao -> get -> domain -> update -> save -> cb -> judge
 * */


// require('./setup');
// app = require("pomelo").app;
// var dao = app.get('dao');
var Player = require('../../app/domain/entity/player');
var Card = require('../../app/domain/entity/card');
var should = require("should");

describe("Player Object", function() {
    var data = {
        id: 234590,
        userId: 1,
        areaId: 1,
        name: "lcc",
        lv: 1
    };

    describe('.activeGroupEffect()', function() {
        var attrs = {
            id: 1,
            userId: 1,
            areaId: 1,
            name: 'noname',
            lv: 1,
            lineUp: '[{"1": 1, "2": 2, "6": -1}, {"1": 8, "2": 9, "6": -1}]'
        };

        var p = new Player(attrs);
        var cards = [{
            id: 1,
            tableId: 25
        }, {
            id: 2,
            tableId: 45
        }, {
            id: 8,
            tableId: 244
        }, {
            id: 9,
            tableId: 964
        }].map(function(c) {
            return new Card(c);
        })
        p.addCards(cards);

        it('should can active group effect', function() {
            p.getCard(1).ability().should.be.equal(3990);
            p.getCard(2).ability().should.be.equal(3990);
            p.getCard(8).ability().should.be.equal(2630);
            p.getCard(9).ability().should.be.equal(2630);
        });
    });

    // describe("#save", function () {
    //     var player = null;

    //     before(function (done) {
    //         app.get("dbClient")["delete"]("delete from player", [], function () {
    //             app.get("dbClient")["insert"]("insert into player (id, createTime, userId, areaId, name, lv) value (?, ?, ?, ?, ?, ?);",
    //                 [
    //                     data.id,
    //                     Date.now(),
    //                     data.userId,
    //                     data.areaId,
    //                     data.name,
    //                     data.lv
    //                 ],
    //                 function (err, res) {
    //                     dao.player.fetchOne({sync: true, where: {id:data.id}}, function (err, res) {
    //                         player = res;
    //                         return done();
    //                     });
    //                 });
    //         });
    //     });

    //     after(function (done) {
    //         app.get("dbClient")["delete"]("delete from player", [], function () {
    //             done();
    //         });
    //     });

    //     it("should can be save when player is no null", function (done) {
    //         player.should.be.a("object");
    //         player.increase("lv");

    //         player.save(function (err, res) {
    //             should.strictEqual(err, null);
    //             res.should.be.true;
    //             return done();
    //         });
    //     });
    // });

    describe("card actions", function() {

        describe(".addCard()", function() {
            it("should can be add a card", function() {
                var player = new Player();
                var cardId = 4;
                player.addCard(new Card({
                    id: cardId
                }));
                player.cards.should.not.eql({});
                player.cards[cardId].should.be.an.instanceOf(Card);
            });

            it("should only can add a Card instance", function() {
                var player = new Player();

                (function() {

                    player.addCard(1)
                }).should.
                throw('should only can add a Card instance');
            });
        });


        describe(".addCards()", function() {
            it("should can be add multiple cards", function() {

                var player1 = new Player();

                player1.addCards([
                    new Card({
                        id: 1
                    }),
                    new Card({
                        id: 2
                    })
                ]);
                _.keys(player1.cards).length.should.be.equal(2);
                player1.cards[1].should.be.an.instanceOf(Card);
                player1.cards[2].should.be.an.instanceOf(Card);
            });


            it("should only can add Card instances", function() {
                var player = new Player();
                (function() {
                    player.addCards([1, 2])
                }).should.throw('should only can add a Card instance');

            })
        });

        var myPlayer = new Player({
            id: 1,
            name: 'arthur',
            lineUp: '00:1,01:2,02:3,10:4,11:5',
            cards: {
                1: new Card({
                    id: 1
                }),
                2: new Card({
                    id: 2
                }),
                3: new Card({
                    id: 3
                }),
                4: new Card({
                    id: 4
                }),
                5: new Card({
                    id: 5
                })
            }
        });


        describe('.getCard()', function() {
            it('should can be get a card by id', function() {
                myPlayer.getCard(1).should.be.an.instanceOf(Card);
                myPlayer.getCard(1).id.should.be.equal(1);
            });
        });


        describe('.hasCard()', function() {
            it('should can check if has card by id', function() {
                myPlayer.hasCard(2).should.be.equal(true);
            });
        });


        describe('.getCards()', function() {
            it('should can get card list by id list', function() {
                var cards = myPlayer.getCards([1, 2, 3]);
                cards.length.should.be.equal(3);
                cards.map(function(c) {

                    return c.id;
                }).should.be.eql([1, 2, 3]);
            });
        });


        describe('.popCards()', function() {
            it('should can remove cards by id list', function() {

                myPlayer.popCards([1, 2]);
                _.keys(myPlayer.cards).should.eql(['3', '4', '5']);
            });
        });
    });


    describe('.lineUpObj()', function() {
        it('should can return correct line up object', function() {

            var player = new Player({
                lineUp: '00:1,01:2,02:3,10:4,11:5'
            });
            player.lineUpObj().should.eql({
                '1': 1,
                '2': 2,
                '3': 3,
                '4': 4,
                '5': 5
            });
        });
    });


    describe('.activeCards()', function() {
        it('should can get all active cards', function() {
            var player = new Player({
                id: 1,
                name: 'arthur',
                lineUp: '00:1,01:2,02:3,10:4,11:5',
                cards: {
                    1: new Card({
                        id: 1
                    }),
                    2: new Card({
                        id: 2
                    }),
                    3: new Card({
                        id: 3
                    }),
                    4: new Card({
                        id: 4
                    }),
                    5: new Card({
                        id: 5
                    })
                }


            });
            var cards = player.activeCards();
            cards.length.should.be.equal(5);
            cards.map(function(c) {
                return c.id;
            }).sort().should.eql([1, 2, 3, 4, 5]);
        });
    });


    describe('.consumePower()', function() {
        it('should can consume power with the given value', function() {

            var player = new Player({
                power: {
                    time: 0,
                    value: 100
                }
            });

            player.consumePower(50);
            player.get('power').value.should.be.equal(50);
            player.changedFields.should.include('power');

            player.consumePower(60);
            player.get('power').value.should.be.equal(0);
            player.changedFields.should.include('power');
        });
    });


    describe('.givePower()', function() {
        it('should can give power with the given value', function() {

            var player = new Player({
                lv: 30,
                power: {
                    time: Date.now(),
                    value: 5
                }
            });

            player.givePower(12, 40);
            player.get('power').value.should.be.equal(45);
            player.dailyGift.powerGiven.should.be.eql([12]);

            player.givePower(18, 100);
            player.get('power').value.should.be.equal(100);
            player.dailyGift.powerGiven.should.be.eql([12, 18]);

        });
    });


    describe('.resumePower(),', function() {

        it('should can resume power with the given value', function() {
            var player = new Player({
                lv: 30,
                power: {
                    time: Date.now(),
                    value: 5
                }
            });
            player.resumePower(40);
            player.get('power').value.should.be.equal(45);
            player.resumePower(40);
            player.get('power').value.should.be.equal(50);

            player.givePower(12, 40);
            player.resumePower(40);
            player.get('power').value.should.be.equal(90);
        })
    });


    describe('.updateLineUp()', function() {
        it('should can update lineUp by pass a lineUp object', function() {
            var player = new Player({
                lineUp: '00:1,01:2,02:3,10:4,11:5'
            });
            player.lineUpObj().should.be.equal('00:1,01:2,02:3,10:4,11:5');
            player.updateLineUp({
                1: 5,
                2: 4,
                3: 2,
                4: 3,
                5: 1
            });
            player.lv.should.be.equal(1);
            player.lineUp.should.be.equal('00:5,01:4,02:2,10:3,11:1');
        });
    });


    describe('.getAbility()', function() {
        it('should can get the correct ability', function() {
            var player = new Player({
                id: 1,
                name: 'arthur',
                lineUp: '00:1,01:2,02:3,10:4,11:5',
                cards: {
                    1: new Card({
                        id: 1,
                        tableId: 1,
                        star: 1
                    }),
                    2: new Card({
                        id: 2,
                        tableId: 7,
                        star: 2
                    }),
                    3: new Card({
                        id: 3,
                        tableId: 13,
                        star: 3
                    }),
                    4: new Card({
                        id: 4,
                        tableId: 19,
                        star: 4
                    }),
                    5: new Card({
                        id: 5,
                        tableId: 25,
                        star: 5
                    }),
                    6: new Card({
                        id: 6,
                        tableId: 30,
                        star: 5
                    })
                }
            });

            console.log('-a-', player.activeCards());
            player.getAbility().should.equal(11436);
            player.ability.should.equal(11436);
            player.lineUp = '00:1,01:2,02:3,10:4,11:6';

            player.getAbility().should.equal(17314);
            player.ability.should.equal(17314);
        });
    });

    describe('.activeSpiritorEffect()', function() {
        describe('when new a player', function() {
            it('should active spiritor effect', function() {
                var player = new Player({
                    id: 1,
                    name: 'arthur',
                    lineUp: '00:1',
                    spiritor: {
                        lv: 10,
                        exp: 100,
                    },
                    cards: {
                        1: new Card({
                            id: 1,
                            tableId: 1,
                            star: 1
                        })
                    }
                });

                player.activeSpiritorEffect();
                player.activeCards().map(function(c) {
                    return c.toJson();

                }).should.eql([{
                    id: 1,
                    createTime: undefined,
                    playerId: undefined,
                    tableId: 1,
                    init_hp: 120,
                    init_atk: 59,
                    hp: 180,
                    atk: 88,
                    incs: {
                        group_hp: 0,
                        group_atk: 0,
                        spirit_hp: 60,
                        spirit_atk: 29,
                        ps_hp: 0,
                        ps_atk: 0,
                        elixir_hp: 0,
                        elixir_atk: 0

                    },
                    star: 1,
                    lv: 1,
                    exp: 0,
                    skillLv: 0,
                    skillPoint: 0,
                    elixir: 0,
                    hpAddition: 0,
                    atkAddition: 0,
                    passiveSkills: []
                }]);

            });
        });

        describe('when add a lineUp card', function() {
            it('should can update the line up card propertys', function() {
                var player = new Player({
                    lineUp: '00:1',
                    spiritor: {
                        lv: 1,
                        exp: 0
                    }
                });

                player.addCard(new Card({
                    id: 1,
                    tableId: 1,
                    lv: 5
                }));

                player.cards['1'].toJson().should.eql({
                    id: 1,
                    createTime: undefined,
                    playerId: undefined,
                    tableId: 1,
                    init_hp: 174,
                    init_atk: 85,
                    hp: 174,
                    atk: 85,
                    incs: {
                        group_hp: 0,
                        group_atk: 0,
                        spirit_hp: 0,
                        spirit_atk: 0,
                        ps_hp: 0,
                        ps_atk: 0,
                        elixir_hp: 0,
                        elixir_atk: 0
                    },
                    star: 1,
                    lv: 5,
                    exp: 0,
                    skillLv: 0,
                    skillPoint: 0,
                    elixir: 0,
                    hpAddition: 0,
                    atkAddition: 0,
                    passiveSkills: []
                });
            });
        });
    });


    describe('.isVip()', function() {

        it('should can get true while player is Vip', function() {


            var player = new Player({
                id: 1,
                vip: 0
            });

            player.isVip().should.equal(false);

            player.set('vip', 5);

            player.isVip().should.equal(true);

        });

    });


    describe('.isLineUpCard()', function() {

        it('should can get true when cardId in lineUpObj', function() {

            var player = new Player({
                id: 1,
                name: 'arthur',
                lineUp: '00:1,01:2,02:3,10:4,11:5',
                cards: {

                    1: new Card({
                        id: 1,
                        tableId: 1,
                        star: 1
                    }),
                    2: new Card({
                        id: 2,
                        tableId: 7,
                        star: 2
                    }),
                    3: new Card({
                        id: 3,
                        tableId: 13,
                        star: 3
                    }),
                    4: new Card({
                        id: 4,
                        tableId: 19,
                        star: 4
                    }),
                    5: new Card({
                        id: 5,
                        tableId: 25,
                        star: 5
                    }),
                    6: new Card({
                        id: 6,
                        tableId: 30,
                        star: 5
                    })
                }
            });

            player.isLineUpCard(player.cards[3]).should.equal(true);
            player.isLineUpCard(player.cards[5]).should.equal(false);
        });

    });

    describe('.strengthen()', function() {

        it('should can be strengthen by given cards', function() {
            var player = new Player({
                money: 100,
                cards: {
                    1: new Card({
                        id: 1,
                        tableId: 1,
                        star: 1,
                        lv: 1
                    }),
                    2: new Card({
                        id: 2,
                        tableId: 7,
                        star: 2,
                        lv: 1
                    }),
                    3: new Card({
                        id: 3,
                        tableId: 13,
                        star: 3,
                        lv: 1
                    }),
                    4: new Card({
                        id: 4,
                        tableId: 19,
                        star: 4,
                        lv: 1
                    })
                }
            });

            player.strengthen(6, [2, 3, 4], function(err, res, target) {
                err.should.eql({
                    code: 501,
                    msg: '找不到目标卡牌'
                });
                //res.should.eql(null)
            });

            player.strengthen(1, [5, 6, 5], function(err, res, target) {
                err.should.eql({
                    code: 501,
                    msg: '找不到素材卡牌'
                });
                //res.should.eql(null);
            });

            player.strengthen(1, [2, 3, 4], function(err, res, target) {
                err.should.eql({
                    code: 501,
                    msg: '铜板不足'
                });
                //res.should.eql(null);
            });

            player.set('money', 500);

            player.strengthen(1, [2, 3, 4], function(err, res, target) {

                res.should.eql({
                    exp_obtain: 300,
                    cur_lv: 3,
                    cur_exp: 69,
                    money_consume: parseInt(247)
                });
                target.lv.should.equal(3);
                target.exp.should.equal(69);
            });

        });
    });


    describe('.setPassMark()', function() {

        it('should can set passmark with given layer', function() {


            var player = new Player();
            player.pass.should.eql({
                layer: 0,
                mark: []
            });

            player.setPassMark(-1);
            player.setPassMark(101);
            player.setPassMark(11);
            player.setPassMark(12);

            player = new Player({
                pass: {
                    layer: 10,
                    mark: []
                }
            });
            player.setPassMark(1);
            player.pass.should.eql({
                layer: 10,
                mark: [1]
            });
            player.hasPassMark(1).should.equal(1);
            for (var i = 1; i <= 10; i++) {
                player.setPassMark(i);
            }
            player.pass.mark.should.eql([1023]);
            player.pass.mark[0].toString(2).should.equal('1111111111');

            player = new Player({
                pass: {
                    layer: 100,
                    mark: []
                }
            });
            for (var i = 1; i <= 100; i++) {
                player.setPassMark(i);
            }
            player.pass.mark.should.eql([
                1073741823,
                1073741823,
                1073741823,
                1023
            ]);
        });

    });


    describe('.hasPassMark()', function() {

        it('should can get has passmark with given layer', function() {

            var player = new Player();
            for (var i = 1; i <= 100; i++) {
                player.hasPassMark(i).should.equal(0);
            }

            var player = new Player({
                pass: {
                    layer: 50,
                    mark: [1023]
                }
            });
            for (var i = 1; i <= 10; i++) {
                player.hasPassMark(i).should.equal(1);
            }
            for (var i = 11; i <= 100; i++) {
                player.hasPassMark(i).should.equal(0);
            }

            var player = new Player({
                pass: {
                    layer: 100,
                    mark: []
                }
            });
            for (var i = 1; i <= 100; i++) {
                player.setPassMark(i);
            }
            player.pass.mark.should.eql([
                1073741823,
                1073741823,
                1073741823,
                1023
            ]);
            for (var i = 1; i <= 100; i++) {
                player.hasPassMark(i).should.equal(1);
            }
        });

    });

    describe('.incPass', function() {
        it('should can incPass', function() {
            var player = new Player();
            player.pass.layer = 48;
            player.incPass();
            player.incPass();
            player.pass.layer.should.equal(50);
            player.achievement.should.equal('');
            player.pass.layer = 100;
            player.incPass();
            player.pass.layer.should.equal(100);

        });
    });

    describe('.updateGift()', function() {
        it('should can update gift by given name and value', function() {

            var player = new Player();
            player.updateGift('lotteryCount', 10);
            player.updateGift('lotteryFreeCount', 2);
            player.updateGift('powerGiven', [12, 24]);
            player.updateGift('powerBuyCount', 5);
            player.updateGift('challengeCount', 12);

            player.updateGift('receivedBless', {
                count: 2,
                givers: [2, 3]
            });
            player.updateGift('gaveBless', {
                count: 2,
                receivers: [4, 5]
            });

            player.dailyGift.should.eql({
                lotteryCount: 10,
                lotteryFreeCount: 2, // 每日免费抽奖次数
                powerGiven: [12, 24], // 体力赠送情况
                powerBuyCount: 5, // 购买体力次数
                challengeCount: 12, // 每日有奖竞技次数
                receivedBless: { // 接收的祝福
                    count: 2,
                    givers: [2, 3]
                },
                gaveBless: { // 送出的祝福
                    count: 2,
                    receivers: [4, 5]
                }
            });

        })
    });


    describe('cash change', function() {
        it('should can recount Vip privilege by given player', function() {
            var player = new Player({
                cash: 0
            });


            // executeVipPrivilege(player);

            player.cash = 10;

            player.dailyGift.should.eql({
                lotteryCount: 500,
                lotteryFreeCount: 1, // 每日免费抽奖次数
                powerGiven: [], // 体力赠送情况
                powerBuyCount: 2, // 购买体力次数
                challengeCount: 15, // 每日有奖竞技次数
                receivedBless: { // 接收的祝福
                    count: 15,
                    givers: []
                },
                gaveBless: { // 送出的祝福
                    count: 15,
                    receivers: []
                }
            });

            player.spiritPool.should.eql({
                lv: 0,
                exp: 0,
                collectCount: 15

            });

            player.cash = 26860;

            player.dailyGift.should.eql({
                lotteryCount: 500,
                lotteryFreeCount: 10, // 每日免费抽奖次数
                powerGiven: [], // 体力赠送情况
                powerBuyCount: 9, // 购买体力次数
                challengeCount: 20, // 每日有奖竞技次数
                receivedBless: { // 接收的祝福
                    count: 25,
                    givers: []
                },
                gaveBless: { // 送出的祝福
                    count: 25,
                    receivers: []
                }
            });

            player.spiritPool.should.eql({
                lv: 0,
                exp: 0,
                collectCount: 20
            });

        });
    });

    describe('lv.change event', function() {
        it('when lv change should be emit lv.change event', function() {
            var ply = new Player({
                lv: 48
            });

            ply.achievement.should.eql('');

            ply.lv.should.equal(48);
            ply.increase('lv');
            ply.lv.should.equal(49);
            ply.increase('lv');
            ply.achievement.should.eql({
                '1': {
                    method: 'levelTo',
                    isAchieve: true,
                    got: 50,
                    need: 50
                },
                '2': {
                    method: 'levelTo',
                    isAchieve: false,
                    got: 50,
                    need: 90
                }
            });

            ply.set('lv', 90);
            ply.lv.should.equal(90);
            ply.achievement.should.eql({
                '1': {
                    method: 'levelTo',
                    isAchieve: true,
                    got: 50,
                    need: 50
                },
                '2': {
                    method: 'levelTo',
                    isAchieve: true,
                    got: 90,
                    need: 90
                }
            })
        });
    });

    describe('exp.change event', function() {
        it('when exp change should be emit exp.change event', function() {
            var ply = new Player({
                exp: 10
            });

            ply.increase('exp', 100);
            ply.exp.should.equal(7);
            ply.lv.should.equal(4);

            ply.achievement.should.eql({
                '1': {
                    method: 'levelTo',
                    isAchieve: false,
                    got: 4,
                    need: 50
                },
                '2': {
                    method: 'levelTo',
                    isAchieve: false,
                    got: 4,
                    need: 90
                }
            })
        });
    });

    describe('pass.change event', function() {
        it('when pass change should be emit pass.change event', function() {
            var ply = new Player();

            ply.incPass();
            ply.pass.layer.should.equal(1);
            ply.achievement.should.eql({
                '3': {
                    method: 'passTo',
                    isAchieve: false,
                    got: 1,
                    need: 50
                },
                '4': {
                    method: 'passTo',
                    isAchieve: false,
                    got: 1,
                    need: 100
                }
            });
        });
    });

    describe('give.bless event', function() {
        it('when give bless, should be emit give.bless event', function() {
            var ply = new Player();

            ply.giveBlessOnce();
            ply.achievement.should.eql({
                '11': {
                    method: 'gaveBless',
                    isAchieve: false,
                    got: 1,
                    need: 500
                }
            });

            ply.giveBlessOnce();
            ply.achievement.should.eql({
                '11': {
                    method: 'gaveBless',
                    isAchieve: false,
                    got: 2,
                    need: 500
                }
            });
        });
    });

    describe('receive.bless event', function() {
        it('when receive bless, should be emit receive.bless event', function() {
            var ply = new Player();

            ply.receiveBlessOnce();
            ply.achievement.should.eql({
                '12': {
                    method: 'receivedBless',
                    isAchieve: false,
                    got: 1,
                    need: 100
                }
            });

            ply.receiveBlessOnce();
            ply.achievement.should.eql({
                '12': {
                    method: 'receivedBless',
                    isAchieve: false,
                    got: 2,
                    need: 100
                }
            });
        });
    });

    describe('.setTaskMark()', function() {
        it('should can set the right task mark', function() {
            var ply = new Player();
            ply.task.should.eql({
                id: 1,
                progress: 0,
                hasWin: false,
                mark: []
            });

            ply.setTaskMark(1);
            ply.task.mark.should.eql([1]);

            ply.setTaskMark(10);
            ply.task.mark.should.eql([513]);
            ply.task.mark[0].toString(2).should.equal('1000000001');

            for (var i = 1; i <= 30; i++) {
                ply.setTaskMark(i);
            }

            ply.task.mark.length.should.equal(1);
            ply.task.mark.should.eql([1073741823]);
            ply.task.mark[0].toString(2).should.equal('111111111111111111111111111111');

            ply.setTaskMark(31);
            ply.task.mark.should.eql([1073741823, 1]);
            ply.setTaskMark(50);
            ply.task.mark.should.eql([1073741823, 524289]);
            ply.setTaskMark(60);
            ply.task.mark.should.eql([1073741823, 537395201]);

            for (var i = 31; i <= 60; i++) {
                ply.setTaskMark(i);
            }
            ply.task.mark.should.eql([1073741823, 1073741823]);
        });
    });

    describe('.hasTaskMark()', function() {
        it('should can check if has mark for the given chapeter', function() {
            var ply = new Player();
            ply.hasTaskMark(1).should.equal(0);

            for (var i = 1; i <= 50; i++) {
                ply.hasTaskMark(i).should.equal(0);
            }

            ply.setTaskMark(1);
            ply.hasTaskMark(1).should.equal(1);

            for (var i = 1; i <= 50; i++) {
                ply.setTaskMark(i);
                ply.hasTaskMark(i).should.equal(1);
            }
            ply.task.mark.should.eql([1073741823, 1048575]);
        });
    });

    describe('.incSpirit', function() {
        it('should can inc spirit when spirit lv is not max', function() {
            var player = new Player();
            player.spiritor = {
                lv: 0,
                spirit: 0
            };

            player.incSpirit(1000);

            player.spiritor.should.eql({
                lv: 2,
                spirit: 50
            });
        });

        it('should can not inc spirit when spirit lv is max', function() {
            var player = new Player();
            player.spiritor = {
                lv: 10,
                spirit: 0
            };

            player.incSpirit(1000);

            player.spiritor.should.eql({
                lv: 10,
                spirit: 1000
            });
        })
    });


    describe('.incSpiritPoolExp', function() {
        it('should can inc SpiritPool when SpiritPool lv is not max', function() {
            var player = new Player();
            player.spiritPool = {
                lv: 0,
                exp: 0,
                collectCount: 5
            };
            player.incSpiritPoolExp(300);

            player.spiritPool.should.eql({
                lv: 2,
                exp: 25,
                collectCount: 5
            });
        });

        it('should can not inc SpiritPool when SpiritPool lv is max', function() {
            var player = new Player();
            player.spiritPool = {
                lv: 10,
                exp: 0,
                collectCount: 5
            };
            player.incSpiritPoolExp(10000);

            player.spiritPool.should.eql({
                lv: 10,
                exp: 10000,
                collectCount: 5
            });
        });
    });

    describe('exp.change event', function() {
        it('should can inc player lv when player lv is not max and exp enough', function() {

            var player = new Player();
            player.lv = 1;
            player.exp = 0;

            player.increase('exp', 70);
            player.lv.should.eql(3);
            player.exp.should.eql(4);

        });

        it('should can inc player lv when player exp is enough but lv is max', function() {
            var player = new Player();
            player.lv = 100;
            player.exp = 0;

            player.increase('exp', 500000);
            player.lv.should.eql(100);
            player.exp.should.eql(500000);
        });

    });

    describe('increase gold to the limit value', function() {
        it('when gold is 999999, should can not increase gold', function() {
            var player = new Player();
            player.gold = 999999;

            player.increase(10);
            player.gold.should.eql(999999);

            player.increase();
            player.gold.should.eql(999999);
        });
    });

});