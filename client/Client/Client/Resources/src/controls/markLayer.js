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


var MARK_LAYER_HANDLER_PRIORITY = 1;

var MarkLayer = cc.Layer.extend({
    _rect: null,

    init : function(rect) {
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

        cc.log(this.getPosition());
        cc.log(this._rect);
        cc.log(touch.getLocation());
        cc.log(this.convertToWorldSpace(cc.p(0, 0)));
        var rect = cc.rect(this.getPosition().x, this.getPosition().y, this._rect.width, this._rect.height);
        cc.log(rect);
        var point = this.convertToNodeSpace(touch.getLocation());
        cc.log(this.convertToNodeSpace(touch.getLocation()));
        cc.log(this.convertToWorldSpace(touch.getLocation()));
        cc.log(this.convertToNodeSpaceAR(touch.getLocation()));
        cc.log(this.convertToWorldSpaceAR(touch.getLocation()));
        cc.log(cc.rectContainsPoint(this._rect, point));
        if (cc.rectContainsPoint(rect, point)) {
            return false;
        }

        return true;
    }
})


MarkLayer.create = function(rect) {
    var ret = new MarkLayer();

    if(ret && ret.init(rect)) {
        return ret;
    }

    return null;
}