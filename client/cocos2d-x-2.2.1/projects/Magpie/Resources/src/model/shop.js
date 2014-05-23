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
var MAX_REMAIN_TIMES = 10000;

var Shop = Entity.extend({
    _useVipBoxList: [],
    _powerBuyCount: 0,
    _challengeBuyCount: 0,
    _expCardBuyCount: 0,
    _powerBuyMaxCount: 0,
    _challengeBuyMaxCount: 0,
    _expCardBuyMaxCount: 0,

    init: function (data) {
        cc.log("Shop init");

        this._useVipBoxList = [];
        this._powerBuyCount = 0;
        this._challengeBuyCount = 0;
        this._expCardBuyCount = 0;

        this.update(data);
        this.updateMaxCount();

        this.setListener();
    },

    update: function (data) {
        cc.log("Shop update");

        this.set("useVipBoxList", data.useVipBoxList);
        this.set("powerBuyCount", data.powerBuyCount);
        this.set("challengeBuyCount", data.challengeBuyCount);
        this.set("expCardBuyCount", data.expCardBuyCount);
    },

    setListener: function () {
        cc.log("Shop setListener");

        lz.server.on("onVerifyResult", function (data) {
            cc.log("***** on verify result:");
            cc.log(JSON.stringify(data));

            var msg = data.msg;

            cc.log(msg.gold);
            cc.log(msg.cash);
            cc.log(msg.goldCards);
            cc.log(msg.vipLoginReward);

            var player = gameData.player;

            player.set("gold", msg.gold);
            player.set("cash", msg.cash);

            if (msg.goldCards) {
                player.set("goldCards", msg.goldCards);
                gameMark.updateGoldCardsMark(false);
            }

            if (msg.recharge) {
                player.set("recharge", msg.recharge);
            }

            if (msg.firstRechargeBox) {
                player.set("firstRechargeBox", msg.firstRechargeBox);
            }

            if (msg.vipLoginReward) {
                gameData.activity.set("vipLoginReward", msg.vipLoginReward);
                gameMark.updateVipDailyRewardMark(false);
            }

            var nowVip = msg.vip;
            var oldVip = player.get("vip");

            if (nowVip && nowVip != oldVip) {
                cc.log(nowVip);
                cc.log(oldVip);

                player.set("vip", nowVip);

                var oldPrivilegeTable = outputTables.vip_privilege.rows[oldVip];
                var nowPrivilegeTable = outputTables.vip_privilege.rows[nowVip];

                gameData.treasureHunt.add("freeCount", nowPrivilegeTable.lottery_free_count - oldPrivilegeTable.lottery_free_count);
                gameData.friend.adds({
                    "maxFriendCount": nowPrivilegeTable.friend_count - oldPrivilegeTable.friend_count,
                    "giveCount": nowPrivilegeTable.give_bless_count - oldPrivilegeTable.give_bless_count,
                    "receiveCount": nowPrivilegeTable.receive_bless_count - oldPrivilegeTable.receive_bless_count
                });
                gameData.shop.add("powerBuyCount", nowPrivilegeTable.buy_power_count - oldPrivilegeTable.buy_power_count);
                gameData.shop.add("expCardBuyCount", nowPrivilegeTable.exp_card_count - oldPrivilegeTable.exp_card_count);
                gameData.tournament.add("count", nowPrivilegeTable.challenge_buy_count - oldPrivilegeTable.challenge_buy_count);
                gameData.spiritPool.add("collectCount", nowPrivilegeTable.spirit_collect_count - oldPrivilegeTable.spirit_collect_count);
                gameData.spiritPool.set("maxCollectCount", outputTables.daily_gift.rows[1].collect_count + outputTables.vip_privilege.rows[nowVip].spirit_collect_count);

            }
        });
    },

    updateMaxCount: function () {
        cc.log("Shop updateMaxCount");

        var vip = gameData.player.get("vip");

        var privilegeTable = outputTables.vip_privilege.rows[vip];
        var dailyGiftTable = outputTables.daily_gift.rows[1];

        this._powerBuyMaxCount = dailyGiftTable.power_buy_count + privilegeTable.buy_power_count;
        this._challengeBuyMaxCount = dailyGiftTable.challenge_buy_count + privilegeTable.challenge_buy_count;
        this._expCardBuyMaxCount = dailyGiftTable.exp_card_count + privilegeTable.exp_card_count;
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

        productList.sort(this._cmp3);

        return productList;
    },

    getNextVipCash: function () {
        var player = gameData.player;
        var vip = player.get("vip");

        if (vip == MAX_VIP_LEVEL) return 0;

        return outputTables.vip.rows[vip + 1].total_cash - player.get("cash");
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

                lz.um.event("event_buy_vip_box", id);
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

                var reward = that.ProductHandle[table.method](msg, times);

                cb(reward);

                lz.um.event("event_buy_product", id)
            } else {
                cc.log("buyProduct fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    getDailyReward: function (cb, type) {
        cc.log("shop getDailyReward: ", type);

        lz.server.request("area.cardHandler.getReward", {
            type: type
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);
            if (data.code == 200) {
                cc.log("getDailyReward fail");

                var msg = data.msg;
                var player = gameData.player;

                player.set("gold", msg.gold);
                player.set("goldCards", msg.goldCards);

                var id = (type == "month") ? 0 : 1;
                var paymentTypeList = gameData.shop.getPaymentTypeList();
                var pCard = paymentTypeList[id];

                lz.tipReward({"gold": pCard.daily_gold});
                gameMark.updateGoldCardsMark(false);

                cb();
            } else {
                cc.log("getDailyReward fail");

                TipLayer.tip(data.msg);
                cb();
            }

        });
    },

    ProductMaxCountHandle: {
        expCard: function (table) {
            var product = {
                name: "购买" + table.name,
                consumeType: table.consume_type,
                price: table.consume,
                obtain: table.obtain,
                unit: "张",
                count: 0,
                tip: "",
                maxBuyTimes: gameData.shop.get("expCardBuyMaxCount"),
                remainTimes: 0
            };

            var count;

            var cardList = gameData.cardList;
            var cardListCount = Math.floor((cardList.get("maxCount") - cardList.get("count")) / table.obtain);

            product.remainTimes = product.count = gameData.shop.get("expCardBuyCount");

            if (product.remainTimes <= 0) {
                product.tip = "经验元灵购买次数已用完，VIP可购买更多";
                product.remainTimes = 0;
                return product;
            }

            product.tip = "已达购买次数上限，无法购买更多";

            var player = gameData.player;
            count = Math.floor(player.get("money") / product.price);
            if (count <= 0) {
                product.tip = "仙币不足";
                product.count = 0;
            } else {
                if (count <= product.count) {
                    product.count = count;
                    product.tip = "仙币不足";
                }

                if (cardListCount <= product.count) {
                    product.count = cardListCount;
                    product.tip = "已达卡库容量上限，无法购买更多";
                }
            }

            return product;
        },

        money: function (table) {
            var product = {
                name: "购买" + table.name,
                consumeType: table.consume_type,
                price: table.consume,
                obtain: table.obtain,
                unit: "仙币",
                count: 0,
                tip: "",
                remainTimes: MAX_REMAIN_TIMES
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
                product.tip = "魔石不足";
            }

            return product;
        },

        power: function (table) {
            var product = {
                name: "购买" + table.name,
                consumeType: table.consume_type,
                price: table.consume,
                obtain: table.obtain,
                unit: "点",
                count: 0,
                tip: "",
                timesTip: "",
                maxBuyTimes: gameData.shop.get("powerBuyMaxCount"),
                remainTimes: 0,
                consume_inc: table.consume_inc || 0,
                consume_max: table.consume_max
            };

            product.remainTimes = product.count = gameData.shop.get("powerBuyCount");

            if (product.remainTimes <= 0) {
                product.tip = "体力购买次数已用完，VIP可购买更多";
                product.remainTimes = 0;
            }

            var count = 0;
            var player = gameData.player;
            var gold = player.get("gold");

            var usedCount = product.maxBuyTimes - product.remainTimes;
            var consume = 0;

            for (var i = 0; i < product.count; i++) {
                var tmpConsume = product.price + usedCount * product.consume_inc;
                if (product.consume_max) {
                    if (tmpConsume > product.consume_max) {
                        tmpConsume = product.consume_max;
                    }
                }
                consume += tmpConsume;
                if (gold < consume) {
                    break;
                }
                count++;
                usedCount++;
            }

            if (count <= 0) {
                product.tip = "魔石不足";
                product.count = 0;
            } else {
                if (count < product.count) {
                    product.count = count;
                    product.tip = "魔石不足";
                } else {
                    product.tip = "已达购买次数上限，无法购买更多";
                }
            }
            return product;
        },

        challengeCount: function (table) {
            var product = {
                name: "购买" + table.name,
                consumeType: table.consume_type,
                price: table.consume,
                obtain: table.obtain,
                unit: "次",
                count: 0,
                tip: "",
                maxBuyTimes: gameData.shop.get("challengeBuyMaxCount"),
                remainTimes: 0,
                consume_inc: table.consume_inc || 0,
                consume_max: table.consume_max
            };

            product.remainTimes = product.count = gameData.shop.get("challengeBuyCount");
            if (product.count <= 0) {
                product.tip = "有奖竞技购买次数已用完";
                product.count = 0;
            }

            var count = 0;
            var player = gameData.player;
            var gold = player.get("gold");

            var usedCount = product.maxBuyTimes - product.remainTimes;
            var consume = 0;

            for (var i = 0; i < product.count; i++) {
                var tmpConsume = product.price + usedCount * product.consume_inc;
                if (product.consume_max) {
                    if (tmpConsume > product.consume_max) {
                        tmpConsume = product.consume_max;
                    }
                }
                consume += tmpConsume;
                if (gold < consume) {
                    break;
                }
                count++;
                usedCount++;
            }

            if (count <= 0) {
                product.tip = "魔石不足";
                product.count = 0;
            } else {
                if (count < product.count) {
                    product.count = count;
                    product.tip = "魔石不足";
                } else {
                    product.tip = "已达购买次数上限，无法购买更多";
                }
            }

            return product;
        },
        cardCount: function (table) {
            var product = {
                name: "购买" + table.name,
                consumeType: table.consume_type,
                price: table.consume,
                obtain: table.obtain,
                unit: "个",
                count: 0,
                tip: "",
                maxBuyTimes: 0,
                remainTimes: MAX_REMAIN_TIMES,
                consume_inc: table.consume_inc || 0,
                consume_max: table.consume_max
            };


            var cardList = gameData.cardList;
            var cardTable = outputTables.resource_limit.rows[1];

            product.count = cardTable.card_count_limit - cardList.get("maxCount");

            product.maxBuyTimes = cardTable.card_count_limit - cardTable.card_count_min;
            product.remainTimes = cardTable.card_count_limit - cardList.get("maxCount");

            if (product.count <= 0) {
                product.tip = "已达到购买上限";
                product.count = 0;
                return product;
            }

            var count = 0;
            var player = gameData.player;
            var gold = player.get("gold");

            var usedCount = product.maxBuyTimes - product.remainTimes;
            var consume = 0;

            for (var i = 0; i < product.count; i++) {
                var tmpConsume = product.price + usedCount * product.consume_inc;
                if (product.consume_max) {
                    if (tmpConsume > product.consume_max) {
                        tmpConsume = product.consume_max;
                    }
                }
                consume += tmpConsume;
                if (gold < consume) {
                    break;
                }
                count++;
                usedCount++;
            }

            if (count <= 0) {
                product.tip = "魔石不足";
                product.count = 0;
                return product;
            } else {
                if (count < product.count) {
                    product.count = count;
                    product.tip = "魔石不足";
                } else {
                    product.tip = "已达卡库容量上限，无法购买更多";
                }
            }

            return product;
        },

        speaker: function (table) {
            var product = {
                name: "购买" + table.name,
                consumeType: table.consume_type,
                price: table.consume,
                obtain: table.obtain,
                unit: "喇叭",
                count: 0,
                tip: "",
                remainTimes: MAX_REMAIN_TIMES,
                discount_num: table.discount_num,
                discount: table.discount
            };

            var player = gameData.player;

            var count = Math.floor(player.get("gold") / product.price);

            if (count >= table.discount_num) {
                count = Math.floor(player.get("gold") / (product.price * table.discount * 0.1));
            }

            if (count <= 0) {
                product.tip = "魔石不足";
                product.count = 0;
                return product;
            } else {
                product.count = count;
                product.tip = "魔石不足";
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
            gameData.shop.add("expCardBuyCount", -times);
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
            gameData.tournament.set("count", msg.challengeCount);
            gameData.player.set(msg.consume.key, msg.consume.value);

            return {
                challengeCount: times
            }
        },

        cardCount: function (msg, times) {
            gameData.cardList.set("maxCount", msg.cardsCount);
            gameData.player.set(msg.consume.key, msg.consume.value);

            return {
                cardsCount: times
            }
        },

        speaker: function (msg, times) {
            gameData.player.set("speaker", msg.speaker);
            gameData.player.set(msg.consume.key, msg.consume.value);

            return {
                speaker: times
            }
        }
    },

    _cmp1: function (a, b) {
        return (b.id - a.id);
    },

    _cmp2: function (a, b) {
        return (a.id - b.id);
    },

    _cmp3: function (a, b) {
        return (a.order - b.order);
    }
});


Shop.create = function () {
    var ret = new Shop();

    if (ret) {
        return ret;
    }

    return null;
}