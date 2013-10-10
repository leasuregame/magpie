/**
 * Created with JetBrains WebStorm.
 * User: lcc
 * Date: 13-7-10
 * Time: 下午3:04
 * To change this template use File | Settings | File Templates.
 */


/*
 * card library
 * */


var CARD_NO_EXIST = 0;
var CARD_EXIST = 1;
var CARD_RECEIVE = 2;

var MAX_CARD_TABLE_ID = 250;

var CardLibrary = Entity.extend({
    _cardLibrary: [],

    init: function (data) {
        cc.log("CardLibrary init");

        this._cardLibrary = [];

        this._load();

        return true;
    },

    _load: function () {
        cc.log("CardLibrary _load");

        for (var i = 1; i <= MAX_CARD_TABLE_ID; ++i) {
            this._cardLibrary.push({
                type: CARD_EXIST,
                card: Card.create({
                    tableId: i,
                    lv: 1,
                    skillLv: 0
                })
            })
        }

        this._cardLibrary.sort(this._sort);
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
    }
});


CardLibrary.create = function () {
    var ret = new CardLibrary();

    if (ret) {
        return ret;
    }

    return null;
};