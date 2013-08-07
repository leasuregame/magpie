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
    _canClick: true,
    _touchedMenu: false,
    _menu: null,

    init: function () {
        if (!this._super()) return false;

        this.setTouchMode(cc.TOUCHES_ONE_BY_ONE);
        this.setTouchPriority(cc.LAZY_LAYER_HANDLER_PRIORITY);
        this.setTouchEnabled(true);

        this._menu = cc.Menu.create();
        this._menu.setPosition(cc.p(0, 0));
        this.addChild(this._menu, 1);

        return true;
    },

    addMenuItem: function (menuItem) {
        this._menu.addChild(menuItem);
    },

    setCanClick: function (canClick) {
        this._canClick = canClick;
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchBegan: function (touch, event) {
        cc.log("LazyLayer onTouchBegan");

        if (this._canClick) {
            this._touchedMenu = this._menu.onTouchBegan(touch, event);
        }

        return true;
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchMoved: function (touch, event) {
        cc.log("LazyLayer onTouchMoved");


        if (this._canClick && this._touchedMenu) {
            this._menu.onTouchMoved(touch, event);
        }
    },

    /**
     * callback when a touch event finished
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchEnded: function (touch, event) {
        cc.log("LazyLayer onTouchEnded");

        if (this._canClick && this._touchedMenu) {
            this._menu.onTouchEnded(touch, event);
            this._touchedMenu = false;
        }
    },

    /**
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchCancelled: function (touch, event) {
        cc.log("LazyLayer onTouchCancelled");

        if (this._canClick && this._touchedMenu) {
            this._menu.onTouchEnded(touch, event);
            this._touchedMenu = false;
        }
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
}