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
var Player = require('../../app/domain/player');
var Card = require('../../app/domain/card');
var should = require("should");

describe("Player Object", function () {
    var data = {
        id: 234590,
        userId: 1,
        areaId: 1,
        name: "lcc",
        lv: 1
    };

    describe("#save", function () {
        var player = null;

        before(function (done) {
            app.get("dbClient")["delete"]("delete from player", [], function () {
                app.get("dbClient")["insert"]("insert into player (id, createTime, userId, areaId, name, lv) value (?, ?, ?, ?, ?, ?);",
                    [
                        data.id,
                        Date.now(),
                        data.userId,
                        data.areaId,
                        data.name,
                        data.lv
                    ],
                    function (err, res) {
                        dao.player.fetchOne({sync: true, where: {id:data.id}}, function (err, res) {
                            player = res;
                            return done();
                        });
                    });
            });
        });

        after(function (done) {
            app.get("dbClient")["delete"]("delete from player", [], function () {
                done();
            });
        });

        it("should can be save when player is no null", function (done) {
            player.should.be.a("object");
            player.increase("lv");

            player.save(function (err, res) {
                should.strictEqual(err, null);
                res.should.be.true;
                return done();
            });
        });
    });

    describe(".addCard()", function(){
        var player;

        it("should can be add a card", function() {
            player = new Player();
            var cardId = 0;
            player.addCard(new Card({id: cardId}));
            player.cards.should.not.eql({});
            player.cards[cardId].should.be.an.instanceOf(Card);
        });

        it("should only can add a Card instance", function(){
            player = new Player();
            
            (function(){
                player.addCard(1)
            }).should.throw('should only can add a Card instance');
        });
    });
    
    describe(".addCards()", function(){
        it("should can be add multiple cards", function(){
            var player = new Player();
            player.addCards([
                new Card({id: 1}),
                new Card({id: 2})
            ]);
            _.keys(player.cards).length.should.eql([1,2]);
            player.cards[1].should.be.an.instanceOf(Card);
            player.cards[2].should.be.an.instanceOf(Card);
        });

        it("should only can add Card instances", function(){
            var player = new Player();
            (function(){
                player.addCards([1,2])
            }).should.throw('should only can add a Card instance');
        })
    });

    describe('.activeCards()', function(){
        it('should can get all active cards', function(){
            var player = new Player(
                {
                    id: 1,
                    name: 'arthur'
                }
            );
        })
    })

    
});