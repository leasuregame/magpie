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


require('./setup');
app = require("pomelo").app;
var dao = app.get('dao');
var Player = require('../../app/domain/entity/player');
var Card = require('../../app/domain/entity/card');
var should = require("should");

describe("Player Object", function () {
    var data = {
        id: 234590,
        userId: 1,
        areaId: 1,
        name: "lcc",
        lv: 1
    };

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

    describe("card actions", function () {

        describe(".addCard()", function () {
            it("should can be add a card", function () {
                var player = new Player();
                var cardId = 4;
                player.addCard(new Card({id: cardId}));
                player.cards.should.not.eql({});
                player.cards[cardId].should.be.an.instanceOf(Card);
            });

            it("should only can add a Card instance", function () {
                var player = new Player();

                (function () {
                    player.addCard(1)
                }).should.throw('should only can add a Card instance');
            });
        });

        describe(".addCards()", function () {
            it("should can be add multiple cards", function () {
                var player1 = new Player();

                player1.addCards([
                    new Card({id: 1}),
                    new Card({id: 2})
                ]);
                _.keys(player1.cards).length.should.be.equal(2);
                player1.cards[1].should.be.an.instanceOf(Card);
                player1.cards[2].should.be.an.instanceOf(Card);
            });

            it("should only can add Card instances", function () {
                var player = new Player();
                (function () {
                    player.addCards([1, 2])
                }).should.throw('should only can add a Card instance');
            })
        });

        var myPlayer = new Player(
            {
                id: 1,
                name: 'arthur',
                lineUp: '00:1,01:2,02:3,10:4,11:5',
                cards: {
                    1: new Card({id: 1}),
                    2: new Card({id: 2}),
                    3: new Card({id: 3}),
                    4: new Card({id: 4}),
                    5: new Card({id: 5})
                }
            }
        );

        describe('.getCard()', function () {
            it('should can be get a card by id', function () {
                myPlayer.getCard(1).should.be.an.instanceOf(Card);
                myPlayer.getCard(1).id.should.be.equal(1);
            });
        });

        describe('.hasCard()', function () {
            it('should can check if has card by id', function () {
                myPlayer.hasCard(2).should.be.equal(true);
            });
        });

        describe('.getCards()', function () {
            it('should can get card list by id list', function () {
                var cards = myPlayer.getCards([1, 2, 3]);
                cards.length.should.be.equal(3);
                cards.map(function (c) {
                    return c.id;
                }).should.be.eql([1, 2, 3]);
            });
        });

        describe('.popCards()', function () {
            it('should can remove cards by id list', function () {
                myPlayer.popCards([1, 2]);
                _.keys(myPlayer.cards).should.eql(['3', '4', '5']);
            });
        });
    });

    describe('.lineUpObj()', function () {
        it('should can return correct line up object', function () {
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

    describe('.activeCards()', function () {
        it('should can get all active cards', function () {
            var player = new Player(
                {
                    id: 1,
                    name: 'arthur',
                    lineUp: '00:1,01:2,02:3,10:4,11:5',
                    cards: {
                        1: new Card({id: 1}),
                        2: new Card({id: 2}),
                        3: new Card({id: 3}),
                        4: new Card({id: 4}),
                        5: new Card({id: 5})
                    }
                }
            );
            var cards = player.activeCards();
            cards.length.should.be.equal(5);
            cards.map(function (c) {
                return c.id;
            }).sort().should.eql([1, 2, 3, 4, 5]);
        });
    });

    describe('.consumePower()', function () {
        it('should can consume power with the given value', function () {
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

    describe('.givePower()', function () {
        it('should can give power with the given value', function () {
            var player = new Player({
                lv: 30,
                power: {
                    time: 0,
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

    describe('.resumePower(),', function () {

        it('should can resume power with the given value', function () {
            var player = new Player({
                lv: 30,
                power: {
                    time: 0,
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


    describe('.updateLineUp()', function () {
        it('should can update lineUp by pass a lineUp object', function () {
            var player = new Player({
                lineUp: '00:1,01:2,02:3,10:4,11:5'
            });
            player.updateLineUp({
                1: 5,
                2: 4,
                3: 2,
                4: 3,
                5: 1
            });
            player.lineUp.should.be.equal('00:5,01:4,02:2,10:3,11:1');
        });
    });

    describe('.getAbility()', function () {
        it('should can get the correct ability', function () {
            var player = new Player({
                id: 1,
                name: 'arthur',
                lineUp: '00:1,01:2,02:3,10:4,11:5',
                cards: {
                    1: new Card({id: 1, tableId: 1, star: 1}),
                    2: new Card({id: 2, tableId: 7, star: 2}),
                    3: new Card({id: 3, tableId: 13, star: 3}),
                    4: new Card({id: 4, tableId: 19, star: 4}),
                    5: new Card({id: 5, tableId: 25, star: 5}),
                    6: new Card({id: 6, tableId: 30, star: 5})
                }
            });

            player.ability.should.equal(17800);
            player.getAbility().should.equal(17800);

            player.lineUp = '00:1,01:2,02:3,10:4,11:6';
            player.ability.should.equal(17844);
            player.getAbility().should.equal(17844);
        });
    });

    describe('.activeSpiritorEffect()', function () {
        describe('when new a player', function () {
            it('should active spiritor effect', function () {
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
                player.activeCards().map(function (c) {
                    return c.toJson();
                }).should.eql([
                        {
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
                        }
                    ]);
            });
        });

        describe('when add a lineUp card', function () {
            it('should can update the line up card propertys', function () {
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
                    hp: 182,
                    atk: 89,
                    incs: {
                        group_hp: 0,
                        group_atk: 0,
                        spirit_hp: 8,
                        spirit_atk: 4,
                        ps_hp: 0,
                        ps_atk: 0
                    },
                    star: 1,
                    lv: 5,
                    exp: 0,
                    skillLv: 1,
                    skillPoint: 0,
                    elixir: 0,
                    hpAddition: 0,
                    atkAddition: 0,
                    passiveSkills: []
                });
            });
        });
    });

    describe('.isVip()', function () {

        it('should can get true while player is Vip', function () {

            var player = new Player({
                id: 1,
                vip: 0
            });

            player.isVip().should.equal(false);

            player.set('vip', 5);

            player.isVip().should.equal(true);

        });

    });

    describe('.isLineUpCard()', function () {

        it('should can get true when cardId in lineUpObj', function () {

            var player = new Player({
                id: 1,
                name: 'arthur',
                lineUp: '00:1,01:2,02:3,10:4,11:5',
                cards: {
                    1: new Card({id: 1, tableId: 1, star: 1}),
                    2: new Card({id: 2, tableId: 7, star: 2}),
                    3: new Card({id: 3, tableId: 13, star: 3}),
                    4: new Card({id: 4, tableId: 19, star: 4}),
                    5: new Card({id: 5, tableId: 25, star: 5}),
                    6: new Card({id: 6, tableId: 30, star: 5})
                }
            });

            player.isLineUpCard(player.cards[3]).should.equal(true);
            player.isLineUpCard(player.cards[5]).should.equal(false);
        });

    });

    describe('.strengthen()', function () {

        it('should can be strengthen by given cards', function () {
            var player = new Player({
                money: 100,
                cards: {
                    1: new Card({id: 1, tableId: 1, star: 1, lv: 1}),
                    2: new Card({id: 2, tableId: 7, star: 2, lv: 1}),
                    3: new Card({id: 3, tableId: 13, star: 3, lv: 1}),
                    4: new Card({id: 4, tableId: 19, star: 4, lv: 1})
                }
            });

            player.strengthen(6, [2, 3, 4], function (err, res, target) {
                err.should.eql({
                    code: 501,
                    msg: '找不到目标卡牌'});
                //res.should.eql(null)
            });

            player.strengthen(1, [5, 6, 5], function (err, res, target) {
                err.should.eql({
                    code: 501,
                    msg: '找不到素材卡牌'
                });
                //res.should.eql(null);
            });

            player.strengthen(1, [2, 3, 4], function (err, res, target) {
                err.should.eql({
                    code: 501,
                    msg: '铜板不足'
                });
                //res.should.eql(null);
            });

            player.set('money', 500);
            player.strengthen(1, [2, 3, 4], function (err, res, target) {
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

    describe('.setPassMark()', function () {

        it('should can set passmark with given layer', function () {

            var player = new Player();
            player.pass.layer = 10;
            player.setPassMark(-1);
            //  player.pass.layer.should.equal(10);

            player.setPassMark(101);
            //  player.pass.layer.should.equal(10);

            player.setPassMark(11);
            //player.pass.layer.should.equal(10);
            player.pass.mark[10].should.equal(1);

            player.setPassMark(12);

        });

    });

    describe('.hasPassMark()', function () {

        it('should can get has passmark with given layer', function () {

            var player = new Player();
            player.pass.layer = 10;

            player.hasPassMark(11).should.equal(false);
            player.setPassMark(11);
            player.hasPassMark(11).should.equal(true);
            player.hasPassMark(12).should.equal(false);

        });

    });

    describe('.incPass', function () {
        it('should can incPass', function () {
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

    describe('.updateGift()', function () {
        it('should can update gift by given name and value', function () {
            var player = new Player();
            player.updateGift('lotteryCount', 10);
            player.updateGift('lotteryFreeCount', 2);
            player.updateGift('powerGiven', [12, 24]);
            player.updateGift('powerBuyCount', 5);
            player.updateGift('challengeCount', 12);
            player.updateGift('receivedBless', {count: 2, givers: [2, 3]});
            player.updateGift('gaveBless', {count: 2, receivers: [4, 5]});

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

    describe('cash change', function () {
        it('should can recount Vip privilege by given player', function () {
            var player = new Player({
                cash:0
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
                lv:0,
                exp:0,
                collectCount:15
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
                lv:0,
                exp:0,
                collectCount:20
            });

        });
    });

    describe('lv.change event', function(){
        
    });

});