/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-1
 * Time: 下午7:15
 * To change this template use File | Settings | File Templates.
 */


/*
 * player sync test
 * */


require('./setup');
app = require("pomelo").app;
var should = require("should");
var playerSync = require('../../app/dao/mysql/mapping/playerSync');

describe("Player Sync Data Access Object", function () {
    var data = {
        id: 234590,
        userId: 1,
        areaId: 1,
        name: "lcc"
    };

    describe("#updataPlayerById", function () {
        describe("when player exist", function () {
            before(function (done) {
                app.get("dbClient")["delete"]("delete from player", [], function () {
                    app.get("dbClient")["insert"]("insert into player (id, createTime, userId, areaId, name) value (?, ?, ?, ?, ?);",
                        [
                            data.id,
                            Date.now(),
                            data.userId,
                            data.areaId,
                            data.name
                        ],
                        function (err, res) {
                            return done();
                        });
                });
            });

            after(function (done) {
                app.get("dbClient")["delete"]("delete from player", [], function () {
                    done();
                });
            });

            it("should can be updata player by id", function (done) {
                playerSync.updatePlayerById(app.get("dbClient"), [data.id, {
                    name: "ccccc"
                }, function (err, res) {
                    should.strictEqual(err, null);
                    res.should.be.true;
                    done();
                }])
            });
        });
        describe("when player no exist", function () {
            it("should can no updata player by id", function (done) {
                playerSync.updatePlayerById(app.get("dbClient"), [data.id, {
                    name: "ccccc"
                }, function (err, res) {
                    should.strictEqual(err, null);
                    res.should.be.false;
                    done();
                }])
            });
        });
    });
});

