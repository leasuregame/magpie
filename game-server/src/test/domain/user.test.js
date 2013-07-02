/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-2
 * Time: 下午12:01
 * To change this template use File | Settings | File Templates.
 */


/*
 * user test
 * insert -> dao -> get -> domain -> update -> save -> select -> judge
 * */


require('./setup');
app = require("pomelo").app;
var dao = app.get('dao');
var should = require("should");
var BattleLog = require("../../app/domain/battleLog");

describe("User Object", function () {
    var data = {
        id: 234590,
        account: "lcc3536",
        password: "xxxxx",
        name: "lcc",
        loginCount: "100",
        lastLoginTime: "34346456",
        lastLoginDevice: "ipad"
    };

    describe("#save", function () {
        var user = null;

        before(function (done) {
            app.get("dbClient")["delete"]("delete from user", [], function () {
                app.get("dbClient")["insert"]("insert into user (id, createTime, account, password, name, loginCount, lastLoginTime, lastLoginDevice) value (?, ?, ?, ?, ?, ?, ?, ?);",
                    [
                        data.id,
                        Date.now(),
                        data.account,
                        data.password,
                        data.name,
                        data.loginCount,
                        data.lastLoginTime,
                        data.lastLoginDevict
                    ],
                    function (err, res) {

                        return done();
                    });
            });
        });

        after(function (done) {
            app.get("dbClient")["delete"]("delete from user", [], function () {
                done();
            });
        });

        it("", function (done) {

        });
    });
});