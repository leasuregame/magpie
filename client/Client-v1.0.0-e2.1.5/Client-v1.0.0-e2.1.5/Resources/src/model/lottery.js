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
    _freeLowLotteryCard: false,
    _freeHighLotteryCard: false,
    _lotteryCount: 0,

    init: function (data) {
        cc.log("Lottery init");

        this.update(data);

        return true;
    },

    update: function (data) {
        cc.log("Lottery update");

        if (data) {
            this._freeLowLotteryCard = data.lowLuckyCard == 1;
            this._freeHighLotteryCard = data.highLuckyCard == 1;
        }
    },

    canLottery: function (type, level) {
        var player = gameData.player;

        if (type == LOTTERY_BY_ENERGY) {
            var energy = player.get("energy");

            if (level == 1 && energy < 200) {
                TipLayer.tip("活力值不足");
                return false;
            }

            if (level == 2 && energy < 1000) {
                TipLayer.tip("活力值不足");
                return false;
            }
        } else if (type == LOTTERY_BY_GOLD) {
            var gold = player.get("gold");

            if (level == 1 && !this._freeLowLotteryCard && gold < 39) {
                TipLayer.tip("魔石不足");
                return false;
            }

            if (level == 2 && !this._freeHighLotteryCard && gold < 199) {
                TipLayer.tip("魔石不足");
                return false;
            }
        } else {
            TipLayer.tip("抽卡类型错误");
            return false;
        }

        if (gameData.cardList.isFull()) {
            TipLayer.tip("卡牌已满，请先消耗");
            return false;
        }

        return true;
    },

    lottery: function (cb, type, level) {
        cc.log("Lottery lottery");

        var that = this;
        lz.server.request("area.trainHandler.luckyCard", {
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
                    if (level == 1 && that._freeLowLotteryCard) {
                        that._freeLowLotteryCard = false;
                    } else if (level == 2 && that._freeHighLotteryCard) {
                        that._freeHighLotteryCard = false;
                    } else {
                        player.add("gold", -msg.consume);
                    }
                } else if (type == LOTTERY_BY_ENERGY) {
                    player.add("energy", -msg.consume);
                }

                if (msg.fragment > 0) {
                    player.add("fragment", msg.fragment);
                }

                cb({
                    card: card,
                    fragment: msg.fragment
                });

                lz.dc.event("event_lottery", "type:" + type + " level:" + level);
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