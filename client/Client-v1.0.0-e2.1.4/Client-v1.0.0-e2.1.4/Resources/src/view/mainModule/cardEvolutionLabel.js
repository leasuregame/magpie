/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-13
 * Time: 下午4:54
 * To change this template use File | Settings | File Templates.
 */


/*
 * card evolution layer
 * */


var CardEvolutionLayer = cc.Layer.extend({
    onEnter: function () {
        cc.log("CardEvolutionLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("CardEvolutionLayer init");

        if (!this._super()) return false;

        return true;
    },

    update: function () {
        cc.log("CardEvolutionLayer update");


    }
})


CardEvolutionLayer.create = function () {
    var ret = new CardEvolutionLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}