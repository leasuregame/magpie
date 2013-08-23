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
                card.ability().should.equal(4197);

                card = new Card({
                    id: 1,
                    tableId: 3,
                    star: 3,
                    lv: 10
                });
                card.ability().should.equal(4540);

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
                card.ability().should.equal(5540);
            });

        });
    });

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
                    name: 'hp_improve',
                    value: 5.3
                }));

                card.addPassiveSkill(new PassiveSkill({
                    id: 2,
                    name: 'atk_improve',
                    value: 10
                }));

                card.toJson().should.eql({
                    id: 1,
                    createTime: undefined,
                    playerId: undefined,
                    tableId: 3,
                    init_hp: 355,
                    init_atk: 149,
                    hp: 391,
                    atk: 163,
                    incs: {
                        group_hp: 0,
                        group_atk: 0,
                        spirit_hp: 0,
                        spirit_atk: 0,
                        ps_hp: 36,
                        ps_atk: 14,
                        elixir_hp: 0,
                        elixir_atk: 0
                    },
                    star: 3,
                    lv: 1,
                    exp: 0,
                    skillLv: 1,
                    skillPoint: 0,
                    elixir: 0,
                    hpAddition: 0,
                    atkAddition: 0,
                    passiveSkills: [{
                        id: 1,
                        cardId: undefined,
                        createTime: undefined,
                        name: 'hp_improve',
                        value: 5.3
                    }, {
                        id: 2,
                        cardId: undefined,
                        createTime: undefined,
                        name: 'atk_improve',
                        value: 10
                    }]
                });
            });
        });
    });
});