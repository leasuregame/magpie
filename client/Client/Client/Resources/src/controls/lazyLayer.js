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


cc.LAZY_LAYER_HANDLER_PRIORITY = -1000;

var LazyLayer = cc.Layer.extend({
    init: function () {
        if (!this._super()) return false;

        this.setTouchMode(cc.TOUCHES_ONE_BY_ONE);
        this.setTouchPriority(cc.LAZY_LAYER_HANDLER_PRIORITY);
        this.setTouchEnabled(true);

        return true;
    },

    _show: function () {
        this.setVisible(true);
    },

    _hide: function () {
        this.setVisible(false);
    },

    /**
     * default implements are used to call script callback if exist<br/>
     * you must override these touch functions if you wish to utilize them
     * @param {cc.Touch} touch
     * @param {event} event
     * @return {Boolean}
     */
    onTouchBegan: function (touch, event) {
        cc.log("LazyLayer onTouchBegan");
        return true;
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchMoved: function (touch, event) {
        cc.log("LazyLayer onTouchMoved")
    },

    /**
     * callback when a touch event finished
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchEnded: function (touch, event) {
        cc.log("LazyLayer onTouchEnded")
    },

    /**
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchCancelled: function (touch, event) {
        cc.log("LazyLayer onTouchCancelled");
    }
})


LazyLayer.create = function() {
    var ret = new LazyLayer();

    if(ret && ret.init()) {
        return ret;
    }

    return null;
}