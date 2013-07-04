/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-2
 * Time: 下午7:18
 * To change this template use File | Settings | File Templates.
 */


/*
 * battleLog test
 *
 * insert -> dao -> get -> domain -> update -> save -> cb -> judge
 * */


require('./setup');
app = require("pomelo").app;
var dao = app.get('dao');
var should = require("should");

describe("BattleLog Object", function () {
    var data = {
        id: 234590,
        own: 1,
        enemy: 0,
        battleLog: {}
    };

    describe("#save", function () {
        var battleLog = null;

        before(function (done) {
            app.get("dbClient")["delete"]("delete from battleLog", [], function () {
                app.get("dbClient")["insert"]("insert into battleLog (id, createTime, own, enemy, battleLog) value (?, ?, ?, ?, ?);",
                    [
                        data.id,
                        Date.now(),
                        data.own,
                        data.enemy,
                        JSON.stringify(data.battleLog)
                    ],
                    function (err, res) {
                        dao.battleLog.getBattleLogById(data.id, function (err, res) {
                            battleLog = res;
                            return done();
                        });
                    });
            });
        });

        after(function (done) {
            app.get("dbClient")["delete"]("delete from battleLog", [], function () {
                done();
            });
        });

        it("should can be updata battle log by id", function (done) {
            battleLog.should.be.a("object");
            battleLog.increase("enemy");
            battleLog.save(function (err, res) {
                should.strictEqual(err, null);
                res.should.be.true;
                return done();
            });
        });
    });
});