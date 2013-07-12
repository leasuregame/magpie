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
        cc.log("User init");

        this._id = data.id;

        return true;
    },

    signIn: function (cb) {
        cc.log("User signIn");

        var that = this;

        lzWindow.pomelo.request("connector.userHandler.login", {
            account: this._account,
            password: this._password
        }, function (data) {
            cc.log(data);

            var msg = data.msg;

            if (data.code == 200) {
                cc.log("sign in success");

                that.init(msg.user);
                gameData.player.init(msg.player);

                cb("success");
            } else {
                cc.log("sign in fail");

                cb("fail");
            }
        });
    },

    signUp: function (cb) {
        cc.log("User signUp");

        var that = this;

        lzWindow.pomelo.request('connector.userHandler.register', {
            account: this._account,
            password: this._password,
            name: this._name
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("sign up success");



                cb("success");
            } else {
                cc.log("sign up fail");

                cb("fail");
            }
        });
    },

    signOut: function () {
        cc.log("User signOut");

    },

    reSignIn: function () {
        cc.log("User reSignIn")
    }
})


User.create = function (data) {
    var user = new User();

    if (user) {
        return user;
    }

    return null;
}