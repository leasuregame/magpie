/**
 * Created by lujunyu on 14-5-4.
 */

var UPDATE_TOUCH_INTERVAL = 0.4;

var LzMenu = cc.Menu.extend({
    _selectedChild: null,
    _touchBeganPoint: null,

    onEnter: function () {
        cc.log("LzMenu onEnter");

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
     * @param {Object} e
     * @return {Boolean}
     */
    onTouchBegan: function (touch, e) {
        cc.log("LzMenu onTouchBegan");

        this._touchBeganPoint = touch.getLocation();

        this.schedule(this._activate, UPDATE_TOUCH_INTERVAL);

        if (lz.TARGET_PLATFORM_IS_BROWSER) {
            return this._super(touch, e);
        }
    },

    /**
     * when a touch ended
     */
    onTouchEnded: function (touch, e) {
        cc.log("LzMenu onTouchEnded");

        this._resetChildren();
        this.unschedule(this._activate);

        if (lz.TARGET_PLATFORM_IS_BROWSER) {
            return this._super(touch, e);
        }
    },

    /**
     * touch cancelled
     */
    onTouchCancelled: function (touch, e) {
        cc.log("LzMenu onTouchCancelled");

        this._resetChildren();
        this.unschedule(this._activate);

        if (lz.TARGET_PLATFORM_IS_BROWSER) {
            return this._super(touch, e);
        }
    },

    /**
     * touch moved
     * @param {cc.Touch} touch
     * @param {Object} e
     */
    onTouchMoved: function (touch, e) {
        cc.log("LzMenu onTouchMoved");

        if (this._touchBeganPoint) {
            var point = touch.getLocation();
            point = cc.p(point.x - this._touchBeganPoint.x, point.y - this._touchBeganPoint.y);
            var distance = point.x * point.x + point.y * point.y;

            if (distance < 400) {
                return;
            }
        }

        this._resetChildren();
        this.unschedule(this._activate);

        if (lz.TARGET_PLATFORM_IS_BROWSER) {
            return this._super(touch, e);
        }
    },

    _activate: function () {
        cc.log("LzMenu _activate");

        var children = this.getChildren();
        var len = children.length;

        for (var i = 0; i < len; ++i) {
            var child = children[i];

            if (child instanceof cc.MenuItem) {
                if (child.isSelected()) {

                    if (this._selectedChild && this._selectedChild != child) {
                        this._selectedChild = null;
                        break;
                    }

                    this._selectedChild = child;
                    child.activate();
                    return;
                }
            }
        }

        this.unschedule(this._activate);
    },

    _resetChildren: function () {
        cc.log("LzMenu _resetChildren");

        var children = this.getChildren();
        var len = children.length;

        for (var i = 0; i < len; ++i) {
            var child = children[i];
            if (child.isSelected()) {
                child.unselected();
            }
        }
    }
});

LzMenu.create = function (/*Multiple Arguments*/) {
    var ret = new LzMenu();

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