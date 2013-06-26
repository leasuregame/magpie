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


(function () {
    var User = function (param) {
        this.id = param.id;
        this.createTime = param.createTime;
        this.account = param.account;
        this.password = param.password;
        this.name = param.name;
        this.loginCount = param.loginCount;
        this.lastLoginTime = param.lastLoginTime;
        this.lastLoginDevice = param.lastLoginDevice;
    }

    module.exports = User;

}).call(this);