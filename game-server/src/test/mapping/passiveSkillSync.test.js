/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-1
 * Time: 下午7:31
 * To change this template use File | Settings | File Templates.
 */


/*
 * passive skill sync test
 * */


require('./setup');
app = require("pomelo").app;
var should = require("should");
var passiveSkillSync = require('../../app/dao/mysql/mapping/passiveSkillSync');

describe("Passive Skill Sync Data Access Object", function () {
    var data = {
        id: 234590,
        cardId: 1,
        tableId: 1,
        value: 5
    };

    describe("#updatePassiveSkillById", function () {
        describe("when passive skill exist", function () {
            before(function (done) {
                app.get("dbClient")["delete"]("delete from passiveSkill", [], function () {
                    app.get("dbClient")["insert"]("insert into passiveSkill (id, createTime, cardId, tableId, value) value (?, ?, ?, ?, ?);",
                        [
                            data.id,
                            Date.now(),
                            data.cardId,
                            data.tableId,
                            data.value
                        ],
                        function (err, res) {
                            return done();
                        });
                });
            });

            after(function (done) {
                app.get("dbClient")["delete"]("delete from passiveSkill", [], function () {
                    done();
                });
            });

            it("should can be update passive skill by id", function (done) {
                passiveSkillSync.updatePassiveSkillById(data.id, {
                    tableId: 20
                }, function (err, res) {
                    should.strictEqual(err, null);
                    res.should.be.true;
                    done();
                })
            });
        });

        describe("when passive skill no exist", function () {
            it("should can no update passive skill by id", function (done) {
                passiveSkillSync.updatePassiveSkillById(data.id, {
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