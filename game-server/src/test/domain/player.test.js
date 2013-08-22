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

    describe("card actions", function(){

        describe(".addCard()", function(){
            it("should can be add a card", function() {
                var player = new Player();
                var cardId = 4;
                player.addCard(new Card({id: cardId}));
                player.cards.should.not.eql({});
                player.cards[cardId].should.be.an.instanceOf(Card);
            });

            it("should only can add a Card instance", function(){
                var player = new Player();
                
                (function(){
                    player.addCard(1)
                }).should.throw('should only can add a Card instance');
            });
        });
        
        describe(".addCards()", function(){
            it("should can be add multiple cards", function(){
                var player1 = new Player();

                player1.addCards([
                    new Card({id: 1}),
                    new Card({id: 2})
                ]);
                _.keys(player1.cards).length.should.be.equal(2);
                player1.cards[1].should.be.an.instanceOf(Card);
                player1.cards[2].should.be.an.instanceOf(Card);
            });

            it("should only can add Card instances", function(){
                var player = new Player();
                (function(){
                    player.addCards([1,2])
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

        describe('.getCard()', function(){
            it('should can be get a card by id', function(){
                myPlayer.getCard(1).should.be.an.instanceOf(Card);
                myPlayer.getCard(1).id.should.be.equal(1);
            });
        });

        describe('.hasCard()', function(){
            it('should can check if has card by id', function(){
                myPlayer.hasCard(2).should.be.equal(true);
            });
        });

        describe('.getCards()', function(){
            it('should can get card list by id list', function(){
                var cards = myPlayer.getCards([1,2,3]);
                cards.length.should.be.equal(3);
                cards.map(function(c){
                    return c.id;
                }).should.be.eql([1,2,3]);
            });
        });

        describe('.popCards()', function(){
            it('should can remove cards by id list', function(){
                myPlayer.popCards([1,2]);
                _.keys(myPlayer.cards).should.eql(['3','4','5']);
            });
        });
    });

    describe('.lineUpObj()', function(){
        it('should can return correct line up object', function(){
            var player = new Player({
                lineUp:  '00:1,01:2,02:3,10:4,11:5'
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

    describe('.activeCards()', function(){
        it('should can get all active cards', function(){
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
            cards.map(function(c) {
                return c.id;
            }).sort().should.eql([1,2,3,4,5]);
        });
    });

    describe('.consumePower()', function(){
        it('should can consume power with the given value', function(){
            var player = new Player({
                power: 100
            });

            player.consumePower(50);
            player.get('power').should.be.equal(50);
            player.changedFields.should.include('power');

            player.consumePower(60);
            player.get('power').should.be.equal(0);
            player.changedFields.should.include('power');
        });
    });

    describe('.updateLineUp()', function(){
        it('should can update lineUp by pass a lineUp object', function(){
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

    describe('.getAbility()', function(){
        it('should can get the correct ability', function(){
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

    describe('.activeSpiritorEffect()', function(){
        describe('when new a player', function(){
            it('should active spiritor effect', function(){
                var player = new Player({
                    id: 1,
                    name: 'arthur',
                    lineUp: '00:1,01:2,02:3,10:4,11:5',
                    spiritor: {
                        lv: 1,
                        exp: 100,
                    },
                    cards: {
                        1: new Card({id: 1, tableId: 1, star: 1}),
                        2: new Card({id: 2, tableId: 7, star: 2}),
                        3: new Card({id: 3, tableId: 13, star: 3}),
                        4: new Card({id: 4, tableId: 19, star: 4}),
                        5: new Card({id: 5, tableId: 25, star: 5}),
                        6: new Card({id: 6, tableId: 30, star: 5})
                    }
                });
                player.activeSpiritorEffect();
                player.activeCards().map(function(c) {
                    return c.toJson();
                }).should.equal({});
            });
        });
    });
    
});