/**
 * Created with JetBrains WebStorm.
 * User: lcc
 * Date: 13-7-10
 * Time: 下午3:04
 * To change this template use File | Settings | File Templates.
 */


/*
 * card library
 *
 * 读取本地数据，与数据库数据做对比，分出三种状态，每次获得卡牌更新
 * */


var CARD_NO_EXIST = 0;
var CARD_EXIST = 1;
var CARD_RECEIVE = 2;

var CardLibrary = Entity.extend({
    _cardLibrary: [],

    init: function (data) {
        cc.log("CardLibrary init");

        this._loadData();

        return true;
    },

    _loadData: function () {
        cc.log("CardLibrary _loadData");

        this._cardLibrary = [];
        for (var i = 1; i <= 250; ++i) {
            this._cardLibrary.push({
                type: CARD_EXIST,
                card: Card.create({
                    tableId: i,
                    lv: 1,
                    skillLv: 1
                })
            })
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