/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-12-5
 * Time: 下午3:01
 * To change this template use File | Settings | File Templates.
 */


var teaching = [
    {
        overStep: 9,
        clickType: [1, 0, 0, 0, 0, 0, 0, 0, 0],
        effectOrder: [17, 20, 21, 11, 13, 22, 11, 13, 25],
        layerOrder: [1, 0, 4, 4, 4, 4, 4, 4, 4]
    },
    {
        overStep: 6,
        clickType: [1, 0, 0, 0, 0, 0],
        effectOrder: [18, 20, 24, 21, 11, 13],
        layerOrder: [2, 0, 4, 4, 4, 4]
    },
    {
        overStep: 6,
        clickType: [1, 0, 0, 0, 0, 0],
        effectOrder: [19, 23, 21, 11, 13, 25],
        layerOrder: [3, 0, 5, 5, 5, 5]
    },
    {
        overStep: 6,
        clickType: [1, 0, 0, 0, 0, 0],
        effectOrder: [26, 24, 27, 11, 13, 25],
        layerOrder: [0, 5, 5, 5, 5, 5]
    }

];

var PROGRESS_NULL = -1;
var FIRST_FIGHT = 0;
var FIRST_TOURNAMENT = 1;
var FIRST_PASS_WIN = 2;
var FIRST_PASSIVE_SKILL_AFRESH = 3;

var MANDATORY_TEACHING_LAYER_HANDLER_PRIORITY = -201;

var MandatoryTeachingLayer = LazyLayer.extend({
    _mandatoryTeachingLayerFit: null,

    _layer: [
        MainLayer,
        ExploreLayer,
        TournamentLayer,
        PassLayer,
        StrengthenLayer,
        EvolutionLayer
    ],

    _progress: 0,   //总的教学进度
    _step: 0,       //当前教学步骤
    _overStep: 0,    //结束教学步骤
    _layerOrder: [],
    _clickType: [],
    _rectOrder: [],
    _effectPoints: [],
    _effectOrder: [],
    _effectNode: null,
    _rect: cc.rect(0, 0, 0, 0),    //点击有效区域


    _currentTeaching: null,


    init: function (progress) {
        cc.log("MandatoryTeachingLayer init");

        if (!this._super()) return false;

        this._mandatoryTeachingLayerFit = gameFit.mainScene.mandatoryTeachingLayer;

        this.setTouchPriority(MANDATORY_TEACHING_LAYER_HANDLER_PRIORITY);

        var uid = gameData.player.get("uid");

        cc.log(progress);

        this._progress = progress;
        this._step = parseInt(sys.localStorage.getItem(uid + "MTprogress" + this._progress)) || 0;
        this._overStep = teaching[this._progress].overStep;
        this._clickType = teaching[this._progress].clickType;
        this._effectOrder = teaching[this._progress].effectOrder;
        this._layerOrder = teaching[this._progress].layerOrder;

        this._rectOrder = this._mandatoryTeachingLayerFit.rectOrders[this._progress];
        this._effectPoints = this._mandatoryTeachingLayerFit.effectPoints[this._progress];

        this._rect = cc.rect(0, 0, 0, 0);

        if (this.isTeaching()) {
            this._load();
            this._save();
        }

        return true;

    },

    _load: function () {
        cc.log("MandatoryTeachingLayer _load");
        cc.log(this._step);
        if (this._progress < 3) {
            if (this._step > 2) {
                this._step = 2;
            }
        } else {
            if (this._step > 1) {
                this._step = 1;
            }
        }

        var layer = this._layer[this._layerOrder[this._step]];

        cc.log("layer = " + layer);
        if (layer == ExploreLayer) {

            if (!(MainScene.getInstance().getLayer() instanceof ExploreLayer)) {
                MainScene.getInstance().switch(ExploreLayer.create(1));
            }

        } else {
            MainScene.getInstance().switchLayer(layer);
        }

        this._changeEffect(this._effectOrder[this._step]);

    },

    next: function () {
        cc.log("MandatoryTeachingLayer next");

        if (this._step < this._overStep) {
            this._rect = cc.rect(0, 0, 0, 0);
            this._changeEffect(this._effectOrder[this._step]);
        } else {
            this.removeFromParent();
            mandatoryTeachingLayer = null;
        }

    },

    _save: function () {
        cc.log("MandatoryTeachingLayer _save");

        var uid = gameData.player.get("uid");

        if (this._step >= this._overStep) {
            sys.localStorage.setItem(uid + "MTprogress", PROGRESS_NULL);
            sys.localStorage.setItem(uid + "MTprogress" + this._progress, this._overStep);
        } else {
            sys.localStorage.setItem(uid + "MTprogress", this._progress);
            sys.localStorage.setItem(uid + "MTprogress" + this._progress, this._step);
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
        this._save();
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
                if (this._clickType[this._rect] == 0) {
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

        if (this._step < this._overStep) {
            return true;
        }
        return false;
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
            var isShield = !cc.rectContainsPoint(this._rect, point);
            if (this._step == this._overStep - 1) {
                this.clearAndSave();
                this.next();
            }
            return isShield;
        } else {
            return false;
        }
    }
});

MandatoryTeachingLayer.create = function (progress) {
    var ret = new MandatoryTeachingLayer();

    if (ret && ret.init(progress)) {
        return ret;
    }

    return null;
};

MandatoryTeachingLayer.pop = function (progress) {
    cc.log("MandatoryTeachingLayer pop");
    if (mandatoryTeachingLayer) {
        mandatoryTeachingLayer.removeFromParent();
        mandatoryTeachingLayer = null;
    }

    lz.scheduleOnce(function () {
        mandatoryTeachingLayer = MandatoryTeachingLayer.create(progress);
        MainScene.getInstance().addChild(mandatoryTeachingLayer, 20);
    }, 0.1);
};

MandatoryTeachingLayer.teachingProgress = function () {
    cc.log("MandatoryTeachingLayer isNeedTeaching");

    var uid = gameData.player.get("uid");
    var progress = parseInt(sys.localStorage.getItem(uid + "MTprogress"));
    var step = parseInt(sys.localStorage.getItem(uid + "MTprogress" + progress));

    cc.log("progress = " + progress);
    cc.log("step = " + step);

    if (isNaN(progress) || isNaN(step) || progress == PROGRESS_NULL) {
        return PROGRESS_NULL;
    } else if (step < teaching[progress].overStep) {
        return progress;
    }

    return PROGRESS_NULL;
};


var mandatoryTeachingLayer = null;