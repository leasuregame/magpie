/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-2
 * Time: 下午12:01
 * To change this template use File | Settings | File Templates.
 */


/*
 * user test
 * insert -> dao -> get -> domain -> update -> save -> cb -> judge
 * */


require('./setup');
app = require("pomelo").app;
var dao = app.get('dao');
var should = require("should");

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
                        data.lastLoginDevice
                    ],
                    function (err, res) {
                        dao.user.fetchOne({where: {id:data.id}}, function (err, res) {
                            user = res;
                            return done();
                        });
                    });
            });
        });

        after(function (done) {
            app.get("dbClient")["delete"]("delete from user", [], function () {
                done();
            });
        });

        it("should can be save when user is no null", function (done) {
            user.should.be.a("object");
            user.increase("loginCount");
            user.save(function (err, res) {
                should.strictEqual(err, null);
                res.should.be.true;
                return done();
            });
        });
    });
});