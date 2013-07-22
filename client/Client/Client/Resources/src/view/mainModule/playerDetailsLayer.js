/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-15
 * Time: 下午3:09
 * To change this template use File | Settings | File Templates.
 */


/*
* player details layer
* */


var PlayerDetailsLayer = LazyLayer.extend({
    init: function() {
        cc.log("PlayerDetailsLayer init");

        if(!this._super()) return false;



        return true;
    }
})


PlayerDetailsLayer.create = function() {
    var ret = new PlayerDetailsLayer();

    if(ret && ret.init()) {
        return ret;
    }

    return null;
}