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
                        dao.player.getPlayerById(data.id, function (err, res) {
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
});