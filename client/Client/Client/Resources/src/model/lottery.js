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
var LOTTERY_BY_DAILY = 0;

var Lottery = Entity.extend({
    _lotteryCount: 0,

    init: function (data) {
        this.update(data);

        return true;
    },

    update: function (data) {
        this._lotteryCount = data.lotteryCount;
    },

    lottery: function (cb, lotteryType, level) {
        cc.log("Lottery lottery");

        if (lotteryType == LOTTERY_BY_GOLD) {

        } else if (lotteryType == LOTTERY_BY_DAILY) {

        } else {
            cb("lotteryType error");
        }

        var that = this;
        lzWindow.pomelo.request("", {type: lotteryType, level: level}, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("lottery success");

                var msg = data.msg;

                that.update({
                    lotteryCount: msg.lotteryCount
                });

                cb("success");
            } else {
                cc.log("lottery fail");

                cb("fail");
            }
        });
    }
})


Lottery.create = function (data) {
    var ret = new Lottery();

    if (ret && ret(data)) {
        return ret;
    }

    return null;
}