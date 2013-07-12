/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-9
 * Time: 下午4:54
 * To change this template use File | Settings | File Templates.
 */


/*
 * user
 * */


var User = Entity.extend({
    _id: 0,
    _createTime: 0,
    _account: "",
    _password: "",
    _name: "",
    _loginCount: 0,
    _lastLoginTime: 0,
    _lastLoginDevice: "",

    init: function (data) {
        this._id = data.id;

        return true;
    },

    signIn: function (cb) {
        var that = this;

        lzWindow.pomelo.request("connector.userHandler.login", {
            account: this._account,
            password: this._password
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("sign in success");

                that._id = data.uid;
            } else {
                cc.log("sign in fail");
            }
        });
    },

    signUp: function () {
        var that = this;

        lzWindow.pomelo.request('connector.userHandler.register', {
            account: this._account,
            password: this._password,
            name: this._name
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("sign up success");

                that._id = data.uid;
            } else {
                cc.log("sign up fail");
            }
        });
    },

    signOut: function () {

    },

    reSignIn: function () {

    }
})


User.create = function (data) {
    var user = new User();

    if (user && user.init(data)) {
        return user;
    }

    return null;
}