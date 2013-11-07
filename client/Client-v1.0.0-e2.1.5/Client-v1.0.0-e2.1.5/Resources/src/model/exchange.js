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


var EXCHANGE_STAR4_CARD = 15;
var EXCHANGE_STAR5_CARD = 40;

var SELECT_ALL_EXCHANGE_CARD = 0;
var SELECT_STAR4_EXCHANGE_CARD = 1;
var SELECT_STAR5_EXCHANGE_CARD = 2;

var Exchange = Entity.extend({
    _exchangeCardList: [],

    init: function () {
        cc.log("Exchange inigt");

        this._exchangeCardList = [];

        this._load();
    },

    _load: function () {
        cc.log("Exchange _load");

        var table = outputTables.cards.rows;

        for (var i = 1; i <= MAX_CARD_TABLE_ID; ++i) {
            if (table[i].star === 4 || table[i].star === 5) {
                this._exchangeCardList.push({
                    id: i,
                    card: Card.create({
                        tableId: i,
                        lv: 1,
                        skillLv: 0
                    })
                })
            }
        }

        this._exchangeCardList.sort(this._sort);
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

    getExchangeCardList: function (type) {
        cc.log("Exchange getExchangeCardList");

        type = type || SELECT_ALL_EXCHANGE_CARD;

        if (type == SELECT_ALL_EXCHANGE_CARD) {
            return this._exchangeCardList;
        }

        var cardList = [];
        var len = this._exchangeCardList.length;

        for (var i = 0; i < len; ++i) {
            var star = this._exchangeCardList[i].card.get("star");

            if (type == SELECT_STAR4_EXCHANGE_CARD && star === 4) {
                cardList.push(this._exchangeCardList[i]);
            }

            if (type == SELECT_STAR5_EXCHANGE_CARD && star == 5) {
                cardList.push(this._exchangeCardList[i]);
            }
        }

        return cardList;
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

                var card = Card.create(msg.card);

                gameData.cardList.push(card);

                cb(card);
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