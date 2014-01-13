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
    _id: 0,                 // 帐号序号
    _createTime: 0,         // 创建时间
    _account: "",           // 帐号
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

        this._account = sys.localStorage.getItem("account") || "";
        this._password = sys.localStorage.getItem("password") || "";
        this._area = parseInt(sys.localStorage.getItem("area")) || 0;
    },

    _save: function () {
        cc.log("User _save");

        sys.localStorage.setItem("account", this._account);
        sys.localStorage.setItem("password", this._password);
        sys.localStorage.setItem("area", this._area);
    },

    canLogin: function () {
        cc.log("User canLogin");

        if (!this._area) {
            TipLayer.tip("请先选择所要登录的区服");
            return false;
        }

        if (!this._account) {
            TipLayer.tip("请输入帐号");
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

        if (typeof(UpdateLayer) != "undefined") {
            var updateLayer = UpdateLayer.create();
            updateLayer.retain();
            var version = updateLayer.getVersion();
        }

        cc.log("=================================================");
        cc.log(version);
        cc.log("=================================================");

        var that = this;
        lz.server.connectGameServer(function () {
            lz.server.request("connector.userHandler.login", {
                account: that._account,
                password: that._password,
                areaId: that._area,
                version: version || "1.1.0"
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

                    lz.dc.event("event_login", that._area);
                } else if (data.code == 600) {
                    cc.log("login fail go to updateLayer");

                    Dialog.pop("您的版本需要更新", function () {
                        cc.Director.getInstance().replaceScene(LoginScene.create(updateLayer));
                        updateLayer.update();
                    });
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

                    lz.dc.event("event_register");
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

                lz.dc.event("event_create_player", that._area);
            } else {
                cc.log("createPlayer fail");

                TipLayer.tip(data.msg);
            }
        });
    }
});


User.create = function () {
    var ret = new User();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};