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


var MAX_LINE_UP_CARD = 5;
var MAX_LINE_UP_SIZE = 6;
var SPIRIT_ID = -1;

var LineUp = Entity.extend({
    _lineUp: {},
    _lineUpCount: 0,

    init: function (data) {
        cc.log("LineUp init");

        this.update(data);

        cc.log(this);

        return true;
    },

    update: function (data) {
        cc.log("LineUp update");

        this._lineUp = {};
        for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
            if (data[i] !== undefined) {
                this._lineUpCount++;
                this._lineUp[i] = data[i];
            }
        }
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

        return (this._lineUp[index] ? this._lineUp[index] : null);
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
            cc.log(i);
            if (this._lineUp[i] != lineUp[i]) {
                cc.log(i);
                var that = this;

                lzWindow.pomelo.request("area.trainHandler.changeLineUp", {
                    lineUp: lineUp
                }, function (data) {
                    cc.log(data);

                    if (data.code == 200) {
                        cc.log("changeLineUp success");

                        var msg = data.msg;

                        that.update(msg.lineUp);

                        cb("success");
                    } else {
                        cc.log("changeLineUp fail");

                        cb("fail");
                    }
                });

                return;
            }
        }
        cb();
    }
});


LineUp.create = function () {
    var ret = new LineUp();

    if (ret) {
        return ret;
    }

    return null;
};