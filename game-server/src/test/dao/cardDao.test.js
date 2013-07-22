/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-28
 * Time: 下午4:05
 * To change this template use File | Settings | File Templates.
 */


/*
 * card dao test
 * */


require('./setup');
app = require("pomelo").app;
var dao = app.get('dao');
var should = require("should");
var Card = require("../../app/domain/card");

describe("Card Data Access Object", function () {
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

    describe("#createCard", function () {
        before(function (done) {
            console.log("delete data card");
            app.get("dbClient")["delete"]("delete from card", [], function () {
                return done();
            });
        });

        after(function (done) {
            console.log("delete data card");
            app.get("dbClient")["delete"]("delete from card", [], function () {
                return done();
            });
        });

        it("should can be create card", function (done) {
            dao.card.createCard({data: data}, function (err, res) {
                should.strictEqual(err, null);
                res.id.should.equal(data.id);
                return done();
            });
        });
    });

    describe("#getcardBy...", function () {
        describe("when card exist", function () {
            before(function (done) {
                console.log("delete data card");
                app.get("dbClient")["delete"]("delete from card", [], function () {
                    console.log("insert data card");
                    app.get("dbClient")["insert"]("insert into card (id, createTime, playerId, tableId, lv, exp, skillLv, hpAddition, atkAddition) value (?, ?, ?, ?, ?, ?, ?, ?, ?);",
                        [
                            data.id,
                            Date.now(),
                            data.playerId,
                            data.tableId,
                            data.lv,
                            data.exp,
                            data.skillLv,
                            data.hpAddition,
                            data.atkAddition
                        ],
                        function (err, res) {
                            return done();
                        });
                });
            });

            after(function (done) {
                app.get("dbClient")["delete"]("delete from card", [], function () {
                    done();
                });
            });

            it("should can be get card by id", function (done) {
                dao.card.getCardById({where: {id: data.id}}, function (err, res) {
                    should.strictEqual(err, null);
                    res.id.should.equal(data.id);
                    res.playerId.should.equal(data.playerId);
                    res.tableId.should.equal(data.tableId);
                    res.lv.should.equal(data.lv);
                    res.exp.should.equal(data.exp);
                    res.skillLv.should.equal(data.skillLv);
                    res.hpAddition.should.equal(data.hpAddition);
                    res.atkAddition.should.equal(data.atkAddition);
                    return done();
                })
            });

            it("should can be get card by player id", function (done) {
                dao.card.getCardByPlayerId({where: {playerId: data.playerId}}, function (err, res) {
                    should.strictEqual(err, null);
                    res[0].id.should.equal(data.id);
                    res[0].playerId.should.equal(data.playerId);
                    res[0].tableId.should.equal(data.tableId);
                    res[0].lv.should.equal(data.lv);
                    res[0].exp.should.equal(data.exp);
                    res[0].skillLv.should.equal(data.skillLv);
                    res[0].hpAddition.should.equal(data.hpAddition);
                    res[0].atkAddition.should.equal(data.atkAddition);
                    return done();
                })
            });
        });

        describe("when card no exist", function () {
            it("should can no get card by id", function (done) {
                dao.card.getCardById({where: {id: data.id}}, function (err, res) {
                    should.strictEqual(res, null);
                    err.msg.should.be.equal("卡牌不存在");
                    return done();
                })
            });

            it("should can no get card by player id", function (done) {
                dao.card.getCardByPlayerId({where: {playerId: data.playerId}}, function (err, res) {
                    should.strictEqual(err, null);
                    res.should.eql([]);
                    return done();
                })
            });
        });
    });

    describe("#deletecardBy...", function () {
        describe("when card exist", function () {
            beforeEach(function (done) {
                console.log("delete data card");
                app.get("dbClient")["delete"]("delete from card", [], function () {
                    console.log("insert data card");
                    app.get("dbClient")["insert"]("insert into card (id, createTime, playerId, tableId, lv, exp, skillLv, hpAddition, atkAddition) value (?, ?, ?, ?, ?, ?, ?, ?, ?);",
                        [
                            data.id,
                            Date.now(),
                            data.playerId,
                            data.tableId,
                            data.lv,
                            data.exp,
                            data.skillLv,
                            data.hpAddition,
                            data.atkAddition
                        ],
                        function (err, res) {
                            return done();
                        });
                });
            });

            afterEach(function (done) {
                app.get("dbClient")["delete"]("delete from card", [], function () {
                    done();
                });
            });

            it("should can be delete by id", function (done) {
                dao.card.deleteCardById({where: {id: data.id}}, function (err, res) {
                    should.strictEqual(err, null);
                    res.should.be.true;
                    return done();
                });
            });
        });

        describe("when card no exist", function () {
            it("should can no delete by id", function (done) {
                dao.card.deleteCardById({where: {id: data.id}}, function (err, res) {
                    should.strictEqual(err, null);
                    res.should.be.false;
                    return done();
                });
            });
        });
    });
});