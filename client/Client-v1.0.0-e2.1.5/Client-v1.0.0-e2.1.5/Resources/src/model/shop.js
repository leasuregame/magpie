/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-4
 * Time: 下午4:57
 * To change this template use File | Settings | File Templates.
 */


/*
 * shop
 * */


var MAX_VIP_LEVEL = 12;

var Shop = Entity.extend({
    _useVipBoxList: [],

    init: function (data) {
        cc.log("Shop init");

        this._useVipBoxList = data.useVipBoxList;
    },

    getPaymentTypeList: function () {
        cc.log("Shop getPaymentTypeList");

        var table = outputTables.recharge.rows;
        var paymentTypeList = [];

        for (var key in table) {
            paymentTypeList.push(table[key]);
        }

        paymentTypeList.sort(this._cmp);

        return paymentTypeList;
    },

    getVipBoxList: function () {
        cc.log("Shop getVipBoxList");

        var table = outputTables.vip_box.rows;
        var vipBoxList = [];
        var len = this._useVipBoxList.length;

        for (var key in table) {
            var i;

            for (i = 0; i < len; ++i) {
                if (this._useVipBoxList[i] == table[key].id) {
                    break;
                }
            }

            if (i == len) {
                vipBoxList.push(table[key]);
            }
        }

        vipBoxList.sort(this._cmp);

        return vipBoxList;
    },

    getVipPrivilegeList: function () {
        cc.log("Shop getVipPrivilege");

        var table = outputTables.vip_privilege.rows;
        var vipPrivilegeList = [];

        for (var key in table) {
            vipPrivilegeList.push(table[key]);
        }

        vipPrivilegeList.sort(this._cmp);

        return vipPrivilegeList;
    },

    getNextVipCash: function () {
        var player = gameData.player;
        var vip = player.get("vip");

        if (vip == MAX_VIP_LEVEL) return 0;

        return outputTables.vip.rows[vip + 1].total_cash - player.get("cash");
    },

    payment: function (cb, id) {
        cc.log("Shop payment: " + id);

        var that = this;
        lzWindow.pomelo.request("area.vipHandler.buyVip", {
            id: id
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("payment success");

                var msg = data.msg;

                if (msg.player && msg.player.vip != gameData.player.get("vip")) {
                    var table = outputTables.recharge.rows[id];

                    gameData.player.add("gold", table.cash * 10 + table.gold);

                    gameData.player.set("vip", msg.player.vip);

                    gameData.friend.init({
                        friendList: msg.player.friends,
                        giveBlessCount: msg.player.dailyGift.gaveBless.count,
                        giveBlessList: msg.player.dailyGift.gaveBless.receivers,
                        receiveBlessCount: msg.player.dailyGift.receivedBless.count,
                        receiveBlessList: msg.player.dailyGift.receivedBless.givers
                    });

                    gameData.treasureHunt.init({
                        count: msg.player.dailyGift.lotteryCount,
                        freeCount: msg.player.dailyGift.lotteryFreeCount
                    });

                    gameData.spiritPool.init(msg.player.spiritPool);
                }

                cb();
            } else {
                cc.log("payment fail");
            }
        });
    },

    buyVipBox: function (cb, id) {
        cc.log("shop buyVipBox: " + id);

        var that = this;
        lzWindow.pomelo.request("area.vipHandler.buyVipBox", {
            boxId: id
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("buyVipBox success");

                var msg = data.msg;
                var table = outputTables.vip_box.rows[id];

                gameData.player.adds({
                    power: table.power || 0,
                    energy: table.energy || 0,
                    money: table.money || 0,
                    skillPoint: table.skillPoint || 0,
                    elixir: table.elixir || 0,
                    fragment: table.fragments || 0,
                    gold: table.price
                });

                var cardIdList = msg.cardIds;
                var len = cardIdList.length;
                var cardData = msg.card;

                for (var i = 0; i < len; ++i) {
                    cardData.id = cardIdList[i];
                    var card = Card.create(cardData);
                    gameData.cardList.push(card);
                }

                that._useVipBoxList.push(id);

                cb();
            } else {
                cc.log("buyVipBox fail");
            }
        });
    },

    buyExpCard: function (cb, count) {
        cc.log("Shop buyExpCard: " + count);

        var that = this;
        lzWindow.pomelo.request("area.vipHandler.buyExpCard", {
            qty: count
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("buyExpCard success");

                var msg = data.msg;

                var cardIdList = msg.cardIds;
                var len = cardIdList.length;
                var cardData = msg.card;

                for (var i = 0; i < len; ++i) {
                    cardData.id = cardIdList[i];
                    var card = Card.create(cardData);
                    gameData.cardList.push(card);
                }

                gameData.player.add("money", -5000 * count);

                cb();
            } else {
                cc.log("buyExpCard fail");
            }
        });
    },

    _cmp: function (a, b) {
        return (b.id - a.id);
    }
});


Shop.create = function () {
    var ret = new Shop();

    if (ret) {
        return ret;
    }

    return null;
}