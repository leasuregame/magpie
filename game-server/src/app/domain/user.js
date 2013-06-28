/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-25
 * Time: 下午3:51
 * To change this template use File | Settings | File Templates.
 */


/*
 * user
 * */


var __hasProp = {}.hasOwnProperty;
var __extends = function (child, parent) {
    for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
    }
    function ctor() {
        this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
};

var Entity = require('./entity');
var _ = require("underscore");

/*
 * User 与 user 表对应的数据类，提供简单的操作
 * @param {object} param 数据库 user 表中的一行记录
 * */
var User = (function (_super) {
    __extends(User, _super);

    function User(param) {
        User.__super__.constructor.apply(this, arguments);
    }

    User.prototype.upLastLoginTime = function () {
        this.set("lastLoginTime", Date.now());
    }

    /*
     * 判断登录
     * */
    User.prototype.login = function () {
        // 细节未实现

        return true;
    }

    return User;
})(Entity);

module.exports = User;