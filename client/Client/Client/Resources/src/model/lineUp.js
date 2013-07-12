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


var MAX_LINE_UP_CARD = 6;

var LineUp = Entity.extend({
    _lineUp: {},

    init: function (data) {
        var key;

        for(key in data) {
            this._lineUp[key] = data[key];
        }

        cc.log(this);

        return true;
    },

    getLineUpByIndex: function (index) {
        return this._lineUp[index];
    },

    setLineUpByIndex: function (index, cardId) {
        this._lineUp[index] = cardId;
    },

    syncLineUp: function () {

    }
})


LineUp.create = function () {
    var ret = new LineUp();

    if (ret) {
        return ret;
    }

    return null;
}