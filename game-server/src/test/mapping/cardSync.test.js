/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-1
 * Time: 下午6:33
 * To change this template use File | Settings | File Templates.
 */


/*
 * card sync test
 * */


require('./setup');
app = require("pomelo").app;
var should = require("should");
var cardSync = require('../../app/dao/mysql/mapping/cardSync');

describe("Card Sync Data Access Object", function () {
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

    describe("#updateCardById", function () {
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

            it("should can be update card by id", function (done) {
                cardSync.updateCardById(data.id, {
                    tableId: 20
                }, function (err, res) {
                    should.strictEqual(err, null);
                    res.should.be.true;
                    done();
                })
            });
        });

        describe("when card no exist", function () {
            it("should can no update card by id", function (done) {
                cardSync.updateCardById(data.id, {
                    tableId: 20
                }, function (err, res) {
                    should.strictEqual(err, null);
                    res.should.be.false;
                    done();
                })
            });
        });
    });
});