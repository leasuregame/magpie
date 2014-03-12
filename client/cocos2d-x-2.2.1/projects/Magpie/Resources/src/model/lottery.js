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
    _firstHighTenLuckCard: false,
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
            this._firstHighTenLuckCard = data.highTenLuckCard == 1;
        }
    },

    canLottery: function (type, level, times) {
        var player = gameData.player;

        if (type == LOTTERY_BY_ENERGY) {
            var energy = player.get("energy");

            if (level == 1) {
                var needEnergy = (times == 1) ? 200 * times : 200 * times * 0.8;
                if (energy < needEnergy) {
                    TipLayer.tip("活力点不足");
                    return false;
                }
            }

            if (level == 2) {
                var needEnergy = (times == 1) ? 1000 * times : 1000 * times * 0.8;
                if (energy < needEnergy) {
                    TipLayer.tip("活力点不足");
                    return false;
                }
            }
        } else if (type == LOTTERY_BY_GOLD) {
            var gold = player.get("gold");

            if (level == 1 && !this._freeLowLotteryCard) {
                var needGold = (times == 1) ? 39 * times : 39 * times * 0.8;
                if (gold < needGold) {
                    TipLayer.tip("魔石不足");
                    return false;
                }
            }

            if (level == 2 && !this._freeHighLotteryCard) {
                var needGold = (times == 1) ? 199 * times : 199 * times * 0.8;
                if (gold < needGold) {
                    TipLayer.tip("魔石不足");
                    return false;
                }
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

                lz.um.event("event_lottery", "type:" + type + " level:" + level);
            } else {
                cc.log("lottery fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    },

    tenLottery: function (cb, type, level) {
        cc.log("Lottery tenLottery");

        var that = this;
        lz.server.request("area.trainHandler.luckyCard", {
            times: 10,
            type: type,
            level: level
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("lottery success");

                var msg = data.msg;
                var cards = [];
                for (var i = 0; i < msg.cards.length; i++) {
                    cards[i] = Card.create(msg.cards[i]);
                    gameData.cardList.push(cards[i]);
                }

                if (type == LOTTERY_BY_GOLD && level == 2) {
                    that.set("firstHighTenLuckCard", false);
                }

                var player = gameData.player;
                if (type == LOTTERY_BY_GOLD) {
                    player.add("gold", -msg.consume);
                } else if (type == LOTTERY_BY_ENERGY) {
                    player.add("energy", -msg.consume);
                }

                if (msg.fragment > 0) {
                    player.add("fragment", msg.fragment);
                }

                cb({
                    card: cards,
                    fragment: msg.fragment
                });

                lz.um.event("event_lottery", "type:" + type + " level:" + level);
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