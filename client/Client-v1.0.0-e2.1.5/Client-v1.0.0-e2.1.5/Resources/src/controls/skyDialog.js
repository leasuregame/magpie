/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-13
 * Time: 下午5:08
 * To change this template use File | Settings | File Templates.
 */


/*
 * sky dialog
 * */


var TouchLayer = LazyLayer.extend({
    _touch: null,

    getTouchPoint: function () {
        cc.log("TouchLayer getTouchPoint");

        return this._touch;
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchBegan: function (touch, event) {
        cc.log("TouchLayer onTouchBegan");

        this._touch = touch.getLocation();

        return false;
    }
});


TouchLayer.create = function () {
    var ret = new TouchLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};


var SkyDialog = cc.Layer.extend({
    _touchLayer: null,
    _counter: 0,
    _label: null,
    _arrowSprite: null,
    _rect: cc.rect(40, 88, 640, 960),

    init: function (label) {
        cc.log("SkyDialog init");

        if (!this._super()) return false;

        this._touchLayer = TouchLayer.create();
        this.addChild(this._touchLayer);

        this.setTouchEnabled(true);

        this._arrowSprite = cc.Sprite.create(main_scene_image.icon215);
        this._arrowSprite.setAnchorPoint(cc.p(0, 0.5));
        this.addChild(this._arrowSprite, 1);

        this._counter = 0;
        this._label = label || null;

        this.setVisible();

        return true;
    },

    setLabel: function (label) {
        cc.log("SkyDialog label");

        if (label) {
            if (label != this._label) {
                this.addChild(label);

                if (this._label) {
                    this.removeChild(this._label);
                }

                this._label = label;
            }
        }
    },

    setRect: function (rect) {
        cc.log("SkyDialog setRect");

        this._rect = rect || this._rect;
    },

    show: function () {
        cc.log("SkyDialog show");

        this._counter += 1;
    },

    close: function () {
        cc.log("SkyDialog close");

        this._counter = Math.max(this._counter - 1, 0);
    },

    setVisible: function () {
        cc.log("SkyDialog setVisible");

        var visible = this._counter > 0;

        this._super(visible);

        return visible;
    },

    onTouchesEnded: function (touches, event) {
        cc.log("SkyDialog onTouchesEnded");

        if (this.setVisible()) {
            var point = this._touchLayer.getTouchPoint();

            if (point) {
                var size = this._label.getContentSize();

                var x = point.x + 30;
                var y = point.y;
                var y0 = size.height / 2;

                if (size.width + x > this._rect.x + this._rect.width) {
                    x = point.x - 25;
                    this._arrowSprite.setRotation(180);
                    this._label.setAnchorPoint(cc.p(1, 0.5));
                } else {
                    this._arrowSprite.setRotation(0);
                    this._label.setAnchorPoint(cc.p(0, 0.5));
                }

                if (y0 + y > this._rect.y + this._rect.height) {
                    y = this._rect.y + this._rect.height - y0;
                }

                if (y - y0 < this._rect.y) {
                    y = this._rect.y + y0;
                }

                this._arrowSprite.setPosition(point);
                this._label.setPosition(cc.p(x, y));
            }
        }

        this.close();
    }
});


SkyDialog.create = function (label) {
    var ret = new SkyDialog();

    if (ret && ret.init(label)) {
        return ret;
    }

    return null;
};