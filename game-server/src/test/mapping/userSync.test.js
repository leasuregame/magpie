/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-1
 * Time: 下午6:59
 * To change this template use File | Settings | File Templates.
 */


/*
* user sync test
* */


require('./setup');
app = require("pomelo").app;
var should = require("should");
var userSync = require('../../app/dao/mysql/mapping/userSync');

describe("User Sync Data Access Object", function () {
    var data = {
        id: 234590,
        account: "lcc3536",
        password: "xxxxx",
        name: "lcc",
        loginCount: "100",
        lastLoginTime: "34346456",
        lastLoginDevice: "ipad"
    };

    describe("#updateUserById", function () {
        describe("when user exist", function () {
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

            it("should can be update user by id", function (done) {
                userSync.updateUserById(data.id, {
                    name: "ccccc"
                }, function (err, res) {
                    should.strictEqual(err, null);
                    res.should.be.true;
                    done();
                })
            });
        });

        describe("when user no exist", function () {
            it("should can no update user by id", function (done) {
                userSync.updateUserById(data.id, {
                    name: "ccccc"
                }, function (err, res) {
                    should.strictEqual(err, null);
                    res.should.be.false;
                    done();
                })
            });
        });
    });
});