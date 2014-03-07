/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-10-14
 * Time: 下午4:43
 * To change this template use File | Settings | File Templates.
 */



/*
 * exchange
 * */


var EXCHANGE_STAR4_CARD = 10;
var EXCHANGE_STAR5_CARD = 30;

var SELECT_ALL_EXCHANGE_CARD = 0;
var SELECT_STAR4_EXCHANGE_CARD = 1;
var SELECT_STAR5_EXCHANGE_CARD = 2;

var Exchange = Entity.extend({
    _exchangeCardList: [],

    init: function (ids) {
        cc.log("Exchange inigt");
        this._exchangeCardList = [];

        this._updateList(ids);
    },

    _updateList: function (ids) {
        cc.log("Exchange updateList: " + ids);

        this._exchangeCardList = [];
        var len = ids.length;

        for (var i = 0; i < len; ++i) {

            var card = null;
            if (ids[i] > 0) {
                card = Card.create({
                    tableId: ids[i],
                    lv: 1,
                    skillLv: 1
                });
            }
            this._exchangeCardList.push({
                id: ids[i],
                card: card
            });
        }

    },

    _changeExchangeCardId: function (id) {
        cc.log("Exchange _changeExchangeCardId: " + id);

        var len = this._exchangeCardList.length;
        for (var i = 0; i < len; i++) {
            if (this._exchangeCardList[i].id == id) {
                this._exchangeCardList[i].id = -1 * id;
                break;
            }
        }

    },

    _sort: function (a, b) {
        var starA = a.card.get("star");
        var starB = b.card.get("star");

        var tableIdA = a.card.get("tableId");
        var tableIdB = b.card.get("tableId");

        if (starA != starB) {
            return (starB - starA);
        } else {
            return tableIdA - tableIdB;
        }
    },

    getExchangeCardList: function () {
        cc.log("Exchange getExchangeCardList");

        return this._exchangeCardList;
    },

    canExchange: function (star) {
        cc.log("Exchange canExchange");

        var fragment = gameData.player.get("fragment");

        if (star == 4) {
            if (fragment < EXCHANGE_STAR4_CARD) {
                TipLayer.tip("卡魂不足兑换4星卡牌");
                return false;
            }
        }

        if (star == 5) {
            if (fragment < EXCHANGE_STAR5_CARD) {
                TipLayer.tip("卡魂不足兑换5星卡牌");
                return false;
            }
        }

        return true;
    },

    getExchangeCards: function (cb) {
        cc.log("Exchange getExchangeCards");

        var that = this;
        lz.server.request("area.trainHandler.getExchangeCards",
            {},
            function (data) {
                cc.log(data);

                if (data.code == 200) {
                    cc.log("getExchangeCards success");
                    var ids = data.msg.ids;
                    that._updateList(ids);
                    gameData.player.add("money", -1000);
                    cb();
                } else {
                    cc.log("getExchangeCards fail");
                    TipLayer.tip(data.msg);
                    cb();
                }
            }
        );
    },

    exchange: function (cb, id, star) {
        cc.log("Exchange exchange");

        var that = this;
        lz.server.request("area.trainHandler.exchangeCard", {
            tableId: id
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("exchange success");

                var msg = data.msg;

                var consume = 0;
                if (star === 4) {
                    consume = EXCHANGE_STAR4_CARD;
                } else if (star === 5) {
                    consume = EXCHANGE_STAR5_CARD;
                }

                gameData.player.add("fragment", -consume);
                that._changeExchangeCardId(id);

                var card = Card.create(msg.card);
                gameData.cardList.push(card);
                cb(card);

                lz.um.event("event_exchange_card", id);
            } else {
                cc.log("exchange fail");
            }
        });
    }
});


Exchange.create = function () {
    var ret = new Exchange();

    if (ret) {
        return ret;
    }

    return null;
};