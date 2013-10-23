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

var linkSever = function () {
    lzWindow.pomelo.init({
        host: SERVER_HOST,
        port: SERVER_PORT,
        user: {},
        handshakeCallback: function () {
        }
    }, function () {
        cc.log("connect success!");

        if (connectSuccess) {

        }

        connectSuccess = true;

        lzWindow.pomelo.on("close", function (data) {
            cc.log("***** on close:");
            cc.log(data);
        });

        lzWindow.pomelo.on("onKick", function (data) {
            cc.log("***** on kick:");
            cc.log(data);
            connectSuccess = false;

            LogoutLayer.pop("异地登录");
        });
    });
};

linkSever();


