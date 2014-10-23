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
                var yyUser = {
                    sid: yy.YYClient.getSid(),
                    account: yy.YYClient.getAccount(),
                    time: yy.YYClient.getTime(),
                    userName: yy.YYClient.getUserName()
                }

                // -1 表示没有设置
                var hasLoadFiles = false;
                // cc.UserDefault.getInstance().getBoolForKey(
                //     lz.platformConfig.KEY_OF_HAS_LAOD_APP_FILES,
                //     false);
                cc.log("====== has load files flag =======", hasLoadFiles);

                lz.server.request("connector.userHandler.loginYY", {
                    signid: yyUser.sid,
                    account: yyUser.account,
                    userName: yyUser.userName,
                    time: yyUser.time,
                    appid: lz.platformConfig.APP_ID,
                    areaId: that._area,
                    version: version,
                    appVersion: appVersion,
                    os: 'android',
                    hasLoadFiles: hasLoadFiles
                }, function (data) {
                    cc.log(JSON.stringify(data));

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

                        cc.log("enterGameServer: "+that._area+", "+player.id+", "+player.name);

                        yy.YYClient.enterGameServer(
                            that._area,
                            player.id,
                            player.name);

                        lz.um.event("event_login", that._area);
                    } else if (data.code == 600) {
                        cc.log("login fail go to updateLayer");

                        cb(3);

                        Dialog.pop(data.msg, function () {
                            if (typeof(UpdateLayer) != "undefined") {
                                cc.Director.getInstance()
                                .replaceScene(
                                    LoginScene.create(
                                        UpdateLayer, 
                                        lz.updateConfig.UPDATE_TYPE.UPDATE_VERSION
                                    )
                                );
                            } else {
                                TipLayer.tip("找不到更新模块，请重新下载游戏");
                            }
                        });
                    } else if (data.code == 700) {
                        cc.log("login fail go to updateLayer to download app files for the first time");

                        cb(4);

                        Dialog.pop(data.msg, function () {
                            if (typeof(UpdateLayer) != "undefined") {
                                cc.Director.getInstance()
                                .replaceScene(
                                    LoginScene.create(
                                        UpdateLayer, 
                                        lz.updateConfig.UPDATE_TYPE.LOAD_RESOURCES
                                    )
                                );
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
            yy.YYClient.login();
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

                // YY数据收集
                //yyAdapter.YYCreateUserRole(msg.player.name, msg.player.lv);
    
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