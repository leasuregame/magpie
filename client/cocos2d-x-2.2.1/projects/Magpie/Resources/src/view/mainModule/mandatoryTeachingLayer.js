/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-12-5
 * Time: 下午3:01
 * To change this template use File | Settings | File Templates.
 */

var teaching = [
    {
        overStep: 10,
        clickType: [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        effectOrder: [17, 20, 21, 11, 13, 22, 11, 13, 25, 29]
    },
    {
        overStep: 8,
        clickType: [1, 0, 0, 0, 0, 0, 1, 2],
        effectOrder: [18, 20, 24, 21, 11, 13, 30, 25]
    },
    {
        overStep: 6,
        clickType: [1, 0, 0, 0, 0, 2],
        effectOrder: [19, 23, 21, 11, 13, 25]
    },
    {
        overStep: 6,
        clickType: [1, 0, 0, 0, 0, 2],
        effectOrder: [26, 24, 27, 11, 13, 25]
    },
    {
        overStep: 4,
        clickType: [0, 0, 0, 1],
        effectOrder: [31, 32, 33, 34]
    }

];

var PROGRESS_NULL = -1;
var FIRST_FIGHT = 0;
var FIRST_TOURNAMENT = 1;
var FIRST_PASS_WIN = 2;
var FIRST_PASSIVE_SKILL_AFRESH = 3;
var FIRST_ACHIEVEMENT = 4;

var MANDATORY_TEACHING_LAYER_HANDLER_PRIORITY = -201;

var MandatoryTeachingLayer = LazyLayer.extend({
    _mandatoryTeachingLayerFit: null,

    _cb: null,
    _progress: 0,   //总的教学进度
    _step: 100,       //当前教学步骤
    _overStep: 0,    //结束教学步骤
    _clickType: [],
    _rectOrder: [],
    _effectPoints: [],
    _effectOrder: [],
    _effectNode: null,
    _rect: cc.rect(0, 0, 0, 0),    //点击有效区域
    _currentTeaching: null,

    init: function (args) {
        cc.log("MandatoryTeachingLayer init");

        if (!this._super()) return false;

        this._mandatoryTeachingLayerFit = gameFit.mainScene.mandatoryTeachingLayer;

        this.setTouchPriority(MANDATORY_TEACHING_LAYER_HANDLER_PRIORITY);

        var uid = gameData.player.get("uid");

        this._cb = args.cb;
        this._progress = args.progress;
        this._step = 0;
        this._overStep = teaching[this._progress].overStep;
        this._clickType = teaching[this._progress].clickType;
        this._effectOrder = teaching[this._progress].effectOrder;

        this._rectOrder = this._mandatoryTeachingLayerFit.rectOrders[this._progress];
        this._effectPoints = this._mandatoryTeachingLayerFit.effectPoints[this._progress];

        this._rect = cc.rect(0, 0, 0, 0);

        this._changeEffect(this._effectOrder[this._step]);

        return true;
    },

    next: function () {
        cc.log("MandatoryTeachingLayer next");

        if (this._step < this._overStep) {
            this._rect = cc.rect(0, 0, 0, 0);
            this._changeEffect(this._effectOrder[this._step]);
        } else {
            this.removeFromParent();
            mandatoryTeachingLayer = null;

            if (this._cb) {
                this._cb();
            }
        }
    },

    _clearEffect: function () {
        cc.log("MandatoryTeachingLayer _clearEffect");
        cc.log("清除特效");

        if (this._effectNode) {
            this._effectNode.removeFromParent();
            this._effectNode = null;
        }
    },

    clearAndSave: function () {
        cc.log("MandatoryTeachingLayer clearAndSave");

        this._rect = cc.rect(0, 0, 0, 0);
        this._clearEffect();
        this._step++;
    },

    _changeEffect: function (id) {
        var url = "tutorials" + id;

        if (main_scene_image[url]) {
            cc.log("加入特效");

            var node = cc.BuilderReader.load(main_scene_image[url], this);

            if (node != null) {
                node.setAnchorPoint(cc.p(0, 0));
                node.setPosition(this._effectPoints[this._step]);
                this.addChild(node);
                this._effectNode = node;
                if (this._clickType[this._rect] != CLICK_WAITING) {
                    this._rect = this._rectOrder[this._step];
                } else {
                    var that = this;
                    node.animationManager.setCompletedAnimationCallback(this, function () {
                        that._rect = that._rectOrder[that._step];
                    });
                }

            }
        } else {
            cc.log("特效" + url + "找不到,可能配置出错");
        }
    },

    isTeaching: function () {
        cc.log("MandatoryTeachingLayer isTeaching");

        return (this._step < this._overStep);
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchBegan: function (touch, event) {
        cc.log("MandatoryTeachingLayer onTouchBegan");
        cc.log(this._rect);
        if (this.isVisible()) {
            var point = touch.getLocation();
            cc.log(point);
            var isShield = !cc.rectContainsPoint(this._rect, point);
            if (this._clickType[this._step] == CLICK_ANY) {
                this.clearAndSave();
                this.next();
            }
            return isShield;
        } else {
            return false;
        }
    }
});

MandatoryTeachingLayer.create = function (args) {
    var ret = new MandatoryTeachingLayer();

    if (ret && ret.init(args)) {
        return ret;
    }

    return null;
};

MandatoryTeachingLayer.pop = function (args) {
    cc.log("MandatoryTeachingLayer pop");

    if (mandatoryTeachingLayer) {
        mandatoryTeachingLayer.removeFromParent();
        mandatoryTeachingLayer = null;
    }

    lz.scheduleOnce(function () {
        mandatoryTeachingLayer = MandatoryTeachingLayer.create(args);
        MainScene.getInstance().addChild(mandatoryTeachingLayer, 20);
    }, 0.1);
};


var mandatoryTeachingLayer = null;