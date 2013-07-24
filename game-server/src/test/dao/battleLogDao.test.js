/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-28
 * Time: 下午4:05
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle log dao test
 * */


require('./setup');
app = require("pomelo").app;
var dao = app.get('dao');
var should = require("should");
var BattleLog = require("../../app/domain/battleLog");

describe("Battle Log Data Access Object", function () {

    var data = {
        id: 234590,
        own: 1,
        enemy: 0,
        battleLog: {}
    };

    describe("#createBattleLog", function () {
        before(function (done) {
            app.get("dbClient")["delete"]("delete from battleLog", [], function () {
                return done();
            });
        });

        after(function (done) {
            app.get("dbClient")["delete"]("delete from battleLog", [], function () {
                return done();
            });
        });

        it("should can be create battle log", function (done) {
            dao.battleLog.create({
                data: {
                    id: data.id,
                    own: data.own,
                    enemy: data.enemy,
                    battleLog: JSON.stringify(data.battleLog)
                }
            }, function (err, res) {
                should.strictEqual(err, null);
                res.id.should.equal(data.id);
                return done();
            });
        });
    });

    describe("#getBattleLogBy...", function () {
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

            it("should can be get battle log by id", function (done) {
                dao.battleLog.fetchOne({where: {id: data.id}}, function (err, res) {
                    should.strictEqual(err, null);
                    res.id.should.equal(data.id);
                    res.own.should.equal(data.own);
                    res.enemy.should.equal(data.enemy);
                    res.battleLog.should.eql(data.battleLog);
                    return done();
                })
            });

            it("should can be get battle log by own player id", function (done) {
                dao.battleLog.fetchMany({where: {own: data.own}}, function (err, res) {
                    should.strictEqual(err, null);
                    res.length.should.equal(1);
                    res[0].id.should.equal(data.id);
                    res[0].own.should.equal(data.own);
                    res[0].enemy.should.equal(data.enemy);
                    res[0].battleLog.should.eql(data.battleLog);
                    return done();
                })
            });

            it("should can be get battle log by enemy player id", function (done) {
                dao.battleLog.fetchMany({where: {enemy: data.enemy}}, function (err, res) {
                    should.strictEqual(err, null);
                    res.length.should.equal(1);
                    res[0].id.should.equal(data.id);
                    res[0].own.should.equal(data.own);
                    res[0].enemy.should.equal(data.enemy);
                    res[0].battleLog.should.eql(data.battleLog);
                    return done();
                })
            });
        });

        describe("when battle log no exist", function () {
            it("should can no get battle log by id", function (done) {
                dao.battleLog.fetchOne({where: {own: data.own}}, function (err, res) {
                    should.strictEqual(res, null);
                    err.msg.should.be.equal("can not find battleLog");
                    return done();
                })
            });

            it("should can no get battle log by own id", function (done) {
                dao.battleLog.fetchMany({where: {own: data.own}}, function (err, res) {
                    should.strictEqual(err, null);
                    res.should.eql([]);
                    return done();
                })
            });

            it("should can no get battle log by enemy id", function (done) {
                dao.battleLog.fetchMany({where: {enemy: data.enemy}}, function (err, res) {
                    should.strictEqual(err, null);
                    res.should.eql([]);
                    return done();
                })
            })
        });
    });

    describe("#deleteBattleLogBy...", function () {
        describe("when battle log exist", function () {
            beforeEach(function (done) {
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

            afterEach(function (done) {
                app.get("dbClient")["delete"]("delete from battleLog", [], function () {
                    done();
                });
            });

            it("should can be delete by id", function (done) {
                dao.battleLog.delete({where: {id: data.id}}, function (err, res) {
                    should.strictEqual(err, null);
                    res.should.be.true;
                    return done();
                });
            });
        });

        describe("when battle log no exist", function () {
            it("should can no delete by id", function (done) {
                dao.battleLog.delete({where: {id: data.id}}, function (err, res) {
                    should.strictEqual(err, null);
                    res.should.be.false;
                    return done();
                });
            });
        });
    });
});