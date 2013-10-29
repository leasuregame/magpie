/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-10-29
 * Time: 上午9:59
 * To change this template use File | Settings | File Templates.
 */


/*
 * novice teaching layer
 * */


var NoviceTeachingLayer = LazyLayer.extend({
    _step: 0,
    _rect: cc.rect(0, 0, 0, 0),
    _teachingLayer: null,
    _noviceTeachingStep: [
        {
            callback: function () {
                MainScene.getInstance().switchLayer(MainLayer);
            },
            fn: function () {
                var ccb = "";
            }
        },
        {

        }
    ],

    init: function () {
        cc.log("NoviceTeachingLayer init");

        if (!this._super()) return false;

        this._load();

        return true;
    },

    _load: function () {
        cc.log("NoviceTeachingLayer _load");


    },

    _loadCCB: function () {

    },

    _save: function () {
        cc.log("NoviceTeachingLayer _save");
    },

    next: function () {
        cc.log("NoviceTeachingLayer next");

    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchBegan: function (touch, event) {
        cc.log("LazyLayer onTouchBegan");

        var point = touch.getLocation();

        if (cc.rectContainsPoint(this._rect, point)) {
            this.next();
            return false;
        }

        return true;
    }
});


NoviceTeachingLayer.create = function () {
    var ret = new NoviceTeachingLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};


NoviceTeachingLayer.pop = function () {

};