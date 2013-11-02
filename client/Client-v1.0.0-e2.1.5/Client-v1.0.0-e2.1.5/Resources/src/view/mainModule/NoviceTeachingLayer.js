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
    _layer: [
        MainLayer,
        SpiritPoolLayer,
        SpiritDetails,
        LotteryLayer,
        CardListLayer,
        TaskLayer
    ],
    _layerOrder: [0, 1, 1, 2, 2, 1, 0, 3, 3, 3, 0, 4, 4, 4, 0, 5, 5],
    _rectOrder: [
        cc.rect(267, 407, 186, 186), cc.rect(180, 460, 360, 360), cc.rect(52, 802, 150, 150),
        cc.rect(0, 0, 0, 0), cc.rect(0, 0, 0, 0), cc.rect(0, 0, 0, 0),
        cc.rect(0, 0, 0, 0), cc.rect(0, 0, 0, 0), cc.rect(0, 0, 0, 0),
        cc.rect(0, 0, 0, 0), cc.rect(0, 0, 0, 0), cc.rect(0, 0, 0, 0),
        cc.rect(0, 0, 0, 0), cc.rect(0, 0, 0, 0), cc.rect(0, 0, 0, 0)
    ],
    _effectOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9, 6, 10, 11, 12, 13, 14, 15, 16],
    _effectNode: null,
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

        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        this._load();

        return true;
    },

    _load: function () {
        cc.log("NoviceTeachingLayer _load");
        MainScene.getInstance().switchLayer(this._layer[this._layerOrder[this._step]]);
       // this._rect = this._rectOrder[this._step];
        this._changeEffect(this._effectOrder[this._step]);
    },

    _loadCCB: function () {

    },

    _save: function () {
        cc.log("NoviceTeachingLayer _save");
    },

    next: function () {
        cc.log("NoviceTeachingLayer next");
        this._clearEffect();
        this._step++;
       // MainScene.getInstance().switchLayer(this._layer[this._layerOrder[this._step]]);
        this._rect = this._rectOrder[this._step];
        this._changeEffect(this._effectOrder[this._step]);
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

                this._rect = this._rectOrder[this._step];
                //node.animationManager.setCompletedAnimationCallback(this,function(){
                // });
            }
        } else {
            cc.log("特效" + url + "找不到,可能配置出错");
        }
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchBegan: function (touch, event) {
        cc.log("LazyLayer onTouchBegan");

        var point = touch.getLocation();
        cc.log(point);
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