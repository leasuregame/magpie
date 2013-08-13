/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-13
 * Time: 下午5:00
 * To change this template use File | Settings | File Templates.
 */


/*
 * card train label
 * */


var CardTrainLabel = cc.Layer.extend({
    onEnter: function () {
        cc.log("CardTrainLabel onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("CardTrainLabel init");

        if (!this._super()) return false;

        return true;
    },

    update: function () {
        cc.log("CardTrainLabel update");


    }
})


CardTrainLabel.create = function () {
    var ret = new CardTrainLabel();

    if (ret && ret.init) {
        return ret;
    }

    return null;
}