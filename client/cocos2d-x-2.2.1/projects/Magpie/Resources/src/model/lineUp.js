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
var MAX_LINE_UP_CARD = 5;
var SPIRIT_ID = -1;

var LineUp = Entity.extend({
    _lineUpList: null,
    _maxLineUp: 0,

    init: function (data) {
        cc.log("LineUp init");

        this._lineUpList = [];
        this._maxLineUp = Object.keys(outputTables.card_lineup_limit.rows).length;

        this.update(data);

        this.off();
        this.on("lineUpListChange", this._lineUpListChangeEvent);

        return true;
    },

    update: function (data) {
        cc.log("LineUp update");

        if (!data && !this._lineUpList) {
            return;
        }

        var lineUpList = [];
        var maxLineUp = this._maxLineUp;
        var lv = gameData.player.get("lv");

        cc.log(data);

        for (var i = 0; i < maxLineUp; ++i) {
            var lineUp;
            if (data) {
                lineUp = data[i];
            } else if (this._lineUpList[i]) {
                lineUp = this._lineUpList[i].lineUp;
            }

            var count = 0;
            var lineUpLimit = outputTables.card_lineup_limit.rows[i];
            for (var j = 1; j <= MAX_LINE_UP_CARD; ++j) {
                if (lv >= lineUpLimit["card_" + j]) {
                    count += 1;
                } else {
                    break;
                }
            }

            lineUpList[i] = {
                lineUp: lineUp || {6: -1},
                count: count
            };
        }

        this.set("lineUpList", lineUpList);
    },

    _lineUpListChangeEvent: function () {
        cc.log("LineUp _lineUpListChangeEvent");

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
        var lineUp, i, j;

        if (index != undefined) {
            lineUp = this._lineUpList[index].lineUp;

            for (j = 1; j <= MAX_LINE_UP_SIZE; ++j) {
                if (lineUp[j] != undefined && lineUp[j] >= 0) {
                    lineUpList.push(lineUp[j]);
                }
            }
        } else {
            var maxLineUp = this._maxLineUp;

            for (i = 0; i < maxLineUp; ++i) {
                lineUp = this._lineUpList[i].lineUp;

                for (j = 1; j <= MAX_LINE_UP_SIZE; ++j) {
                    if (lineUp[j] != undefined && lineUp[j] >= 0) {
                        lineUpList.push(lineUp[j]);
                    }
                }
            }
        }

        return lineUpList;
    },

    getLineUp: function (index) {
        cc.log("LineUp getLineUp");

        return this._lineUpList[index].lineUp;
    },

    getLineUpCard: function (index, key) {
        cc.log("LineUp getLineUpCard");
        cc.log(index);
        cc.log(key);

        return (this._lineUpList[index].lineUp)[key];
    },

    getCardOfLineUp: function (cardId) {
        cc.log("LineUp getCardOfLineUp");

        var maxLineUp = this._maxLineUp;

        for (var i = 0; i < maxLineUp; ++i) {
            var lineUp = this._lineUpList[i].lineUp;

            cc.log(lineUp);

            for (var key in lineUp) {
                if (lineUp[key] == cardId) {
                    return i;
                }
            }
        }

        return undefined;
    },

    getPerLineUpCount: function (index) {
        cc.log("LineUp getPerLineUpCount");

        return this._lineUpList[index].count;
    },

    changeLineUp: function (cb, data, index) {
        cc.log("LineUp changeLineUp");
        cc.log("lineUp: ");
        cc.log(data);
        cc.log("index: " + index);

        var lineUp, i, j;

        var isChange = false;
        if (index != undefined) {
            lineUp = this._lineUpList[index].lineUp;

            for (j = 1; j <= MAX_LINE_UP_SIZE; ++j) {
                if (data[j] != lineUp[j]) {
                    isChange = true;
                    break;
                }
            }
        } else {
            var maxLineUp = this._maxLineUp;

            for (i = 0; i < maxLineUp; ++i) {
                lineUp = this._lineUpList[i].lineUp;

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