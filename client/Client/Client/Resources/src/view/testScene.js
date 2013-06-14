/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-24
 * Time: 下午4:30
 * To change this template use File | Settings | File Templates.
 */

var testScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        cc.associateWithNative(this, cc.Scene);
    },

    onEnter: function () {
        this._super();

        var layer = new testLayer();
        layer.init();
        this.addChild(layer);
    },

    init: function () {

    }
})