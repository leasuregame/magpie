/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:54
 * To change this template use File | Settings | File Templates.
 */


/*
 * 竞技
 * */


var TournamentLayer = cc.Layer.extend({
    init: function () {
        cc.log("Tournament init");

        if (!this._super()) return false;

        return true;
    }
})

TournamentLayer.create = function () {
    var res = new TournamentLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
}