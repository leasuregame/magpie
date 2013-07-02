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
var should = require("should");

describe("Card Object", function () {
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

    describe("#save", function () {
        var card = null;

        before(function (done) {
            app.get("dbClient")["delete"]("delete from card", [], function () {
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
                        dao.card.getCardById(data.id, function (err, res) {
                            card = res;
                            return done();
                        });
                    });
            });
        });

        after(function (done) {
            app.get("dbClient")["delete"]("delete from card", [], function () {
                done();
            });
        });

        it("should can be update card when card is no null", function (done) {
            card.should.be.a("object");
            card.increase("lv");
            card.save(function (err, res) {
                should.strictEqual(err, null);
                res.should.be.true;
                return done();
            });
        });
    });
});