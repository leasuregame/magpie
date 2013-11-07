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
    _id: 0,                 // 账号序号
    _createTime: 0,         // 创建时间
    _account: "",           // 账号
    _password: "",          // 密码
    _area: 1,               // 区
    _name: "",              // 名字
    _loginCount: 0,         // 总登录次数
    _lastLoginArea: 0,      // 最后登录的区
    _lastLoginTime: 0,      // 最后登录时间
    _lastLoginDevice: "",   // 最后登录设备

    init: function () {
        cc.log("User init");

        this._load();

        return true;
    },

    update: function (data) {
        cc.log("User update");

        if (!data) return;

        this.set("id", data.id);
        this.set("createTime", data.createTime);
        this.set("account", data.account);
        this.set("name", data.name);
        this.set("loginCount", data.loginCount);
        this.set("lastLoginArea", data.lastLoginArea);
        this.set("lastLoginTime", data.lastLoginTime);
        this.set("lastLoginDevice", data.lastLoginDevice);
    },

    _load: function () {
        cc.log("User _load");

        this._account = sys.localStorage.getItem("account") || "junyu";
        this._password = sys.localStorage.getItem("password") || "1";
        this._area = parseInt(sys.localStorage.getItem("area")) || 1;
    },

    _save: function () {
        cc.log("User _save");

        sys.localStorage.setItem("account", this._account);
        sys.localStorage.setItem("password", this._password);
        sys.localStorage.setItem("area", this._area);
    },

    login: function (cb) {
        cc.log("User login");

        cc.log(this._account);
        cc.log(this._password);
        cc.log(this._area);

        this._save();

        var that = this;
        lz.server.request("connector.userHandler.login", {
            account: this._account,
            password: this._password,
            areaId: 1
        }, function (data) {
            cc.log(data);

            var msg = data.msg;

            if (data.code == 200) {
                cc.log("login success");

                that.update(msg.user);

                gameData.gameInit();
                gameData.player.init(msg.player);

                cb(true);
            } else {
                cc.log("login fail");

                cb(false);

                TipLayer.tip(data.msg);
            }
        });
    },

    register: function (cb) {
        cc.log("User register");

        var that = this;
        lz.server.request("connector.userHandler.register", {
            account: this._account,
            password: this._password,
            name: this._name
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("register success");


                cb("success");
            } else {
                cc.log("register fail");

                cb("fail");
            }
        });
    },

    loginOut: function (cb) {
        cc.log("User loginOut");

    },

    reLogin: function (cb) {
        cc.log("User reLogin")
    },

    changePassword: function (cb) {
        cc.log("User changePassword");
    }
});


User.create = function () {
    var ret = new User();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};