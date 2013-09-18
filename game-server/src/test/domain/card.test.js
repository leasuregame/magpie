/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-2
 * Time: 下午7:10
 * To change this template use File | Settings | File Templates.
 */


/*
 * card test
 *
 * insert -> dao -> get -> domain -> update -> save -> cb -> judge
 * */


require('./setup');
app = require("pomelo").app;
var dao = app.get('dao');
var Card = require('../../app/domain/entity/card');
var PassiveSkill = require('../../app/domain/entity/passiveSkill');
var should = require("should");

describe("Card Object", function() {
    var data = {
        id: 234590,
        playerId: 1,
        tableId: 1,
        lv: 10,
        exp: 10000,
        skillLv: 4,
        hpAddition: 100,
        atkAddition: 40
    };

    // describe("#save", function () {
    //     var card = null;

    //     before(function (done) {
    //         app.get("dbClient")["delete"]("delete from card", [], function () {
    //             app.get("dbClient")["insert"]("insert into card (id, createTime, playerId, tableId, lv, exp, skillLv, hpAddition, atkAddition) value (?, ?, ?, ?, ?, ?, ?, ?, ?);",
    //                 [
    //                     data.id,
    //                     Date.now(),
    //                     data.playerId,
    //                     data.tableId,
    //                     data.lv,
    //                     data.exp,
    //                     data.skillLv,
    //                     data.hpAddition,
    //                     data.atkAddition
    //                 ],
    //                 function (err, res) {
    //                     dao.card.fetchOne({sync: true, where: {id: data.id}}, function (err, res) {
    //                         card = res;
    //                         return done();
    //                     });
    //                 });
    //         });
    //     });

    //     after(function (done) {
    //         app.get("dbClient")["delete"]("delete from card", [], function () {
    //             done();
    //         });
    //     });

    //     it("should can be update card when card is no null", function (done) {
    //         card.should.be.a("object");
    //         card.increase("lv");
    //         card.save(function (err, res) {
    //             should.strictEqual(err, null);
    //             res.should.be.true;
    //             return done();
    //         });
    //     });
    // });

    describe('.ability()', function() {
        describe("when card's star less than 3", function() {
            it('should can count out ability of card', function() {
                var card = new Card({
                    id: 1,
                    tableId: 1
                });
                card.ability().should.equal(99);

                card = new Card({
                    id: 1,
                    tableId: 1,
                    lv: 10
                })
                card.ability().should.equal(225);

            });
        });

        describe("when card's star grater than 2", function() {
            it('should can count out ability of card', function() {
                var card = new Card({
                    id: 1,
                    tableId: 3,
                    star: 3
                });
                card.ability().should.equal(3867);

                card = new Card({
                    id: 1,
                    tableId: 3,
                    star: 3,
                    lv: 10
                });
                card.ability().should.equal(4210);

                card = new Card({
                    id: 1,
                    tableId: 3,
                    star: 3,
                    lv: 10,
                    passiveSkills: {
                        1: new PassiveSkill({
                            name: 'crit',
                            value: 10
                        })
                    }
                });
                card.ability().should.equal(5210);


                card = new Card({
                    id: 1,
                    tableId: 23,
                    star: 3,
                    lv: 10,
                    passiveSkills: {
                        1: new PassiveSkill({
                            name: 'crit',
                            value: 10
                        })
                    }
                });
                card.ability().should.equal(2040);

            });

        });
    });
    /*
    describe('.activeGroupEffect()', function() {
        it('should can active group effect', function() {
            var card = new Card({
                id: 1,
                tableId: 3,
                star: 3
            });
            card.activeGroupEffect();
            card.atkAddition.should.equal(29);
            card.hpAddition.should.equal(0);
        })
    });
    */
    describe('.addPassiveSkill()', function() {
        describe('when add a passive skill', function() {
            it('should can be add correct', function() {
                var card = new Card({
                    id: 1,
                    lv: 1,
                    tableId: 3
                });

                card.addPassiveSkill(new PassiveSkill({
                    id: 1,
                    cardId: 1,
                    name: 'hp_improve',
                    value: 5.3
                }));

                card.addPassiveSkill(new PassiveSkill({
                    id: 2,
                    cardId: 1,
                    name: 'atk_improve',
                    value: 10
                }));
                console.log(card.attributes);
                card.toJson().should.eql({
                    id: 1,
                    tableId: 3,
                    hp: 370,
                    atk: 170,
                    lv: 1,
                    exp: 0,
                    skillLv: 0,
                    skillPoint: 0,
                    elixirHp: 0,
                    elixirAtk: 0,
                    passiveSkills: [{
                        id: 1,
                        cardId: 1,
                        name: 'hp_improve',
                        value: 5.3
                    }, {
                        id: 2,
                        cardId: 1,
                        name: 'atk_improve',
                        value: 10
                    }]
                });
            });
        });
    });


    describe('eatCards()',function(){

        it('should counts when eat cards',function(){
            var card = new Card();
            var cards = [
                {lv:1},
                {lv:3},
                {lv:60}
            ]
            card.eatCards(cards).should.equal(306253);
        });
    });

    describe('.vitual_upgrade',function(){

        var card;

        beforeEach(function(){
            card = new Card({
                id:1,
                lv:10,
                star:5,
                exp:10
            });
        });

        it('should can not upgrade when exp not enough',function(){

            card.vitual_upgrade(100).should.eql([0,110]);
        });

        it('should can be upgrade when exp enough',function(){
            card.vitual_upgrade(1000).should.eql([3,146]);
        });

        it('should can be upgrade when exp enough to up max grade',function(){
            card.vitual_upgrade(1000000).should.eql([50,0]);
        });

    });

    describe('check hp and atk', function(){
        describe('card with no passive skill', function(){
            it('should can count the correct hp and atk', function(){
                var card = new Card({
                    tableId: 1,
                    lv: 1
                });
                card.hp.should.equal(103);
                card.atk.should.equal(59);

                card.lv = 10;
                card.hp.should.equal(parseInt(103 * 2.282));
                card.atk.should.equal(parseInt(59 * 2.282));

                card.lv = 50;
                card.hp.should.equal(parseInt(103 * 36.080));
                card.atk.should.equal(parseInt(59 * 36.080));

                card.addPassiveSkill({id: 1, name: 'hp_improve', value: 5});
                card.hp.should.equal(parseInt(103 * 36.080) + 185);
                
                card.addPassiveSkill({id: 2, name: 'atk_improve', value: 5});
                card.atk.should.equal(parseInt(59 * 36.080) + 106);

                card.elixirHp = 1000;
                card.hp.should.equal(parseInt(103 * 36.080) + 185 + 200);
                card.atk.should.equal(parseInt(59 * 36.080) + 106);

                card.elixirAtk = 1000;
                card.hp.should.equal(parseInt(103 * 36.080) + 185 + 200);
                card.atk.should.equal(parseInt(59 * 36.080) + 106 + 100);
            });
        });
    });




});