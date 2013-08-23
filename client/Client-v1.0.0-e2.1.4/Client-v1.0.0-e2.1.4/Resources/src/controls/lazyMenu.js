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


var LAZY_MENU_HANDLER_PRIORITY = 3;

var LazyMenu = cc.Menu.extend({
    _touchBeganPoint: null,
    _isScroll: false,

    /**
     * initializes a cc.Menu with it's items
     * @param {Array} args
     * @return {Boolean}
     */
    initWithItems: function (args) {
        var pArray = [];
        if (args) {
            for (var i = 0; i < args.length; i++) {
                if (args[i]) {
                    pArray.push(args[i]);
                }
            }
        }

        return this.initWithArray(pArray);
    },

    initWithArray: function (arrayOfItems) {
        cc.log("LazyMenu initWithArray");

        if (!this._super(arrayOfItems))  return false;

        this.setTouchMode(cc.TOUCHES_ONE_BY_ONE);
        this.setTouchPriority(LAZY_MENU_HANDLER_PRIORITY);
        this.setTouchEnabled(true);

        return true;
    },

    registerWithTouchDispatcher: function () {
        cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, LAZY_MENU_HANDLER_PRIORITY, true);
    },

    /**
     * @param {cc.Touch} touch
     * @return {Boolean}
     */
    onTouchBegan: function (touch, e) {
        cc.log("LazyMenu onTouchBegan");

        this._touchBeganPoint = touch.getLocation();
        this._isScroll = false;

        if (SETTING_IS_BROWSER) {
            return this._super(touch, e);
        }
    },

    /**
     * when a touch ended
     */
    onTouchEnded: function (touch, e) {
        cc.log("LazyMenu onTouchEnded");

        if (this._isScroll) {
            if (SETTING_IS_BROWSER) {
                this.onTouchCancelled(touch, e);
            } else {
                return true;
            }
        }
        else {
            if (SETTING_IS_BROWSER) {
                this._super(touch, e);
            }
        }

        this._touchBeganPoint = null;
        this._isScroll = false;
    },

    /**
     * touch moved
     * @param {cc.Touch} touch
     */
    onTouchMoved: function (touch, e) {
        cc.log("LazyMenu onTouchMoved");

        if (this._touchBeganPoint) {
            var point = touch.getLocation();
            point = cc.p(point.x - this._touchBeganPoint.x, point.y - this._touchBeganPoint.y);
            var distance = point.x * point.x + point.y * point.y;

            if (distance > 100) {
                this._isScroll = true;
            }
        }

        if (SETTING_IS_BROWSER) {
            this._super(touch, e);
        }
    }
})


LazyMenu.create = function (/*Multiple Arguments*/) {
    var ret = new LazyMenu();

    if (arguments.length == 0) {
        ret.initWithItems(null, null);
        return ret;
    } else if (arguments.length == 1) {
        if (arguments[0] instanceof Array) {
            ret.initWithArray(arguments[0]);
            return ret;
        }
    }

    ret.initWithItems(arguments);

    return ret;
};