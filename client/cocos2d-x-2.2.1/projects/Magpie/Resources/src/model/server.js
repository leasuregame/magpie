/**
 * Created by lcc3536 on 13-11-5.
 */


/*
 * server
 * */


// connect timeout
var CONNECT_TIMEOUT = 5;

// request timeout
var REQUEST_TIMEOUT = 20;

// gate server timeout
var GATE_SERVER_TIMEOUT = 300;

// reconnect time
var RECONNECT_TIME = 3;

// connect status
var CONNECT_FAIL = 0;
var CONNECT_SUCCESS = 1;
var CONNECT_TRYING = 2;

// disconnect status
var DISCONNECT_DEFAULT = 0;
var DISCONNECT_KICK = 1;

// area status
var AREA_STATUS = {
    10: {
        statusName: "新区",
        color: cc.c3b(108, 218, 0),
        url: main_scene_image.icon292,
        canLogin: true
    },

    20: {
        statusName: "正常",
        color: cc.c3b(0, 195, 244),
        url: main_scene_image.icon293,
        canLogin: true
    },

    30: {
        statusName: "爆满",
        color: cc.c3b(226, 0, 0),
        url: main_scene_image.icon294,
        canLogin: true
    },

    40: {
        statusName: "维护",
        color: cc.c3b(120, 120, 120),
        url: main_scene_image.icon295,
        canLogin: false
    }
};

