/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-27
 * Time: 下午5:17
 * To change this template use File | Settings | File Templates.
 */


/*
 * card list
 * */


var SORT_CARD_LIST_BY_STAR = "star";
var SORT_CARD_LIST_BY_LV = "lv";
var SORT_CARD_LIST_BY_ABILITY = "ability";

var CardList = Entity.extend({
    _cardList: {},
    _index: [],
    _count: 0,
    _maxCount: 0,

    init: function (cardList, cardsCount) {
        cc.log("CardList init");

        this._maxCount = cardsCount || outputTables.resource_limit.rows[1].card_count_min;

        this._cardList = {};
        var len = cardList.length;

        for (var i = 0; i < len; ++i) {
            var cardId = cardList[i].id;
            var card = Card.create(cardList[i]);

            this._cardList[cardId] = card;
        }

        this.update();

        cc.log(this);

        return true;
    },

    update: function () {
        cc.log("CardList update");

        this._count = 0;
        this._index = [];

        var key;
        for (key in this._cardList) {
            this._index[this._count++] = this._cardList[key].get("id");
        }
    },

    push: function (card) {
        cc.log("CardList push");

        if (card instanceof Array) {
            var len = card.length;
            for (var i = 0; i < len; ++i) {
                this._cardList[card[i].get("id")] = card[i];
                card[i].setNewCardMark(true)
            }
        } else {
            this._cardList[card.get("id")] = card;
            card.setNewCardMark(true)
        }

        this.update();
    },

    deleteCard: function (card) {
        cc.log("CardList delete");

        if (card instanceof Array) {
            var len = card.length;
            for (var i = 0; i < len; ++i) {
                delete this._cardList[card[i].get("id")];
            }
        } else {
            delete this._cardList[card.get("id")];
        }

        this.update();
    },

    deleteById: function (cardId) {
        cc.log("CardList deleteById");
        cc.log(cardId);

        if (cardId instanceof Array) {
            var len = cardId.length;
            for (var i = 0; i < len; ++i) {
                delete this._cardList[cardId[i]];
            }
        } else {
            delete this._cardList[cardId];
        }

        this.update();
    },

    getCardByIndex: function (index) {
        cc.log("CardList getCardByIndex");
        cc.log(index);

        return this._cardList[index];
    },

    _sort: function (cardList, type) {
        cc.log("CardList _sort: " + type);

        var typeList = [type, SORT_CARD_LIST_BY_STAR, SORT_CARD_LIST_BY_ABILITY, SORT_CARD_LIST_BY_LV];
        var lineUp = gameData.lineUp;

        return function (a, b) {
            var aa = cardList[a];
            var bb = cardList[b];
            var len = typeList.length;

            var aaLineUpIndex = lineUp.getCardOfLineUp(aa.get("id"));
            var bbLineUpIndex = lineUp.getCardOfLineUp(bb.get("id"));

            aaLineUpIndex = aaLineUpIndex != undefined ? aaLineUpIndex : 100000000;
            bbLineUpIndex = bbLineUpIndex != undefined ? bbLineUpIndex : 100000000;

            if (aaLineUpIndex != bbLineUpIndex) {
                return (aaLineUpIndex < bbLineUpIndex ? 1 : -1);
            }

            for (var i = 0; i < len; ++i) {
                if (aa.has(typeList[i]) && bb.has(typeList[i])) {
                    if (aa.get(typeList[i]) != bb.get(typeList[i])) {
                        return (aa.get(typeList[i]) - bb.get(typeList[i]));
                    }
                }
            }

            return 0;
        }
    },

    sortCardList: function (type) {
        cc.log("CardList sortCardList");
        cc.log(type);

        type = type || SORT_CARD_LIST_BY_STAR;

        if (type == "") type = SORT_CARD_LIST_BY_STAR;

        this._index.sort(this._sort(this._cardList, type));

        return this._index;
    },

    isFull: function () {
        return (this._count >= this._maxCount);
    },

    sell: function (cb, cardIdList) {
        cc.log("CardList sell");
        cc.log(cardIdList);

        var that = this;
        lz.server.request("area.trainHandler.sellCards", {
            ids: cardIdList
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("sell success");

                var msg = data.msg;

                that.deleteById(cardIdList);

                gameData.player.add("money", msg.price);

                lz.tipReward("money", msg.price);

                cb();

                lz.um.event("event_card_sell", cardIdList.length);
            } else {
                cc.log("upgrade fail");
            }
        });
    },

    dissolveCard: function (ids, cb) {
        cc.log("Card dissolveCard: " + ids);

        var that = this;
        lz.server.request("area.convertorHandler.dissolveCard", {
            cardIds: ids
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                cc.log("dissolveCard success");

                var msg = data.msg;
                gameData.player.adds(msg);
                that.deleteById(ids);

                cb(msg);
            } else {
                cc.log("dissolveCard fail");

                TipLayer.tip(data.msg);
            }
        });
    }
});


CardList.create = function () {
    var cardList = new CardList();

    if (cardList) {
        return cardList;
    }

    return null;
};
