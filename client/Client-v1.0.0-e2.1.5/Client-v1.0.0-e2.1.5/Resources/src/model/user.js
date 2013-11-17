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


var MAX_LAST_NAME_COUNT = 250;
var MAX_FIRST_NAME_COUNT = 2568;
var MAX_ILLEGAL_STR_COUNT = 778;

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

        this._account = sys.localStorage.getItem("account") || "chenchen";
        this._password = sys.localStorage.getItem("password") || "1";
        this._area = parseInt(sys.localStorage.getItem("area")) || 0;
    },

    _save: function () {
        cc.log("User _save");

        sys.localStorage.setItem("account", this._account);
        sys.localStorage.setItem("password", this._password);
        sys.localStorage.setItem("area", this._area);
    },

    getRandomFirstName: function () {
        cc.log("User getRandomFirstName");

        return (outputTables.first_name.rows[lz.randomInt(1, MAX_FIRST_NAME_COUNT)].first_name);
    },

    getRandomLastName: function () {
        cc.log("User getRandomLastName");

        return (outputTables.last_name.rows[lz.randomInt(1, MAX_LAST_NAME_COUNT)].last_name);
    },

    getRandomName: function () {
        cc.log("User getRandomName");

        return (this.getRandomLastName() + this.getRandomFirstName());
    },

    eligibleName: function (name) {
        cc.log("User eligibleName");

        var illegalStr = outputTables.illegal_str.rows;

        for (var i = 1; i < MAX_ILLEGAL_STR_COUNT; ++i) {
            if (name.indexOf(illegalStr[i].illegal_str) != -1) {
                cc.log(illegalStr[i].illegal_str);

                return false;
            }
        }

        return true;
    },

    canLogin: function () {
        cc.log("User canLogin");

        if (!this._area) {
            TipLayer.tip("请先选择所要登录的区服");
            return false;
        }

        if (!this._account) {
            TipLayer.tip("请输入账号");
            return false;
        }

        if (!this._password) {
            TipLayer.tip("请输入密码");
            return false;
        }

        return true;
    },

    login: function (cb) {
        cc.log("User login");

        cc.log(this._account);
        cc.log(this._password);
        cc.log(this._area);

        this._save();

        var that = this;
        lz.server.connectGameServer(function () {
            lz.server.request("connector.userHandler.login", {
                account: that._account,
                password: that._password,
                areaId: that._area
            }, function (data) {
                cc.log(data);

                var msg = data.msg;

                if (data.code == 200) {
                    cc.log("login success");

                    that.update(msg.user);

                    var player = msg.player;

                    if (player) {
                        gameData.gameInit();
                        gameData.player.init(msg.player);

                        cb(1);
                    } else {
                        cb(2);
                    }
                } else {
                    cc.log("login fail");

                    cb(0);

                    TipLayer.tip(data.msg);
                }
            });
        });
    },

    register: function (cb, account, password) {
        cc.log("User register");

        var that = this;
        lz.server.connectGameServer(function () {
            lz.server.request("connector.userHandler.register", {
                account: account,
                password: password
            }, function (data) {
                cc.log(data);

                if (data.code == 200) {
                    cc.log("register success");

                    that._account = account;
                    that._password = password;

                    that._save();

                    cb();
                } else {
                    cc.log("register fail");

                    TipLayer.tip(data.msg);
                }
            });
        });
    },

    createPlayer: function (cb, name) {
        cc.log("User createPlayer");

        var that = this;
        lz.server.request("connector.playerHandler.createPlayer", {
            name: name
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("createPlayer success");

                var msg = data.msg;

                gameData.gameInit();
                gameData.player.init(msg.player);

                cb();
            } else {
                cc.log("createPlayer fail");

                TipLayer.tip(data.msg);
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