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


var utility = require('../../common/utility');
var Entity = require('./entity');
var _ = require("underscore");

/*
 * User 与 user 表对应的数据类，提供简单的操作
 * @param {object} param 数据库 user 表中的一行记录
 * */
var User = (function (_super) {
    utility.extends(User, _super);

    function User(param) {
        User.__super__.constructor.apply(this, arguments);
    }

    User.FIELDS = [
        'id', 
        'createTime',
        'account',
        'password',
        'name',
        'loginCount',
        'lastLoginTime',
        'lastLoginDevict',
        'lastLoginArea',
        'roles'
    ];
    User.DEFAULT_VALUES = {
        name: '', 
        loginCount: 0,
        lastLoginTime: Date.now(),
        lastLoginDevice: '',
        lastLoginArea: -1,
        roles: []
    };

    User.prototype.upLastLoginTime = function () {
        this.set("lastLoginTime", Date.now());
    };

    User.prototype.updateLoginTime = function(){
        

    };

    User.prototype.toJson = function() {
        return {
            id: this.id,
            createTime: this.createTime,
            account: this.account,
            name: this.name,
            loginCount: this.loginCount,
            lastLoginTime: this.lastLoginTime,
            lastLoginDevice: this.lastLoginDevice,
            lastLoginArea: this.lastLoginArea,
            roles: this.roles
        };
    };

    return User;
})(Entity);

module.exports = User;