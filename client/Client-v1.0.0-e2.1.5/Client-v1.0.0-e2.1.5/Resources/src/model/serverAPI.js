/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-6
 * Time: 下午4:53
 * To change this template use File | Settings | File Templates.
 */


/*
 * server API
 * */


var SERVER_HOST = "124.238.236.33";
//var SERVER_HOST = "192.168.1.8";
//var SERVER_HOST = "127.0.0.1";

var SERVER_PORT = 3010;
var connectSuccess = false;

var linkSever = function (cb) {
    _isUnknow = true;

    lzWindow.pomelo.init({
        host: SERVER_HOST,
        port: SERVER_PORT,
        user: {},
        handshakeCallback: function () {
        }
    }, function () {
        cc.log("connect success!");

        connectSuccess = true;

        if (cb) {
            cb();
        }

        lzWindow.pomelo.on("close", function (data) {
            cc.log("***** on close:");
            cc.log(data);

            connectSuccess = false;

            var cb = null;
            if (_isUnknow) {
                TipLayer.tip("游戏与服务器断开链接，正在尝试重连");

                cb = function () {
                    gameData.user.login(function () {
                        TipLayer.tip("重连成功");
                    });
                }
            }

            lzWindow.pomelo.off();

            linkSever(cb);
        });

        lzWindow.pomelo.on("onKick", function (data) {
            cc.log("***** on kick:");
            cc.log(data);

            _isUnknow = false;

            LogoutLayer.pop("异地登录");
        });
    });
};

linkSever();


