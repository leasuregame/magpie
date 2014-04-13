/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-31
 * Time: 上午11:55
 * To change this template use File | Settings | File Templates.
 */


/*
 * mark layer
 * */


var MARK_LAYER_HANDLER_PRIORITY = 2;

var MarkLayer = cc.Layer.extend({
    _rect: null,

    init: function (rect) {
        cc.log("MarkLayer init");

        if (!this._super()) return false;

        this.setTouchMode(cc.TOUCHES_ONE_BY_ONE);
        this.setTouchPriority(MARK_LAYER_HANDLER_PRIORITY);
        this.setTouchEnabled(true);

        this._rect = rect || cc.rect(0, 0, 0, 0);

        return true;
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchBegan: function (touch, event) {
        cc.log("MarkLayer onTouchBegan");

        var node = this;
        var mainScene = MainScene.getInstance();

        while (node && node != mainScene) {
            if (!node.isVisible()) {
                return false;
            }

            node = node.getParent();
        }

        var point = this.getParent().convertToWorldSpace(cc.p(this._rect.x, this._rect.y));
        var rect = cc.rect(point.x, point.y, this._rect.width, this._rect.height);

        return (!cc.rectContainsPoint(rect, touch.getLocation()));
    }
});


MarkLayer.create = function (rect) {
    var ret = new MarkLayer();

    if (ret && ret.init(rect)) {
        return ret;
    }

    return null;
};