var Server = Entity.extend({
    _host: "",
    _port: "",
    _waitLayer: null,
    _waitTimes: 0,
    _areaList: null,
    _gateServerStatus: CONNECT_FAIL,
    _gameServerStatus: CONNECT_FAIL,
    _disconnectStatus: DISCONNECT_DEFAULT,

    init: function () {
        cc.log("Server init");
    },

    update: function (data) {
        cc.log("Server update");

        this._host = data.host;
        this._port = data.port;
        this._areaList = data.servers;

        var len = this._areaList.length;
        for (var i = 0; i < len; ++i) {
            var status = AREA_STATUS[this._areaList[i].status];

            this._areaList[i].statusName = status.statusName;
            this._areaList[i].color = status.color;
            this._areaList[i].canLogin = status.canLogin;
            this._areaList[i].desc = this._areaList[i].id + "区  " + this._areaList[i].name;
            this._areaList[i].url = status.url;
        }
    },

    connectGateServer: function (cb) {
        cc.log("Server connectGateServer");

        this.unscheduleAllCallbacks();

        this._gateServerStatus = CONNECT_FAIL;
        this._gameServerStatus = CONNECT_FAIL;

        var success = false;

        this._showWaitLayer();

        var that = this;

        this._gateServerStatus = CONNECT_TRYING;

        this.off();

        this.disconnect();

        this.on("close", function (data) {
            cc.log("***** on close:");
            cc.log(data);

            cc.log("连接gate服务器出错，尝试重连");

            success = true;

            that._gateServerStatus = CONNECT_FAIL;

            that.scheduleOnce(function () {
                that.connectGateServer(cb);
            }, RECONNECT_TIME);
        });

        lz.pomelo.init({
            host: lz.platformConfig.GATE_SERVER_HOST,
            port: lz.platformConfig.GATE_SERVER_PORT,
            user: {},
            handshakeCallback: function () {
            }
        }, function () {
            cc.log("gate server connect success");

            that.unscheduleAllCallbacks();

            success = true;

            that._gateServerStatus = CONNECT_SUCCESS;

            that.queryEntry(cb);
        });

        this.scheduleOnce(function () {
            if (!success) {
                that._gateServerStatus = CONNECT_FAIL;

                that.connectGateServer(cb);
            }
        }, CONNECT_TIMEOUT);
    },

    queryEntry: function (cb) {
        cc.log("Server queryEntry");

        this.unscheduleAllCallbacks();

        if (!this._gateServerStatus == CONNECT_SUCCESS) {
            cc.log("请勿在连接未成功时获取数据");
            return;
        }

        var success = false;

        var that = this;

        lz.pomelo.request(
            "gate.gateHandler.queryEntry",
            {},
            function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);

                that.unscheduleAllCallbacks();

                success = true;

                if (data.code == 200) {
                    var msg = data.msg;

                    that.update(msg);

                    that.off();
                    that.disconnect();

                    if (cb) {
                        cb(that._serverList);
                    }

                    that._closeAllWaitLayer();

                    lz.um.event("event_query_entry");
                } else {
                    that.scheduleOnce(function () {
                        that.connectGateServer(cb);
                    }, RECONNECT_TIME);
                }
            });

        this.scheduleOnce(function () {
            if (!success) {
                that.disconnect();
            }
        }, REQUEST_TIMEOUT);
    },

    connectGameServer: function (cb) {
        cc.log("Server connectGameServer: " + cb);

        this.unscheduleAllCallbacks();

        this._showWaitLayer();

        this.off();

        if (this.isConnect()) {
            this.disconnect();
        }

        var success = false;

        var that = this;

        this._gameServerStatus = CONNECT_TRYING;

        this.on("close", function (data) {
            cc.log("***** on close:");
            cc.log(data);

            cc.log("连接game服务器出错，尝试重连");

            success = true;

            that._gameServerStatus = CONNECT_FAIL;

            that.scheduleOnce(function () {
                that.connectGameServer(cb);
            }, RECONNECT_TIME);
        });

        lz.pomelo.init({
            host: this._host,
            port: this._port,
            user: {},
            handshakeCallback: function () {
            }
        }, function () {
            cc.log("game server connect success");

            that.unscheduleAllCallbacks();

            success = true;

            that._gameServerStatus = CONNECT_SUCCESS;
            that._disconnectStatus = DISCONNECT_DEFAULT;

            that.off();

            that.on("close", function (data) {
                cc.log("***** on close:");
                cc.log(data);

                cc.log("网络连接断开");

                that.off();

                that._gateServerStatus = CONNECT_FAIL;
                that._gameServerStatus = CONNECT_FAIL;

                that._closeAllWaitLayer();

                gameData.gameEnd();

                that.scheduleOnce(function () {
                    if (that._disconnectStatus == DISCONNECT_KICK) {
                        that.kick();
                    } else {
                        that.reConnect();
                    }
                }, 0.5);
            });

            that.on("onKick", function () {
                cc.log("***** on onKick:");

                cc.log("异地登录");

                that._disconnectStatus = DISCONNECT_KICK;
            });

            that._closeAllWaitLayer();

            if (cb) {
                cb();
            }
        });

        this.scheduleOnce(function () {
            if (!success) {
                that._gameServerStatus = CONNECT_FAIL;

                that.connectGameServer(cb);
            }
        }, CONNECT_TIMEOUT);
    },

    request: function (route, msg, cb, isBackstageRequest) {
        cc.log("Server request");

        this.unscheduleAllCallbacks();

        if (!isBackstageRequest) {
            this._showWaitLayer();
        }

        if (!this.isConnect()) {
            cc.log("等待重连");
            return;
        }

        var success = false;

        var that = this;
        lz.pomelo.request(route, msg, function (data) {
            that.unscheduleAllCallbacks();

            success = true;

            if (!isBackstageRequest) {
                that._closeWaitLayer();
            }

            cb(data);
        });

        this.scheduleOnce(function () {
            if (!success) {
                that.disconnect();
            }
        }, REQUEST_TIMEOUT);
    },

    kick: function () {
        cc.log("Server kick");

        cc.Director.getInstance().getScheduler().setTimeScale(MAIN_PLAY_SPEED);

        if (typeof(tbAdapter) != "undefined" && tbAdapter.TBLogout) {
            tbAdapter.TBLogout(0);
        }

        Dialog.pop("异地登录", function () {
            MainScene.destroy();
            cc.Director.getInstance().replaceScene(LoginScene.create());
        });
    },

    reConnect: function () {
        cc.log("Server reConnect");

        cc.Director.getInstance().getScheduler().setTimeScale(MAIN_PLAY_SPEED);

        if (typeof(tbAdapter) != "undefined" && tbAdapter.TBIsLogined) {
            if (!tbAdapter.TBIsLogined()) {
                MainScene.destroy();
                cc.Director.getInstance().replaceScene(LoginScene.create());
                return;
            }
        }

        gameData.user.login(function (type) {
            cc.log("Server reConnect success");

            cc.log("-----------------------------------------------------");
            cc.log("type: " + type);
            cc.log("-----------------------------------------------------");

            MainScene.destroy();

            switch (type) {
                case 0:
                    cc.Director.getInstance().replaceScene(LoginScene.create());
                    break;
                case 1:
                    break;
                case 2:
                    var loginScene = LoginScene.create();
                    loginScene.switchLayer(NewPlayerLayer);
                    cc.Director.getInstance().replaceScene(loginScene);
                    break;
                case 3:
                    break;
            }
        });
    },

    disconnect: function () {
        lz.pomelo.disconnect();
    },

    on: function (event, fn) {
        lz.pomelo.on(event, fn);
    },

    off: function () {
        lz.pomelo.off();
    },

    isConnect: function () {
        return (lz.pomelo.isConnect() && (this._gameServerStatus == CONNECT_SUCCESS || this._gateServerStatus == CONNECT_SUCCESS));
    },

    getRecommendArea: function () {
        cc.log("Server getRecommendArea");

        if (this._areaList) {
            var len = this._areaList.length;

            if (len > 0) {
                return this._areaList[len - 1].id;
            }
        }

        return 0;
    },

    _showWaitLayer: function () {
        cc.log("Server _showWaitLayer");

        this._waitTimes += 1;

        if (this._waitLayer) {
            return;
        }

        this._waitLayer = WaitLayer.pop();
    },

    _closeWaitLayer: function () {
        cc.log("Server _closeWaitLayer");

        this._waitTimes = Math.max(this._waitTimes - 1, 0);

        if (this._waitTimes <= 0 && this._waitLayer) {
            this._waitLayer.removeFromParent();
            this._waitLayer = null;
        }
    },

    _closeAllWaitLayer: function () {
        cc.log("Server _closeAllWaitLayer");

        this._waitTimes = 0;

        if (this._waitLayer) {
            this._waitLayer.removeFromParent();
            this._waitLayer = null;
        }
    }
});


Server.create = function () {
    var ret = new Server();

    if (ret) {
        return ret;
    }

    return null;
};


lz.server = Server.create();