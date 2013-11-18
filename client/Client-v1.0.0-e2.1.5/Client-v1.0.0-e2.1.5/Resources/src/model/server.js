/**
 * Created by lcc3536 on 13-11-5.
 */


/*
 * server
 * */


// gate server config
var GATE_SERVER_HOST = "124.238.236.33";
var GATE_SERVER_PORT = "3009";

// wait layer handler priority
var WAIT_LAYER_HANDLER_PRIORITY = -500;

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

// area status
var AREA_STATUS = {
    10: {
        statusName: "新区",
        color: cc.c3b(108, 218, 0),
        canLogin: true
    },

    20: {
        statusName: "正常",
        color: cc.c3b(0, 195, 244),
        canLogin: true
    },

    30: {
        statusName: "爆满",
        color: cc.c3b(226, 0, 0),
        canLogin: true
    },

    40: {
        statusName: "维护",
        color: cc.c3b(120, 120, 120),
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

    init: function () {
        cc.log("Server init");
    },

    update: function (data) {
        cc.log("Server update");

        this._host = data.host;
        this._port = 3010;
        this._areaList = data.servers;

        var len = this._areaList.length;
        for (var i = 0; i < len; ++i) {
            var status = AREA_STATUS[this._areaList[i].status];

            this._areaList[i].statusName = status.statusName;
            this._areaList[i].color = status.color;
            this._areaList[i].canLogin = status.canLogin;
            this._areaList[i].desc = this._areaList[i].id + "区  " + this._areaList[i].name + "  " + status.statusName;
        }
    },

    connectGateServer: function (cb) {
        cc.log("Server connectGateServer");

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

            lz.scheduleOnce(function () {
                that.connectGateServer(cb);
            }, RECONNECT_TIME);
        });

        lz.pomelo.init({
            host: GATE_SERVER_HOST,
            port: GATE_SERVER_PORT,
            user: {},
            handshakeCallback: function () {
            }
        }, function () {
            cc.log("gate server connect success");

            success = true;

            that._gateServerStatus = CONNECT_SUCCESS;

            that.queryEntry(cb);
        });

        lz.scheduleOnce(function () {
            if (!success) {
                that._gateServerStatus = CONNECT_FAIL;

                that.connectGateServer(cb);
            }
        }, CONNECT_TIMEOUT);
    },

    queryEntry: function (cb) {
        cc.log("Server queryEntry");

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

                    lz.dc.event("event_query_entry");
                } else {
                    lz.scheduleOnce(function () {
                        that.connectGateServer(cb);
                    }, RECONNECT_TIME);
                }
            });

        lz.scheduleOnce(function () {
            if (!success) {
                that.disconnect();
            }
        }, REQUEST_TIMEOUT);
    },

    connectGameServer: function (cb) {
        cc.log("Server connectGameServer");

        if (this.isConnect()) {
            cb();

            return;
        }

        this._showWaitLayer();

        this.off();

        var success = false;

        var that = this;

        this._gameServerStatus = CONNECT_TRYING;

        this.on("close", function (data) {
            cc.log("***** on close:");
            cc.log(data);

            cc.log("连接game服务器出错，尝试重连");

            success = true;

            that._gameServerStatus = CONNECT_FAIL;

            lz.scheduleOnce(function () {
                that.connectGameServer();
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

            success = true;

            that._gameServerStatus = CONNECT_SUCCESS;

            that.off();

            that.on("close", function (data) {
                cc.log("***** on close:");
                cc.log(data);

                cc.log("网络连接断开");

                that.off();
                that._closeAllWaitLayer();

                that._gateServerStatus = CONNECT_FAIL;
                that._gameServerStatus = CONNECT_FAIL;

                LogoutLayer.pop("请重新连接");
            });

            that._closeAllWaitLayer();

            if (cb) {
                cb();
            }
        });

        lz.scheduleOnce(function () {
            if (!success) {
                that._gameServerStatus = CONNECT_FAIL;

                that.connectGameServer();
            }
        }, CONNECT_TIMEOUT);
    },

    request: function (route, msg, cb, isBackstageRequest) {
        cc.log("Server request");

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
            success = true;

            if (!isBackstageRequest) {
                that._closeWaitLayer();
            }

            cb(data);
        });

        lz.scheduleOnce(function () {
            if (!success) {
                that.disconnect();
            }
        }, REQUEST_TIMEOUT);
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
        return (lz.pomelo.isConnect() && this._gameServerStatus == CONNECT_SUCCESS);
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

        this._waitLayer = LazyLayer.create();
        this._waitLayer.setTouchPriority(WAIT_LAYER_HANDLER_PRIORITY);
        cc.log(cc.Director.getInstance().getRunningScene());
        cc.Director.getInstance().getRunningScene().addChild(this._waitLayer, 10000);

        var waitSprite = cc.Sprite.create(main_scene_image.icon42);
        waitSprite.setPosition(cc.p(320, 568));
        this._waitLayer.addChild(waitSprite);

        waitSprite.setOpacity(0);

        waitSprite.runAction(
            cc.Sequence.create(
                cc.DelayTime.create(0.3),
                cc.Spawn.create(
                    cc.FadeIn.create(0.3),
                    cc.RotateBy.create(0.3, -120)
                ),
                cc.CallFunc.create(function () {
                    waitSprite.runAction(
                        cc.RepeatForever.create(
                            cc.RotateBy.create(0.3, -120)
                        )
                    )
                })
            )
        );
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