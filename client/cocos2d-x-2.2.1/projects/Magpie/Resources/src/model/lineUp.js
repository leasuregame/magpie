/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-11
 * Time: 下午4:53
 * To change this template use File | Settings | File Templates.
 */


/*
 * line up
 * */


var MAX_LINE_UP_CARD = 2;
var MAX_LINE_UP_SIZE = 6;
var SPIRIT_ID = -1;

var LineUp = Entity.extend({
    _lineUp: {},
    _count: 0,

    init: function (data) {
        cc.log("LineUp init");

        this.update(data);

        this.off();
        this.on("lineUpChange", this._lineUpChangeEvent);

        return true;
    },

    update: function (data) {
        cc.log("LineUp update");

        var lineUp = {};
        var count = 0;
        for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
            if (data[i] !== undefined) {
                count++;
                lineUp[i] = data[i];
            }
        }

        this.set("lineUp", lineUp);
        this.set("count", count);
    },

    _lineUpChangeEvent: function () {
        cc.log("LineUp _lineUpChangeEvent");

        gameData.player.checkAbility();
    },

    getLineUpCardList: function () {
        cc.log("LineUp getLineUpCardList");

        var lineUpCardList = [];
        var cardList = gameData.cardList;

        for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
            if (this._lineUp[i] !== undefined && this._lineUp[i] >= 0) {
                lineUpCardList.push(cardList.getCardByIndex(this._lineUp[i]));
            }
        }

        return lineUpCardList;
    },

    getLineUpList: function () {
        cc.log("LineUp getLineUpList");

        var lineUpList = [];

        for (var key in this._lineUp) {
            lineUpList.push(this._lineUp[key]);
        }

        return lineUpList;
    },

    getLineUpByIndex: function (index) {
        cc.log("LineUp getLineUpByIndex: " + index);

        return this._lineUp[index];
    },

    isLineUpCard: function (cardId) {
        cc.log("LineUp isLineUpCard");

        for (var key in this._lineUp) {
            if (this._lineUp[key] == cardId) {
                return true;
            }
        }

        return false;
    },

    changeLineUp: function (cb, lineUp) {
        cc.log("LineUp changeLineUp");
        cc.log(lineUp);

        for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
            if (this._lineUp[i] != lineUp[i]) {
                var that = this;

                lz.server.request("area.trainHandler.changeLineUp", {
                    lineUp: lineUp
                }, function (data) {
                    cc.log(data);

                    if (data.code == 200) {
                        cc.log("changeLineUp success");

                        var msg = data.msg;

                        that.update(msg.lineUp);

                        cb(true);

                        lz.um.event("event_lineup");
                    } else {
                        cc.log("changeLineUp fail");

                        TipLayer.tip(data.msg);

                        cb(false);
                    }
                });

                return;
            }
        }
        cb(true);
    }
});


LineUp.create = function () {
    var ret = new LineUp();

    if (ret) {
        return ret;
    }

    return null;
};