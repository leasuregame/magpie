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

        return true;
    },

    update: function () {
        cc.log("Lottery update");
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
        lzWindow.pomelo.request("area.trainHandler.luckyCard", {
            type: type,
            level: level
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("lottery success");

                var msg = data.msg;

                var card = Card.create(msg.card);
                gameData.cardList.push(card);

                var player = gameData.player;
                if (type == LOTTERY_BY_GOLD) {
                    player.add("gold", -msg.consume);
                } else if (type == LOTTERY_BY_ENERGY) {
                    player.add("energy", -msg.consume);
                }

                if (msg.fragment > 0) {
                    player.add("fragment", msg.fragment);
                }

                cb(card);
            } else {
                cc.log("lottery fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    }
});


Lottery.create = function () {
    var ret = new Lottery();

    if (ret) {
        return ret;
    }

    return null;
};