/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-3
 * Time: 下午4:40
 * To change this template use File | Settings | File Templates.
 */


/*
* lazy menu
* 优先级比Layer低的Menu
* 用在滑动列表和滑动面板
* 优先处理滑动事件
* 然后再处理点击事件
* */


cc.LAZY_MENU_HANDLER_PRIORITY  = 1;

var LazyMenu = cc.Menu.extend({
    registerWithTouchDispatcher:function () {
        cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, cc.LAZY_MENU_HANDLER_PRIORITY, true);
    },

    /**
     * @param {cc.Touch} touch
     * @return {Boolean}
     */
    onTouchBegan:function (touch, e) {
        if (this._state != cc.MENU_STATE_WAITING || !this._visible || !this._enabled) {
            return false;
        }

        for (var c = this._parent; c != null; c = c.getParent()) {
            if (!c.isVisible()) {
                return false;
            }
        }

        this._selectedItem = this._itemForTouch(touch);
        if (this._selectedItem) {
            this._state = cc.MENU_STATE_TRACKING_TOUCH;
            this._selectedItem.selected();
            return true;
        }
        return false;
    },

    /**
     * when a touch ended
     */
    onTouchEnded:function (touch, e) {
        cc.Assert(this._state == cc.MENU_STATE_TRACKING_TOUCH, "[Menu onTouchEnded] -- invalid state");
        if (this._selectedItem) {
            this._selectedItem.unselected();
            this._selectedItem.activate();
        }
        this._state = cc.MENU_STATE_WAITING;
    },

    /**
     * touch cancelled
     */
    onTouchCancelled:function (touch, e) {
        cc.Assert(this._state == cc.MENU_STATE_TRACKING_TOUCH, "[Menu onTouchCancelled] -- invalid state");
        if (this._selectedItem) {
            this._selectedItem.unselected();
        }
        this._state = cc.MENU_STATE_WAITING;
    },

    /**
     * touch moved
     * @param {cc.Touch} touch
     */
    onTouchMoved:function (touch, e) {
        cc.Assert(this._state == cc.MENU_STATE_TRACKING_TOUCH, "[Menu onTouchMoved] -- invalid state");
        var currentItem = this._itemForTouch(touch);
        if (currentItem != this._selectedItem) {
            if (this._selectedItem) {
                this._selectedItem.unselected();
            }
            this._selectedItem = currentItem;
            if (this._selectedItem) {
                this._selectedItem.selected();
            }
        }
    }
})