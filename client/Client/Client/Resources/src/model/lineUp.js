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

var LineUp = Entity.extend({
    _lineUp: {},
    _lineUpCount: 0,

    init: function (data) {
        cc.log("LineUp init");

        for(var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
            if(data[i]) {
                this._lineUpCount++;
                this._lineUp[i] = data[i];
            } else {
                this._lineUp[i] = null;
            }
        }

        cc.log(this);

        return true;
    },

    getLineUpByIndex: function (index) {
        cc.log("LineUp getLineUpByIndex");
        cc.log(index);

        return this._lineUp[index];
    },

    setLineUp: function(cardId) {
        cc.log("LineUp setLineUp");

        if(this._lineUpCount < MAX_LINE_UP_CARD) {
            for(var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
                if(this._lineUp[i] == null) {
                    this._lineUp[i] = cardId;
                    return true;
                }
            }
        }

        return false;
    },

    setLineUpByIndex: function (index, cardId) {
        cc.log("LineUp setLineUpByIndex");

        this._lineUp[index] = cardId;
    },

    syncLineUp: function () {
        cc.log("LineUp syncLineUp");
    }
})


LineUp.create = function () {
    var ret = new LineUp();

    if (ret) {
        return ret;
    }

    return null;
}