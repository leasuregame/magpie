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
    _length: 0,

    init: function (cardList, lineUp) {
        cc.log("CardList init");

        this._length = cardList.length;

        for (var i = 0; i < this._length; ++i) {
            var cardId = cardList[i].id;
            var card = Card.create(cardList[i]);

            this._cardList[cardId] = card;
            this._index[i] = cardId;
        }

        var key;
        for (key in lineUp) {
            var cardId = lineUp[key];
            this._cardList[cardId].set("isUse", true);
        }

        cc.log(this._cardList[1]);
        cc.log(this);

        return true;
    },

    push: function (card) {
        cc.log("CardList push");

        if(card instanceof Array) {
            var len = card.length;
            for(var i = 0; i < len; ++i) {
                this._cardList[card[i].get("id")] = card[i];
            }
        } else {
            this._cardList[card.get("id")] = card;
        }
    },

    delete: function (card) {
        cc.log("CardList delete");

        if(card instanceof Array) {
            var len = card.length;
            for(var i = 0; i < len; ++i) {
                delete this._cardList[card[i].get("id")];
            }
        } else {
            delete this._cardList[card.get("id")];
        }
    },

    getCardByIndex: function (index) {
        cc.log("CardList getCardByIndex");
        cc.log(index);

        return this._cardList[index];
    },

    changeUseCardByIndex: function (index) {
        cc.log("CardList changeUseCardByIndex");

        var isUse = !this._cardList[index].get("isUse");
        this._cardList[index].set("isUse", isUse);

        return isUse;
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
})


CardList.create = function () {
    var cardList = new CardList();

    if (cardList) {
        return cardList;
    }

    return null;
}