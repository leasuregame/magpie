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


var SERVER_HOST = "192.168.1.3";
var SERVER_PORT = 3010;
var ConnectSuccess = false;

lzWindow.pomelo.init({
    host: SERVER_HOST,
    port: SERVER_PORT,
    user: {},
    handshakeCallback: function () {
    }
}, function () {
    cc.log('connect success!');
    ConnectSuccess = true;

    lzWindow.pomelo.on('close', function (data) {
        cc.log('*****close');
        cc.log(data);
        ConnectSuccess = false;
    });

    lzWindow.pomelo.on('onMessage', function (data) {
        cc.log('***** on chart: ', data);
    });
});
