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
    _powerBuyCount: 0,
    _challengeBuyCount: 0,

    init: function (data) {
        cc.log("Shop init");

        this._useVipBoxList = [];
        this._powerBuyCount = 0;
        this._challengeBuyCount = 0;

        this.update(data);
    },

    update: function (data) {
        cc.log("Shop update");

        this.set("useVipBoxList", data.useVipBoxList);
        this.set("powerBuyCount", data.powerBuyCount);
        this.set("challengeBuyCount", data.challengeBuyCount);
    },

    getPaymentTypeList: function () {
        cc.log("Shop getPaymentTypeList");

        var table = outputTables.recharge.rows;
        var paymentTypeList = [];

        for (var key in table) {
            paymentTypeList.push(table[key]);
        }

        paymentTypeList.sort(this._cmp1);

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

        vipBoxList.sort(this._cmp1);

        return vipBoxList;
    },

    getVipPrivilegeList: function () {
        cc.log("Shop getVipPrivilege");

        var table = outputTables.vip_privilege.rows;
        var vipPrivilegeList = [];

        for (var key in table) {
            if (table[key].id != 0) {
                vipPrivilegeList.push(table[key]);
            }
        }

        vipPrivilegeList.sort(this._cmp1);

        return vipPrivilegeList;
    },

    getProductList: function () {
        cc.log("Shop getProductList");

        var table = outputTables.product.rows;
        var productList = [];

        for (var key in table) {
            if (table[key].isVisible) {
                productList.push(table[key]);
            }
        }

        productList.sort(this._cmp2);

        return productList;
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
        lz.server.request("area.vipHandler.buyVip", {
            id: id
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("payment success");

                var msg = data.msg;

                var player = gameData.player;
                var nowVip = msg.vip;
                var oldVip = player.get("vip");

                if (nowVip != oldVip) {
                    var rechargeTable = outputTables.recharge.rows[id];
                    var oldPrivilegeTable = outputTables.recharge.rows[oldVip];
                    var nowPrivilegeTable = outputTables.recharge.rows[nowVip];

                    player.add("gold", rechargeTable.cash * 10 + rechargeTable.gold);
                    player.set("vip", nowVip);

                    gameData.treasureHunt.add("freeCount", nowPrivilegeTable.lottery_free_count - oldPrivilegeTable.lottery_free_count);
                    gameData.friend.adds({
                        "maxFriendCount": nowPrivilegeTable.friend_count - oldPrivilegeTable.friend_count,
                        "giveCount": nowPrivilegeTable.give_bless_count - oldPrivilegeTable.give_bless_count,
                        "receiveCount": nowPrivilegeTable.receive_bless_count - oldPrivilegeTable.receive_bless_count
                    });
                    gameData.shop.add("powerBuyCount", nowPrivilegeTable.buy_power_count - oldPrivilegeTable.buy_power_count);
                    gameData.tournament.add("count", nowPrivilegeTable.challenge_count - oldPrivilegeTable.challenge_count);
                    gameData.spiritPool.add("collectCount", nowPrivilegeTable.spirit_collect_count - oldPrivilegeTable.spirit_collect_count);
                }

                cb();

                lz.dc.event("event_pay", id);
            } else {
                cc.log("payment fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    buyVipBox: function (cb, id) {
        cc.log("shop buyVipBox: " + id);

        var that = this;
        lz.server.request("area.vipHandler.buyVipBox", {
            boxId: id
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("buyVipBox success");

                var msg = data.msg;
                var table = outputTables.vip_box.rows[id];

                gameData.player.adds({
                    energy: table.energy || 0,
                    money: table.money || 0,
                    skillPoint: table.skillPoint || 0,
                    elixir: table.elixir || 0,
                    fragment: table.fragments || 0,
                    gold: -table.price
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

                cb({
                    energy: table.energy || 0,
                    money: table.money || 0,
                    skillPoint: table.skillPoint || 0,
                    elixir: table.elixir || 0,
                    fragment: table.fragments || 0,
                    cards: table.exp_card || 0
                });

                lz.dc.event("event_buy_vip_box", id);
            } else {
                cc.log("buyVipBox fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    getProduct: function (id) {
        cc.log("Shop getBuyProductMaxCount");

        var table = outputTables.product.rows[id];

        if (table) {
            var fn = this.ProductMaxCountHandle[table.method];

            if (fn) {
                return fn(table);
            }
        }

        return null;
    },

    buyProduct: function (cb, id, times) {
        cc.log("shop buyProduct: " + id + "," + times);

        var that = this;
        lz.server.request("area.buyHandler.buyProduct", {
            id: id,
            times: times
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("buyProduct success");

                var table = outputTables.product.rows[id];
                var msg = data.msg;

                var reward = that.ProductHandle[table.method](msg);

                cb(reward);

                lz.dc.event("event_buy_product", id)
            } else {
                cc.log("buyProduct fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    ProductMaxCountHandle: {
        expCard: function (table) {
            var product = {
                name: table.name,
                consumeType: table.consume_type,
                price: table.consume,
                obtain: table.obtain,
                unit: "张",
                count: 0,
                tip: ""
            };

            var count;

            var cardList = gameData.cardList;
            product.count = Math.floor((cardList.get("maxCount") - cardList.get("count")) / table.obtain);
            if (product.count <= 0) {
                product.tip = "卡牌已满";
                product.count = 0;
                return product;
            }

            var player = gameData.player;
            count = Math.floor(player.get("money") / product.price);
            if (count <= 0) {
                product.tip = "仙币不足";
                product.count = 0;
                return product;
            } else {
                product.count = Math.min(product.count, count);
            }

            return product;
        },

        money: function (table) {
            var product = {
                name: table.name,
                consumeType: table.consume_type,
                price: table.consume,
                obtain: table.obtain,
                unit: "仙币",
                count: 0,
                tip: ""
            };

            var count;
            var player = gameData.player;

            product.count = Math.ceil((player.get("maxMoney") - player.get("money")) / table.obtain);
            if (product.count <= 0) {
                product.tip = "仙币已满";
                product.count = 0;
                return product;
            }

            count = Math.floor(player.get("gold") / product.price);

            if (count <= 0) {
                product.tip = "魔石不足";
                product.count = 0;
                return product;
            } else {
                product.count = Math.min(product.count, count);
            }

            return product;
        },

        power: function (table) {
            var product = {
                name: table.name,
                consumeType: table.consume_type,
                price: table.consume,
                obtain: table.obtain,
                unit: "点",
                count: 0,
                tip: ""
            };

            product.count = gameData.shop.get("powerBuyCount");
            if (product.count <= 0) {
                product.tip = "体力购买次数已用完，VIP可购买更多";
                product.count = 0;
            }

            var count;
            var player = gameData.player;

            count = Math.floor(player.get("gold") / product.price);
            if (count <= 0) {
                product.tip = "魔石不足";
                product.count = 0;
                return product;
            } else {
                product.count = Math.min(product.count, count);
            }

            return product;
        },

        challengeCount: function (table) {
            var product = {
                name: table.name,
                consumeType: table.consume_type,
                price: table.consume,
                obtain: table.obtain,
                unit: "次",
                count: 0,
                tip: ""
            };

            product.count = gameData.shop.get("challengeBuyCount");
            if (product.count <= 0) {
                product.tip = "有奖竞技购买次数已用完，VIP可购买更多";
                product.count = 0;
            }

            var count;
            var player = gameData.player;

            count = Math.floor(player.get("gold") / product.price);
            if (count <= 0) {
                product.tip = "魔石不足";
                product.count = 0;
                return product;
            } else {
                product.count = Math.min(product.count, count);
            }

            return product;
        }
    },

    ProductHandle: {
        expCard: function (msg, times) {
            var cardIdList = msg.cardIds;
            var len = cardIdList.length;
            var cardData = msg.card;

            for (var i = 0; i < len; ++i) {
                cardData.id = cardIdList[i];
                var card = Card.create(cardData);
                gameData.cardList.push(card);
            }

            gameData.player.set(msg.consume.key, msg.consume.value);

            return {
                exp_card: len
            };
        },

        money: function (msg, times) {
            var player = gameData.player;

            player.add("money", msg.money);
            player.set(msg.consume.key, msg.consume.value);

            return {
                money: msg.money
            }
        },

        power: function (msg, times) {
            var player = gameData.player;

            gameData.shop.add("powerBuyCount", -times);
            player.add("power", msg.power);
            player.set(msg.consume.key, msg.consume.value);

            return {
                power: msg.power
            }
        },

        challengeCount: function (msg, times) {
            gameData.shop.add("challengeBuyCount", -times);
            gameData.tournament.add("count", msg.challengeCount);
            gameData.player.set(msg.consume.key, msg.consume.value);

            return {
                challengeCount: msg.challengeCount
            }
        }
    },

    _cmp1: function (a, b) {
        return (b.id - a.id);
    },

    _cmp2: function (a, b) {
        return (a.id - b.id);
    }
});


Shop.create = function () {
    var ret = new Shop();

    if (ret) {
        return ret;
    }

    return null;
}