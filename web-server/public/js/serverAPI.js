/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-28
 * Time: 下午6:54
 * To change this template use File | Settings | File Templates.
 */

var pomelo = window.pomelo;
var host = "";
var host = "127.0.0.1";
var servers = null;
var port = null;

function initServer(cb) {
    console.log("initServer");
    pomelo.init({
        host: host,
        port: 3009,
        log: true
    }, function () {

        var route = "gate.gateHandler.queryEntry";
        pomelo.request(route, {
            os: 'ALL',
            platform: 'ALL'
        }, function (data) {
            console.log(data);
            var msg = data.msg;
            port = msg.port;
            servers = msg.servers;
            if (cb) {
                cb();
            }

        });

    });
};


function initConnect(cb) {
    initServer(function () {
        pomelo.init({
            host: host,
            port: port,
            log: true
        }, function () {
            cb();
        });
    });
};

function connectServer(areaId, cb) {
    var route = "connector.entryHandler.entryForGM";
    pomelo.request(route, {
        areaId: areaId
    }, function (data) {
        if (data.code === 200) {
            console.log(data);
        } else {
            console.log(data);
        }
        cb(data.code);

    });

};

function connect(areaId, next) {
    async.waterfall([
        function (cb) {
            initConnect(function () {
                cb();
            })
        },
        function (cb) {
            connectServer(areaId, function (code) {
                if (code == 200) {
                    next();
                } else {
                    cb('error');
                }
            });
        }
    ])
};
