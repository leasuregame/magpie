/**
 * Created with JetBrains WebStorm.
 * User: xiejiayue
 */

(function(){

    var pomeloHandle = {};

    var API = {
        SYS_MSG : 'area.messageHandler.sysMsg',
        RECHARGE : 'area.gmRechargeHandler.recharge'
    };

    function disconnect() {
        pomelo.disconnect();
        console.log("disconnect success");
    }

    /**
     * 按序进行以下操作: 连接areaId服务器, 请求module, 断开连接
     * @param areaId
     * @param moduleId
     * @param msg
     * @param reqCb
     * @param finalCb
     */
    pomeloHandle.request = function (areaId, moduleId, msg, reqCb, finalCb) {
        async.waterfall([
            // 连接服务器
            function(cb) {
                connect(areaId * 1, function() {
                    cb();
                });
            },
            // 发送请求
            function(cb) {
                pomelo.request(moduleId, msg, function(data) {
                    console.log(data);
                    reqCb(data, cb);
                });
            },
            // 断开连接
            function(cb) {
                disconnect();
                cb();
            }
        ], function(err) {
            if (err) {
                return finalCb(err);
            }
            finalCb(null);
        });
    };

    window.pomeloAPI = pomeloHandle;
    window.pomeloAPI.API = API;
}());