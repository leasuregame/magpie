/**
 * Created by lcc3536 on 13-12-30.
 */


/*
 * user
 * */


var User = Entity.extend({
    _id: 0,                 // 帐号序号
    _createTime: 0,         // 创建时间
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

        this._area = parseInt(sys.localStorage.getItem("area")) || 0;
    },

    _save: function () {
        cc.log("User _save");

        sys.localStorage.setItem("area", this._area);
    },

    login: function (cb) {
        cc.log("User login");

        cc.log(this._area);

        this._save();

        var that = this;

        var fn = function () {
            if (typeof(UpdateLayer) != 'undefined') {
                var updateLayer = UpdateLayer.create();
                updateLayer.retain();
                var version = updateLayer.getVersion();
            }

            cc.log("=================================================");
            cc.log(version);
            cc.log("=================================================");

            lz.server.connectGameServer(function () {
                lz.server.request("connector.userHandler.loginTB", {
                    nickName: tbAdapter.TBNickName(),
                    userId: tbAdapter.TBUserID(),
                    sessionId: tbAdapter.TBSessionID(),
                    areaId: that._area,
                    version: version || "1.2.0"
                }, function (data) {
                    cc.log(data);

                    var msg = data.msg;

                    if (data.code == 200) {
                        cc.log("login success");

                        that.update(msg.user);

                        var player = msg.player;

                        if (player) {
                            gameData.gameStart(player);
                            cb();
                        } else {
                            cb(1);
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

                        tbAdapter.TBLogout(0);

                        cb();

                        TipLayer.tip(data.msg);
                    }
                });
            });
        };

        if (!tbAdapter.TBIsLogined()) {
            // 登录成功回调
            tbAdapter.loginResultHandler = function (isSuccess) {
                cc.log("tbAdapter loginResultHandler: " + isSuccess);

                tbAdapter.loginResultHandler = function () {
                };

                fn();
            };

            if (tbAdapter.TBLogin(0) != TB_PLATFORM_NO_ERROR) {
                cb(0);
            }
        } else {
            fn();
        }
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

                gameData.gameStart(msg.player);

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