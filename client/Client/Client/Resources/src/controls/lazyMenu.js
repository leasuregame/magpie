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


cc.LAZY_MENU_HANDLER_PRIORITY = 1;

var LazyMenu = cc.Menu.extend({
    _isScroll: false,

    registerWithTouchDispatcher: function () {
        cc.log("registerWithTouchDispatcher");

        cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, cc.LAZY_MENU_HANDLER_PRIORITY, true);
    },

    init: function () {
        cc.log("init");

        this._super();
    },

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

    /**
     * @param {cc.Touch} touch
     * @return {Boolean}
     */
    onTouchBegan: function (touch, e) {
        cc.log("LazyMenu onTouchBegan");
        this._isScroll = false;
        return this._super(touch, e);
    },

    /**
     * when a touch ended
     */
    onTouchEnded: function (touch, e) {
        cc.log("LazyMenu onTouchEnded");
        if (this._isScroll) {
            this.onTouchCancelled(touch, e);
        }
        else {
            this._super(touch, e);
        }
    },

    /**
     * touch moved
     * @param {cc.Touch} touch
     */
    onTouchMoved: function (touch, e) {
        cc.log("LazyMenu onTouchMoved");
        this._isScroll = true;
        this._super(touch, e);
    },

    /**
     * @param {cc.Touch} touch
     * @return {Boolean}
     */
    ccTouchBegan: function (touch, e) {
        cc.log("LazyMenu ccTouchBegan");
    },

    /**
     * when a touch ended
     */
    ccTouchEnded: function (touch, e) {
        cc.log("LazyMenu ccTouchEnded");
    },

    /**
     * touch moved
     * @param {cc.Touch} touch
     */
    ccTouchMoved: function (touch, e) {
        cc.log("LazyMenu ccTouchMoved");
    }
})


LazyMenu.create = function (/*Multiple Arguments*/) {
    var ret = new LazyMenu();

    if (arguments.length == 0) {
        ret.initWithItems(null, null);
    } else if (arguments.length == 1) {
        if (arguments[0] instanceof Array) {
            ret.initWithArray(arguments[0]);
            return ret;
        }
    }
    ret.initWithItems(arguments);
    return ret;
};