/**
 * Created with JetBrains WebStorm.
 * User: lcc
 * Date: 13-7-10
 * Time: 下午1:56
 * To change this template use File | Settings | File Templates.
 */


/*
 * lottery
 * */


var LOTTERY_BY_GOLD = 1;
var LOTTERY_BY_ENERGY = 0;

var Lottery = Entity.extend({
    _lotteryCount: 0,

    init: function (data) {
        cc.log("Lottery init");

        this.update(data);

        return true;
    },

    update: function () {
    },

    lottery: function (cb, type, level) {
        cc.log("Lottery lottery");

        if (type == LOTTERY_BY_GOLD) {
            cc.log("lottery by gold");
        } else if (type == LOTTERY_BY_ENERGY) {
            cc.log("lottery by energy");
        } else {
            cb("lottery type error");

            return;
        }

        var that = this;
        lzWindow.pomelo.request("logic.trainHandler.luckyCard", {playerId: 1, type: type, level: level}, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("lottery success");

                var msg = data.msg;

                cb("success");
            } else {
                cc.log("lottery fail");

                cb("fail");
            }
        });
    }
})


Lottery.create = function () {
    var ret = new Lottery();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}