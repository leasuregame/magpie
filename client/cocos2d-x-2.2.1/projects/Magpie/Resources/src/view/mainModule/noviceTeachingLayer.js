/**
 * Created by lcc3536 on 13-11-4.
 */


/*
 * novice teaching layer
 * */

var NOVICE_TEACHING_LAYER_HANDLER_PRIORITY = -201;

var CLICK_RIGHT_NOW = 0;
var CLICK_WAITING = 1;
var CLICK_ANY = 2;

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

        this._step = gameData.player.get("noviceTeachStep");

        cc.log("step = " + this._step);

        this._rect = cc.rect(0, 0, 0, 0);

        if (this.isNoviceTeaching()) {
            this._load();
            var overItem = cc.MenuItemImage.create(
                main_scene_image.icon290,
                main_scene_image.icon290,
                this.onOverTeaching,
                this
            );
            overItem.setPosition(this._noviceTeachingLayerFit.overItemPoint);

            var menu = cc.Menu.create(overItem);
            menu.setTouchPriority(NOVICE_TEACHING_LAYER_HANDLER_PRIORITY);
            this.addChild(menu, 1);
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
        cc.log("NoviceTeachingLayer _save: " + this._step);
        gameData.player.setStep(this._step);
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
        this._rect = cc.rect(0, 0, 0, 0);
        this._step++;
        var that = this;

        this._save();
        that._clearEffect();

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

            if (node != null) {
                node.setAnchorPoint(cc.p(0, 0));
                node.setPosition(this._effectPoints[this._step]);
                this.addChild(node);
                this._effectNode = node;
                if (this._clickType[this._rect] == CLICK_RIGHT_NOW) {
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
        cc.log("NoviceTeachingLayer getStep: " + this._step);
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

    _showOverTeaching: function () {
        cc.log("NoviceTeachingLayer showOverTeaching");

        var layer = LazyLayer.create();
        layer.setTouchPriority(NOVICE_TEACHING_LAYER_HANDLER_PRIORITY);
        this.addChild(layer, 10);

        var that = this;
        layer.onTouchBegan = function (touch, event) {
            cc.log("LazyLayer onTouchBegan");

            return (that.isVisible() && layer.isVisible());
        };

        var bgSprite = cc.Sprite.create(main_scene_image.bg16);
        bgSprite.setPosition(this._noviceTeachingLayerFit.bgSpritePoint);
        layer.addChild(bgSprite);

        var msgBgIcon = cc.Sprite.create(main_scene_image.icon175);
        msgBgIcon.setPosition(this._noviceTeachingLayerFit.msgBgIconPoint);
        msgBgIcon.setScaleX(0.88);
        layer.addChild(msgBgIcon);

        var tipLabel = cc.LabelTTF.create("教学可以帮你更好的熟悉游戏，", "STHeitiTC-Medium", 25);
        tipLabel.setPosition(this._noviceTeachingLayerFit.tipLabelPoint);
        tipLabel.setAnchorPoint(cc.p(0.5, 1));
        layer.addChild(tipLabel);

        var tipLabel2 = cc.LabelTTF.create("你确定要跳过吗？", "STHeitiTC-Medium", 25);
        tipLabel2.setPosition(this._noviceTeachingLayerFit.tipLabel2Point);
        tipLabel2.setAnchorPoint(cc.p(0.5, 1));
        layer.addChild(tipLabel2);

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            function () {
                this._overTeaching();
                layer.removeFromParent();
            },
            this
        );
        okItem.setPosition(this._noviceTeachingLayerFit.okItemPoint);

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon36,
            function () {
                layer.removeFromParent();
            },
            this
        );
        closeItem.setPosition(this._noviceTeachingLayerFit.closeItemPoint);

        var menu = cc.Menu.create(okItem, closeItem);
        menu.setTouchPriority(NOVICE_TEACHING_LAYER_HANDLER_PRIORITY);
        menu.setPosition(cc.p(0, 0));
        layer.addChild(menu);
    },


    _overTeaching: function () {
        cc.log("NoviceTeachingLayer _overTeaching");
        this._step = OVER_NOVICE_STEP;
        this._save();
        this.removeFromParent();
        gameGuide.updateLotteryGuide();

    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchBegan: function (touch, event) {
        cc.log("NoviceTeachingLayer onTouchBegan");

        if (this.isVisible()) {
            var point = touch.getLocation();
            return !cc.rectContainsPoint(this._rect, point);
        } else {
            return false;
        }
    },


    onOverTeaching: function () {
        cc.log("NoviceTeachingLayer onOverTeaching");
        this._showOverTeaching();
    }


});


NoviceTeachingLayer.create = function () {
    var ret = new NoviceTeachingLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};

var noviceTeachingLayer = null;