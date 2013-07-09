/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-24
 * Time: 下午4:30
 * To change this template use File | Settings | File Templates.
 */

var testScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        var layer = new TesttestLayer();
        layer.init();
        this.addChild(layer);
    },

    init: function () {

    }
})