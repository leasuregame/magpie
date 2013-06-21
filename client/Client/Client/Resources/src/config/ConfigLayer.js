/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-6
 * Time: 下午5:50
 * To change this template use File | Settings | File Templates.
 */


/*
* cofnig layer
* */

var ConfigLayer = cc.Layer.extend({
    init : function() {
        if(!this._super()) return false;

        var label = cc.LabelTTF.create("xx");
        this.addChild(label);

        return true;
    }
})


ConfigLayer.create = function() {
    var ret = new ConfigLayer();

    if(ret && ret.init()) {
        return ret;
    }

    return null;
}
