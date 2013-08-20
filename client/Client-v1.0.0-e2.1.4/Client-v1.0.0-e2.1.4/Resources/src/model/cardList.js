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

    init: function (cardList) {
        cc.log("CardList init");

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
            }
        } else {
            this._cardList[card.get("id")] = card;
        }

        this.update();
    },

    delete: function (card) {
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
        cc.log("CardList _sort");
        cc.log(type);

        return function (a, b) {
            return (cardList[a].has(type) && cardList[b].has(type) ? (cardList[a].get(type) - cardList[b].get(type)) : 0);
        }
    },

    sortCardList: function (type) {
        cc.log("CardList sortCardList");
        cc.log(type);

        type = type || SORT_CARD_LIST_BY_STAR;

        if (type == "") type = SORT_CARD_LIST_BY_STAR;

        this._index.sort(this._sort(this._cardList, type));

        return this._index;
    }
});


CardList.create = function () {
    var cardList = new CardList();

    if (cardList) {
        return cardList;
    }

    return null;
};