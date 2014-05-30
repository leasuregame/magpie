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

        this._area = lz.load("area") || 0;
    },

    _save: function () {
        cc.log("User _save");

        lz.save("area", this._area);
    },

    login: function (cb) {
        cc.log("User login");

        cc.log(this._area);

        this._save();

        var that = this;

        var fn = function () {
            var version = lz.platformConfig.VERSION;

            if (typeof(cc.AssetsManager) != "undefined") {
                version = cc.AssetsManager.getInstance().getVersion();
            }

            var appVersion = lz.platformConfig.VERSION;
            if (typeof(cc.Application.getInstance().getAppVersion) != "undefined") {
                appVersion = cc.Application.getInstance().getAppVersion();
            }


            cc.log("=================================================");
            cc.log(version);
            cc.log(appVersion);
            cc.log("=================================================");

            lz.server.connectGameServer(function () {
                lz.server.request("connector.userHandler.login91", {
                    sessionid: ndAdapter.NDSessionId(),
                    uin: ndAdapter.NDLoginUin(),
                    appid: lz.platformConfig.APP_ID,
                    areaId: that._area,
                    version: version,
                    appVersion: appVersion
                }, function (data) {
                    cc.log(data);

                    var msg = data.msg;

                    if (data.code == 200) {
                        cc.log("login success");

                        that.update(msg.user);

                        var player = msg.player;

                        if (player) {
                            cb(1);
                            gameData.gameStart(player);
                        } else {
                            cb(2);
                        }

                        lz.um.event("event_login", that._area);
                    } else if (data.code == 600) {
                        cc.log("login fail go to updateLayer");

                        cb(3);

                        Dialog.pop(data.msg, function () {
                            if (typeof(UpdateLayer) != "undefined") {
                                cc.Director.getInstance().replaceScene(LoginScene.create(UpdateLayer));
                            } else {
                                TipLayer.tip("找不到更新模块，请重新下载游戏");
                            }
                        });
                    } else {
                        cc.log("login fail");

                        if (lz.platformLogout) {
                            lz.platformLogout();
                        }

                        cb(0);

                        TipLayer.tip(data.msg);
                    }
                });
            });
        };

        if (lz.platformIsLogin && !lz.platformIsLogin()) {
            // 登录成功回调
            ndAdapter.NDLoginCallBack = function() {
                cc.log("ndAdapter NDLoginCallBack");

                ndAdapter.NDLoginCallBack = function() {

                };

                fn();
            };

            ndAdapter.NDLogin(0);
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

                lz.um.event("event_create_player", that._area);
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