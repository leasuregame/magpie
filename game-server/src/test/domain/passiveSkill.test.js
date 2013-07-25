/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-2
 * Time: 下午12:01
 * To change this template use File | Settings | File Templates.
 */


/*
 * passiveSkill test
 * insert -> dao -> get -> domain -> update -> save -> cb -> judge
 * */


require('./setup');
app = require("pomelo").app;
var dao = app.get('dao');
var should = require("should");

describe("PassiveSkill Object", function () {
    var data = {
        id: 234590,
        cardId: 1,
        tableId: 1,
        value: 5
    };

    describe("#save", function () {
        var passiveSkill = null;

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
                        dao.passiveSkill.fetchOne({where: {id:data.id}}, function (err, res) {
                            passiveSkill = res;
                            return done();
                        });
                    });
            });
        });
        after(function (done) {

            app.get("dbClient")["delete"]("delete from passiveSkill", [], function () {
                done();
            });
        });

        it("should can be update passive skill by id", function (done) {
            passiveSkill.should.be.a("object");
            passiveSkill.increase("tableId");
            passiveSkill.save(function (err, res) {
                should.strictEqual(err, null);
                res.should.be.true;
                return done();
            });
        });
    });
});