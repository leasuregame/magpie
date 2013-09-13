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


var SkyDialogLayer = LazyLayer.extend({
    _touch: null,

    getTouchPoint: function () {
        cc.log("LazyLayer getTouchPoint");

        return this._touch;
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchBegan: function (touch, event) {
        cc.log("SkyDialogLayer onTouchBegan");

        this._touch = touch.getLocation();

        return false;
    }
});


SkyDialogLayer.create = function () {
    var ret = new SkyDialogLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};


var SkyDialog = cc.Layer.extend({
    _skyDialogLayer: null,
    _counter: 0,
    _label: null,

    init: function (label) {
        cc.log("SkyDialog init");

        if (!this._super()) return false;

        this._skyDialogLayer = SkyDialogLayer.create();
        this.addChild(this._skyDialogLayer);

        this.setTouchEnabled(true);

        this._counter = 0;
        this._label = label || null;

        this.setVisible();

        return true;
    },

    setLabel: function (label) {
        cc.log("SkyDialog label");

        if (label) {
            if (label != this._label) {
                this._label = label;
            }
        }
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
            cc.log(this._skyDialogLayer.getTouchPoint());
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