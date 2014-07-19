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
var LINE_UP_INDEX = 0;

var LineUp = Entity.extend({
    _lineUpList: null,
    _oldLineUpList: null,
    _maxLineUp: 0,

    init: function (data) {
        cc.log("LineUp init");

        LINE_UP_INDEX = 0;
        this._lineUpList = [];
        this._oldLineUpList = [];
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

        this.activateCardsGroupSkill();
    },

    updateCardsAbility: function (cards) {
        cc.log("LineUp updateCardsAbility");

        var len = cards.length;
        for (var i = 0; i < len; i++) {
            var c = cards[i];
            var card = gameData.cardList.getCardByIndex(c[0]);
            card.set("ability", c[1]);
        }
    },

    _lineUpListChangeEvent: function () {
        cc.log("LineUp _lineUpListChangeEvent");

        this.activateCardsGroupSkill();
        this.unActivateCardsGroupSkill();
        gameData.player.checkAbility();
    },

    activateCardsGroupSkill: function () {
        cc.log("LineUp activateCardsGroupSkill");

        var filter5star = function (data) {   //筛选5星以上卡牌
            var arr = [];
            var len = data.length;
            for (var i = 0; i < len; i++) {
                var card = data[i];
                if (card.get("star") >= 5) {
                    arr.push(card);
                }
            }
            return arr;
        };

        var kinds = function (data) {  //获取卡牌系列id
            var arr = [];
            var len = data.length;
            for (var i = 0; i < len; i++) {
                var card = data[i];
                arr.push(card.get("kind"));
            }
            return arr;
        };

        var mapping = function (arr1, arr2) {   //匹配组合技能
            arr1.sort(function (a, b) {
                return a - b;
            });
            arr2.sort(function (a, b) {
                return a - b;
            });
            var len1 = arr1.length;
            var len2 = arr2.length;
            var i = 0, j = 0;
            var m = 0; //匹配数量

            while (i < len1 && j < len2) {
                if (arr1[i] == arr2[j]) {
                    i++;
                    j++;
                    m++;
                } else if (arr1[i] < arr2[j]) {
                    i++;
                } else {
                    j++;
                }
            }

            return m == len1;
        };

        var len = this._lineUpList.length;
        for (var i = 0; i < len; i++) {
            var lineUpList = filter5star(this.getLineUpCardList(i));
            var k = kinds(lineUpList);
            var len2 = lineUpList.length;
            for (var j = 0; j < len2; j++) {
                var card = lineUpList[j];
                var groupSkills = card.get("groupSkills");
                var gsLen = groupSkills.length;

                if (!gsLen) continue;   //没有组合技能

                for (var index = 0; index < gsLen; index++) {
                    cc.log(groupSkills[index].group);

                    if (mapping(groupSkills[index].group, k)) {
                        if (!groupSkills[index].isActive) {  //组合技能未激活
                            card.activateGroupSkill(index);
                        }
                    } else {
                        if (groupSkills[index].isActive) {  //组合技能已失效
                            card.unActivateGroupSkill(index);
                        }
                    }
                }

            }
        }
    },

    unActivateCardsGroupSkill: function () {
        cc.log("LineUp unActivateCardsGroupSkill");

        var len = this._oldLineUpList.length;
        for (var i = 0; i < len; i++) {
            var oldList = this.getLineUpCardList(i, this._oldLineUpList);
            var list = this.getLineUpList(i);
            var len2 = oldList.length;
            var len3 = list.length;

            for (var j = 0; j < len2; j++) {
                var card = oldList[j];
                for (var k = 0; k < len3; k++) {
                    if (card.get("id") == list[k]) break;
                    else if (k == len3 - 1) {
                        card.unAllActivateGroupSkill();
                    }
                }
            }
        }
    },

    getLineUpCardList: function (index, list) {
        cc.log("LineUp getLineUpCardList: " + index);

        var lineUpCardList = [];
        var cardList = gameData.cardList;

        var lineUpList = this.getLineUpList(index, list);
        var len = lineUpList.length;

        for (var i = 0; i < len; ++i) {
            lineUpCardList.push(cardList.getCardByIndex(lineUpList[i]));
        }

        return lineUpCardList;
    },

    getLineUpList: function (index, list) {
        cc.log("LineUp getLineUpList");

        list = list || this._lineUpList;

        var lineUpList = [];
        var lineUp, i, j;

        if (index != undefined) {
            lineUp = list[index].lineUp;

            for (j = 1; j <= MAX_LINE_UP_SIZE; ++j) {
                if (lineUp[j] != undefined && lineUp[j] >= 0) {
                    lineUpList.push(lineUp[j]);
                }
            }
        } else {
            var maxLineUp = this._maxLineUp;

            for (i = 0; i < maxLineUp; ++i) {
                lineUp = list[i].lineUp;

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

        this._oldLineUpList = this._lineUpList;

        var that = this;
        lz.server.request("area.trainHandler.changeLineUp", {
            lineUp: data,
            index: index
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("changeLineUp success");

                var msg = data.msg;

                that.updateCardsAbility(msg.changedCards);
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