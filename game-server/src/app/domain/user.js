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
    /*
     * User 与 user 表对应的数据类，提供简单的操作
     * @param {object} row 数据库 user 表中的一行记录
     * */
    var User = function (row) {
        if (typeof (row) == "undefined") {
            throw new Error("User row is undefined");
        }

        var _id = row.id;
        var _createTime = row.createTime;
        var _account = row.account;
        var _password = row.password;
        var _name = row.name;
        var _loginCount = row.loginCount;
        var _lastLoginTime = row.lastLoginTime;
        var _lastLoginDevice = row.lastLoginDevice;

        var _passwordDirty = false;
        var _nameDirty = false;
        var _loginCountDirty = false;
        var _lastLoginTimeDirty = false;
        var _lastLoginDeviceDirty = false;


        this.getId = function () {
            return _id;
        }

        this.getCreateTime = function () {
            return _createTime;
        }

        this.getAccount = function () {
            return _account;
        }

        this.getPassword = function () {
            return _password;
        }

        this.setPassword = function (password) {
            _password = password;
            _passwordDirty = true;
        }

        this.getName = function () {
            return _name;
        }

        this.setName = function (name) {
            _name = name;
            _nameDirty = true;
        }

        this.getLoginCount = function () {
            return _loginCount;
        }

        this.upLoginCount = function () {
            _loginCount += 1;
            _loginCountDirty = true;
        }

        this.getLastLoginTime = function () {
            return _lastLoginTime;
        }

        this.upLastLoginTime = function () {
            _lastLoginTime = Date.now();
            _lastLoginTimeDirty = true;
        }

        this.getLastLoginDevice = function () {
            return _lastLoginDevice;
        }

        this.setLastLoginDevice = function (lastLoginDevice) {
            _lastLoginDevice = lastLoginDevice;
            _lastLoginDeviceDirty = true;
        }

        this.login = function () {

        }


        /*
         * 提交数据到数据库，只对修改标记过的数据进行提交
         * */
        this.submitData = function () {
            if (_passwordDirty || _nameDirty || _loginCountDirty || _lastLoginTimeDirty || _lastLoginDeviceDirty) {
                console.log("数据没有修改，不需要提交");
                return;
            }

            var param = {};

            if (_passwordDirty) {
                param.password = _password;
                _passwordDirty = false;
            }

            if (_nameDirty) {
                param.name = _name;
                _nameDirty = false;
            }

            if (_loginCountDirty) {
                param.loginCount = _loginCount;
                _loginCountDirty = false;
            }

            if (_lastLoginTimeDirty) {
                param.lastLoginTime = _lastLoginTime;
                _lastLoginTimeDirty = false;
            }

            if (_lastLoginDeviceDirty) {
                param.lastLoginDevice = _lastLoginDevice;
                _lastLoginDeviceDirty = false;
            }

            // 弹出提交事件
        }
    }

    module.exports = User;

}).call(this);