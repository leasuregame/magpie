/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-22
 * Time: 下午3:54
 * To change this template use File | Settings | File Templates.
 */


/*
 * 不可点击层，屏蔽所有点击
 * */


var LAZY_LAYER_HANDLER_PRIORITY = -128;

var LazyLayer = cc.Layer.extend({
    init: function () {
        cc.log("LazyLayer init");

        if (!this._super()) return false;

        this.setTouchMode(cc.TOUCHES_ONE_BY_ONE);
        this.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY);
        this.setTouchEnabled(true);

        return true;
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchBegan: function (touch, event) {
        cc.log("LazyLayer onTouchBegan");

        if (this.isVisible()) {
            return true;
        }

        return false;
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchMoved: function (touch, event) {
        cc.log("LazyLayer onTouchMoved");
    },

    /**
     * callback when a touch event finished
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchEnded: function (touch, event) {
        cc.log("LazyLayer onTouchEnded");
    },

    /**
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchCancelled: function (touch, event) {
        cc.log("LazyLayer onTouchCancelled");
    }
});


(function () {
    var cloudLayer = null;

    LazyLayer.showCloudLayer = function () {
        if (cloudLayer == null) {
            cloudLayer = LazyLayer.create();
            cloudLayer.retain();
        }

        cc.Director.getInstance().getRunningScene().addChild(cloudLayer);
    };

    LazyLayer.closeCloudLayer = function () {
        if (cloudLayer) {
            cloudLayer.removeFromParent();
        }
    };
})();

LazyLayer.create = function () {
    var ret = new LazyLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};