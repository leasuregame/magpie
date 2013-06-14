/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-6
 * Time: 下午5:47
 * To change this template use File | Settings | File Templates.
 */


/*
* config scene
* */

var ConfigScene = cc.Scene.extend({
    onEnter : function() {
        var layer = ConfigLayer.create();
        this.addChild(layer);
    },

    init : function() {
        if(!this._super()) return false;

        return true;
    }
})


ConfigScene.create = function() {
    var ret = new ConfigScene();

    if(ret && ret.init()) {
        return ret;
    }

    return null;
}