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

var NOVICE_TEACHING_LAYER_HANDLER_PRIORITY = -201;
var OVER_NOVICE_STEP = 17;

var NoviceTeachingLayer = LazyLayer.extend({
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
    _rectOrder: [
        cc.rect(267, 407, 160, 160), cc.rect(180, 460, 360, 360), cc.rect(52, 802, 150, 150),
        cc.rect(293, 495, 134, 45), cc.rect(294, 106, 134, 45), cc.rect(57, 102, 106, 106),
        cc.rect(81, 576, 160, 60), cc.rect(165, 466, 134, 45), cc.rect(442, 466, 134, 45),
        cc.rect(57, 102, 106, 106), cc.rect(70, 758, 90, 90), cc.rect(596, 663, 43, 43),
        cc.rect(596, 795, 43, 43), cc.rect(538, 904, 124, 40), cc.rect(164, 102, 106, 106),
        cc.rect(124, 751, 145, 127), cc.rect(294, 348, 134, 45)
    ],
    _effectOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9, 6, 10, 11, 12, 13, 14, 15, 16],
    _effectNode: null,
    _step: 0,
    _rect: cc.rect(0, 0, 0, 0),

    init: function () {
        cc.log("NoviceTeachingLayer init");

        if (!this._super()) return false;
        this.setTouchPriority(NOVICE_TEACHING_LAYER_HANDLER_PRIORITY);
        this._step = sys.localStorage.getItem("step") || 0;
        this._rect = cc.rect(0, 0, 0, 0);
        if(this.isNoviceTeaching())
            this._load();
        else
            return false;
        return true;
    },

    _load: function () {
        cc.log("NoviceTeachingLayer _load");
        if(this._layerOrder[this._step] == 2) {
            MainScene.getInstance().switchLayer(SpiritPoolLayer);
            var spiritDetails = SpiritDetails.create();
            MainScene.getInstance().addChild(spiritDetails, 1);
        } else {
            if(this._layerOrder[this._step] == 4)
                this._step = 10;
            if(this._layerOrder[this._step] == 5)
                this._step = 15;
            MainScene.getInstance().switchLayer(this._layer[this._layerOrder[this._step]]);
        }
        this._changeEffect(this._effectOrder[this._step]);
    },

    _save: function () {
        cc.log("NoviceTeachingLayer _save");
        sys.localStorage.setItem("step",this._step);
    },

    next: function () {
        cc.log("NoviceTeachingLayer next");
        if(this._step < OVER_NOVICE_STEP) {
            this._rect = cc.rect(0, 0, 0, 0);
            this._changeEffect(this._effectOrder[this._step]);
        } else {
            this.removeFromParent();
        }
    },

    clearAndSave: function() {
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
                node.setAnchorPoint(cc.p(0,0));
                node.setPosition(cc.p(40, 88));
                this.addChild(node);
                this._effectNode = node;
                if(this._clickType[this._rect] == 0) {
                    this._rect = this._rectOrder[this._step];
                } else {
                    var that = this;
                    node.animationManager.setCompletedAnimationCallback(this,function(){
                        that._rect = that._rectOrder[that._step];
                    });
                }

            }
        } else {
            cc.log("特效" + url + "找不到,可能配置出错");
        }
    },

    _getStep: function() {
        cc.log("NoviceTeachingLayer getStep");
        cc.log(this._step);
        return this._step || 0;
    },

    isNoviceTeaching: function() {
        cc.log("NoviceTeachingLayer isNoviceTeaching");

        if(this._getStep() < OVER_NOVICE_STEP)
            return true;
        else {
            this.removeFromParent();
            return false;
        }
    },

    isNoviceTaught : function() {
        cc.log("NoviceTeachingLayer isNoviceTaught");
        if(this._getStep() == OVER_NOVICE_STEP)
            return true;
        var player = gameData.player;
        if(player.get('exp') == 0 && player.get('lv') == 1)
            return false;
        else
            return true;
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
        if (cc.rectContainsPoint(this._rect, point)) {
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

/*
 * 单例
 * */
(function () {
    var _noviceTeachingLayer = null;

    NoviceTeachingLayer.getInstance = function () {
        if (_noviceTeachingLayer == null) {
            _noviceTeachingLayer = new NoviceTeachingLayer();
            _noviceTeachingLayer.init();
        }

        return _noviceTeachingLayer;
    };

    NoviceTeachingLayer.destroy = function () {
        _noviceTeachingLayer = null;
    };
})();