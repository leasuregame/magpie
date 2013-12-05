/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-12-5
 * Time: 下午3:01
 * To change this template use File | Settings | File Templates.
 */

var teaching = [

    {
        overStep: 0,
        clickType: [],
        effectOrder: []
    },
    {
        overStep: 0,
        clickType: [],
        effectOrder: []
    },
    {
        overStep: 0,
        clickType: [],
        effectOrder: []
    },
    {
        overStep: 0,
        clickType: [],
        effectOrder: []
    }

];


var MANDATORY_TEACHING_LAYER_HANDLER_PRIORITY = -201;

var MandatoryTeachingLayer = LazyLayer.extend({

    _progress: 0,   //总的教学进度
    _step: 0,       //当前教学步骤
    _overStep: 0,    //结束教学步骤
    _layerOrder: [],
    _clickType: [],
    _rectOrder: null,
    _effectPoints: null,
    _effectOrder: [],
    _effectNode: null,
    _rect: cc.rect(0, 0, 0, 0),    //点击有效区域


    _currentTeaching: null,


    init: function () {
        cc.log("MandatoryTeachingLayer init");

        if (!this._super()) return false;

        this.setTouchPriority(MANDATORY_TEACHING_LAYER_HANDLER_PRIORITY);

        var uid = gameData.player.get("uid");

        this._progress = parseInt(sys.localStorage.getItem(uid + "MTprogress")) || 0;
        this._step = parseInt(sys.localStorage.getItem(uid + "MTprogress" + this._progress)) || 0;
        this._overStep = teaching[this._progress].overStep;
        this._clickType = teaching[this._progress].clickType;
        this._effectOrder = teaching[this._progress].effectOrder;
        this._rect = cc.rect(0, 0, 0, 0);

        if(this.isTeaching()) {
            this._load();
        }

        return true;

    },

    _load: function () {
        cc.log("MandatoryTeachingLayer _load");

        this._changeEffect(this._effectOrder[this._step]);

    },

    next: function () {
        cc.log("MandatoryTeachingLayer next");

        if (this._step < this._overStep) {
            this._rect = cc.rect(0, 0, 0, 0);
            this._changeEffect(this._effectOrder[this._step]);
        } else {
            this.removeFromParent();
        }

    },

    _save: function () {
        cc.log("MandatoryTeachingLayer _save");

        var uid = gameData.player.get("uid");

        if(this._step >= this._overStep) {
            sys.localStorage.setItem(uid + "MTprogress", this._progress + 1);
            sys.localStorage.setItem(uid + "MTprogress" + this._progress, this._overStep);
        } else {
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

    clearAndSave: function() {
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

        if(this._step < this._overStep) {
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

        if (this.isVisible()) {
            var point = touch.getLocation();
            return !cc.rectContainsPoint(this._rect, point);
        } else {
            return false;
        }
    }
});

MandatoryTeachingLayer.create = function () {
    var ret = new MandatoryTeachingLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};

MandatoryTeachingLayer.pop = function () {
    cc.log("MandatoryTeachingLayer pop");
    if(mandatoryTeachingLayer) {
        MandatoryTeachingLayer.remove();
    }
    mandatoryTeachingLayer = MandatoryTeachingLayer.create();
    MainScene.getInstance().addChild(mandatoryTeachingLayer, 20);
};

MandatoryTeachingLayer.remove = function() {
    cc.log("MandatoryTeachingLayer remove");
    if(mandatoryTeachingLayer) {
        mandatoryTeachingLayer.removeFromParent();
        mandatoryTeachingLayer = null;
    }
};

var mandatoryTeachingLayer = null;