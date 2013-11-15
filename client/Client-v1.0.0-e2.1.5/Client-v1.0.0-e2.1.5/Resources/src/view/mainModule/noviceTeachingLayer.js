/**
 * Created by lcc3536 on 13-11-4.
 */


/*
 * novice teaching layer
 * */

var NOVICE_TEACHING_LAYER_HANDLER_PRIORITY = -201;
var OVER_NOVICE_STEP = 17;

var NoviceTeachingLayer = LazyLayer.extend({
    _noviceTeachingLayerFit: null,

    _layer: [
        MainLayer,
        SpiritPoolLayer,
        SpiritDetails,
        LotteryLayer,
        CardListLayer,
        TaskLayer
    ],
    _layerOrder: [0, 1, 1, 2, 2, 1, 0, 3, 3, 3, 0, 4, 4, 4, 0, 5, 5],
    _clickType: [1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    _rectOrder: null,
    _effectPoints: null,
    _effectOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9, 6, 10, 11, 12, 13, 14, 15, 16],
    _effectNode: null,
    _step: 0,
    _rect: cc.rect(0, 0, 0, 0),

    init: function () {
        cc.log("NoviceTeachingLayer init");

        if (!this._super()) return false;

        this._noviceTeachingLayerFit = gameFit.mainScene.noviceTeachingLayer;

        this._rectOrder = this._noviceTeachingLayerFit.rectOrder;
        this._effectPoints = this._noviceTeachingLayerFit.effectPoints;

        this.setTouchPriority(NOVICE_TEACHING_LAYER_HANDLER_PRIORITY);

        this._step = sys.localStorage.getItem(gameData.user.get("account") + "step") || 0;
        cc.log("step = " + this._step);

        this._rect = cc.rect(0, 0, 0, 0);

        if (this.isNoviceTeaching()) {
            this._load();
        }

        return true;
    },

    _load: function () {
        cc.log("NoviceTeachingLayer _load");
        if (this._layerOrder[this._step] == 2) {
            MainScene.getInstance().switchLayer(SpiritPoolLayer);
            var spiritDetails = SpiritDetails.create();
            MainScene.getInstance().addChild(spiritDetails, 1);
        } else {
            if (this._layerOrder[this._step] == 4)
                this._step = 10;
            if (this._layerOrder[this._step] == 5)
                this._step = 15;
            MainScene.getInstance().switchLayer(this._layer[this._layerOrder[this._step]]);
        }
        this._changeEffect(this._effectOrder[this._step]);
    },

    _save: function () {
        cc.log("NoviceTeachingLayer _save");
        sys.localStorage.setItem(gameData.user.get("account") + "step", this._step);
    },

    next: function () {
        cc.log("NoviceTeachingLayer next");
        if (this._step < OVER_NOVICE_STEP) {
            this._rect = cc.rect(0, 0, 0, 0);
            this._changeEffect(this._effectOrder[this._step]);
        } else {
            this.removeFromParent();
        }
    },

    clearAndSave: function () {
        this._clearEffect();
        this._step++;
        this._save();
    },

    _clearEffect: function () {
        cc.log("清除特效");

        if (this._effectNode) {
            this._effectNode.removeFromParent();
            this._effectNode = null;
        }
    },

    _changeEffect: function (id) {
        var url = "tutorials" + id;

        if (main_scene_image[url]) {
            cc.log("加入特效");

            var node = cc.BuilderReader.load(main_scene_image[url], this);

            cc.log(node);
            cc.log(this);

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

    _getStep: function () {
        cc.log("NoviceTeachingLayer getStep");
        cc.log(this._step);
        return this._step || 0;
    },

    isNoviceTeaching: function () {
        cc.log("NoviceTeachingLayer isNoviceTeaching");
        var player = gameData.player;
        if (this._getStep() < OVER_NOVICE_STEP) {
            if (player.get("exp") == 0 && player.get("lv") == 1)
                return true;
        } else {
            return false;
        }
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchBegan: function (touch, event) {
        cc.log("NoviceTeachingLayer onTouchBegan");

        var point = touch.getLocation();
        cc.log(point);
        return !cc.rectContainsPoint(this._rect, point);
    }

});


NoviceTeachingLayer.create = function () {
    var ret = new NoviceTeachingLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};


/*
 * 单例
 * */
(function () {
    var _noviceTeachingLayer = null;

    NoviceTeachingLayer.getInstance = function () {
        if (_noviceTeachingLayer == null) {
            _noviceTeachingLayer = NoviceTeachingLayer.create();
        }

        return _noviceTeachingLayer;
    };

    NoviceTeachingLayer.destroy = function () {
        _noviceTeachingLayer = null;
    };
})();