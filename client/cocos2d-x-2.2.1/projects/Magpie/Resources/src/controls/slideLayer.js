/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-12-25
 * Time: 下午3:21
 * To change this template use File | Settings | File Templates.
 */


var START_POINT = cc.p(1080, 0);
var DEF_SLIDE_TIME = 0.4;
var DEF_TIME_TICK = 0.05;

var SlideLayer = cc.Class.extend({
    _labels: [],
    _points: [],
    _slideTime: 0,
    _timeTick: 0,

    init: function (args) {
        cc.log("SlideLabel init");

        this._labels = args.labels;
        this._slideTime = args.slideTime || DEF_SLIDE_TIME;
        this._timeTick = args.timeTick || DEF_TIME_TICK;

        this._changePoint();

        return true;
    },

    _changePoint: function () {
        cc.log("SlideLabel _changePoint");

        var len = this._labels.length;
        for (var i = 0; i < len; i++) {
            var label = this._labels[i];

            label.stopAllActions();
            label.unscheduleAllCallbacks();

            var point = label.getPosition();
            this._points[i] = point;

            label.setPosition(cc.p(START_POINT.x, point.y));
        }
    },

    _playAction: function (index) {
        cc.log("SlideLabel _playAction");

        this._labels[index].setVisible(true);

        this._labels[index].runAction(cc.Sequence.create(
            cc.EaseExponentialOut.create(
                cc.MoveTo.create(this._slideTime, this._points[index])
            )
        ));
    },

    showSlide: function () {
        cc.log("SlideLabel showSlide");

        var that = this;
        var len = this._labels.length;
        for (var i = 0; i < len; i++) {
            (function (i) {
                that._labels[i].scheduleOnce(function () {
                    that._playAction(i);
                }, that._timeTick * i);
            })(i);
        }
    }
});

SlideLayer.create = function (args) {
    var ret = new SlideLayer();

    if (ret && ret.init(args)) {
        return ret;
    }

    return null;
};