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


var MAX_LINE_UP_SIZE = 6;
var SPIRIT_ID = -1;

var LineUp = Entity.extend({
    _lineUpList: null,

    init: function (data) {
        cc.log("LineUp init");

        this._lineUpList = [];

        this.update(data);

        this.off();
        this.on("lineUpChange", this._lineUpChangeEvent);

        return true;
    },

    update: function (data) {
        cc.log("LineUp update");

        var lineUpList = [];
        var maxLineUp = this.getMaxLineUp();

        for (var i = 0; i < maxLineUp; ++i) {
            var lineUp = (data ? data[i] : this._lineUpList[i].lineUp) || {};
            var count = this.getPerLineUpCount(i);

            lineUpList[i] = {
                lineUp: lineUp,
                count: count
            };
        }

        this.set("lineUpList", lineUpList);
    },

    _lineUpChangeEvent: function () {
        cc.log("LineUp _lineUpChangeEvent");

        gameData.player.checkAbility();
    },

    getLineUpCardList: function (index) {
        cc.log("LineUp getLineUpCardList: " + index);

        var lineUpCardList = [];
        var cardList = gameData.cardList;

        var lineUpList = this.getLineUpList(index);
        var len = lineUpList.length;

        for (var i = 0; i < len; ++i) {
            lineUpCardList.push(cardList.getCardByIndex(lineUpList[i]));
        }

        return lineUpCardList;
    },

    getLineUpList: function (index) {
        cc.log("LineUp getLineUpList");

        var lineUpList = [];

        if (index != undefined) {
            lineUp = this._lineUpList[index];

            for (j = 1; j < MAX_LINE_UP_SIZE; ++j) {
                if (lineUp[j] != undefined && lineUp[i] >= 0) {
                    lineUpList.push(lineUp[j]);
                }
            }
        } else {
            var maxLineUp = this.getMaxLineUp();

            for (i = 0; i < maxLineUp; ++i) {
                lineUp = this._lineUpList[i];

                for (j = 1; j < MAX_LINE_UP_SIZE; ++j) {
                    if (lineUp[j] != undefined && lineUp[i] >= 0) {
                        lineUpList.push(lineUp[j]);
                    }
                }
            }
        }

        return lineUpList;
    },

    getLineUpCard: function (index, key) {
        cc.log("LineUp getLineUpCard");
        cc.log(index);
        cc.log(key);

        return this._lineUpList[index][key];
    },

    isLineUpCard: function (index, cardId) {
        cc.log("LineUp isLineUpCard");

        for (var key in this._lineUp) {
            if (this._lineUp[key] == cardId) {
                return true;
            }
        }

        return false;
    },

    getMaxLineUp: function () {
        cc.log("LineUp getMaxLineUp");

        return 2;
    },

    getPerLineUpCount: function (index) {
        cc.log("LineUp getPerLineUpCount");

        return this._lineUpList[index].count;
    },

    changeLineUp: function (cb, data, index) {
        cc.log("LineUp changeLineUp");
        cc.log("lineUp: " + data);
        cc.log("index: " + index);

        var lineUp, i, j;

        var isChange = false;
        if (index != undefined) {
            lineUp = this._lineUpList[index];

            for (j = 1; j <= MAX_LINE_UP_SIZE; ++j) {
                if (data[j] != lineUp[j]) {
                    isChange = true;
                    break;
                }
            }
        } else {
            var maxLineUp = this.getMaxLineUp();

            for (i = 0; i < maxLineUp; ++i) {
                lineUp = this._lineUpList[i];

                for (j = 1; j <= MAX_LINE_UP_SIZE; ++j) {
                    if (data[i][j] != lineUp[j]) {
                        isChange = true;
                        break;
                    }
                }

                if (isChange) {
                    break;
                }
            }
        }

        if (!isChange) {
            cb(true);
            return;
        }

        var that = this;
        lz.server.request("area.trainHandler.changeLineUp", {
            lineUp: data,
            index: index
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
    }
});


LineUp.create = function () {
    var ret = new LineUp();

    if (ret) {
        return ret;
    }

    return null;
};