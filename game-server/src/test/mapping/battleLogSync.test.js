/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-1
 * Time: 下午4:14
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle log sync test
 * */


require('./setup');
app = require("pomelo").app;
var should = require("should");
var battleLogSync = require('../../app/dao/mysql/mapping/battleLogSync');

describe("Battle Log Sync Data Access Object", function () {
    var data = {
        id: 234590,
        own: 1,
        enemy: 0,
        battleLog: {}
    };

    describe("#updataBattleLogBy...", function () {
        describe("when battle log exist", function () {
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
                            return done();
                        });
                });
            });

            after(function (done) {
                app.get("dbClient")["delete"]("delete from battleLog", [], function () {
                    done();
                });
            });

            it("should can be updata battle log by id", function (done) {
                battleLogSync.updateBattleLogById(data.id, {
                    own: 50
                }, function (err, res) {
                    should.strictEqual(err, null);
                    res.should.be.true;
                    done();
                })
            });
        });
        describe("when battle log no exist", function () {
            it("should can no updata battle log by id", function (done) {
                battleLogSync.updateBattleLogById(data.id, {
                    own: 50
                }, function (err, res) {
                    should.strictEqual(err, null);
                    res.should.be.false;
                    done();
                })
            });
        });
    });
});