/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-27
 * Time: 下午5:47
 * To change this template use File | Settings | File Templates.
 */


/*
 * shy layer
 *
 * 接受一个回调函数，触摸时执行
 * 默认为在其父节点删除该层
 * */


var ShyLayer = LazyLayer.extend({
    _cb: null,

    init: function (cb) {
        cc.log("ShyLayer init");

        if (!this._super()) return false;

        this._cb = cb || function () {
            this.removeFromParent();
        };

        return true;
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchBegan: function (touch, event) {
        cc.log("ShyLayer onTouchBegan");

        this._cb();

        return true;
    }
});


ShyLayer.create = function (cb) {
    var ret = new ShyLayer();

    if (ret && ret.init(cb)) {
        return ret;
    }

    return null;
}