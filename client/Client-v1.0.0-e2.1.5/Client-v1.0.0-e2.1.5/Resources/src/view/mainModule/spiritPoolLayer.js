/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-17
 * Time: 下午5:25
 * To change this template use File | Settings | File Templates.
 */


/*
 * spirit pool layer
 * */


var SpiritPoolLayer = cc.Layer.extend({
    _spiritPoolLayerFit: null,

    _lvLabel: null,
    _expLabel: null,
    _countLabel: null,
    _preObtainLabel: null,
    _spirit: null,
    spiritNode: null,
    _spiritPool: null,
    _hook: null,
    _useGold: false,
    _reward: null,

    onEnter: function () {
        cc.log("SpiritPoolLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("SpiritPoolLayer init");

        if (!this._super()) return false;

        this._spiritPoolLayerFit = gameFit.mainScene.spiritPoolLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._spiritPoolLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._spiritPoolLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon100);
        titleIcon.setPosition(this._spiritPoolLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._spiritPoolLayerFit.backItemPoint);

        var countIcon = cc.Sprite.create(main_scene_image.icon98);
        countIcon.setPosition(this._spiritPoolLayerFit.countIconPoint);
        this.addChild(countIcon);

        var countLabelIcon = cc.LabelTTF.create("今日可采集次数:", "STHeitiTC-Medium", 20);
        countLabelIcon.setColor(cc.c3b(255, 239, 131));
        countLabelIcon.setAnchorPoint(cc.p(0, 0.5));
        countLabelIcon.setPosition(this._spiritPoolLayerFit.countLabelIconPoint);
        this.addChild(countLabelIcon);

        this._countLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 20);
        this._countLabel.setAnchorPoint(cc.p(0, 0.5));
        this._countLabel.setPosition(this._spiritPoolLayerFit.countLabelPoint);
        this.addChild(this._countLabel);

        var perObtainIcon = cc.Sprite.create(main_scene_image.icon98);
        perObtainIcon.setPosition(this._spiritPoolLayerFit.perObtainIconPoint);
        this.addChild(perObtainIcon);

        var perObtainLabelIcon = cc.LabelTTF.create("每次可获得灵气:", "STHeitiTC-Medium", 20);
        perObtainLabelIcon.setColor(cc.c3b(255, 239, 131));
        perObtainLabelIcon.setAnchorPoint(cc.p(0, 0.5));
        perObtainLabelIcon.setPosition(this._spiritPoolLayerFit.perObtainLabelIconPoint);
        this.addChild(perObtainLabelIcon);

        this._preObtainLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 20);
        this._preObtainLabel.setAnchorPoint(cc.p(0, 0.5));
        this._preObtainLabel.setPosition(this._spiritPoolLayerFit.preObtainLabelPoint);
        this.addChild(this._preObtainLabel);

        var lvIcon = cc.LabelTTF.create("灵气池", "STHeitiTC-Medium", 30);
        lvIcon.setColor(cc.c3b(255, 248, 69));
        lvIcon.setPosition(this._spiritPoolLayerFit.lvIconPoint);
        this.addChild(lvIcon);

        this._lvLabel = cc.LabelTTF.create("LV.  0", "STHeitiTC-Medium", 22);
        this._lvLabel.setAnchorPoint(cc.p(0, 0.5));
        this._lvLabel.setPosition(this._spiritPoolLayerFit.lvLabelPoint);
        this.addChild(this._lvLabel);

        this._expLabel = cc.LabelTTF.create("经验  0 / 0", "STHeitiTC-Medium", 22);
        this._expLabel.setAnchorPoint(cc.p(0, 0.5));
        this._expLabel.setPosition(this._spiritPoolLayerFit.expLabelPoint);
        this.addChild(this._expLabel);

        var tipLabel = cc.LabelTTF.create("灵气池等级越高，可获得的灵气越多", "STHeitiTC-Medium", 20);
        tipLabel.setPosition(this._spiritPoolLayerFit.tipLabelPoint);
        this.addChild(tipLabel);

        this._spiritPool = cc.BuilderReader.load(main_scene_image.uiEffect2, this);
        this._spiritPool.setPosition(this._spiritPoolLayerFit.spiritPoolItemPoint);
        this.addChild(this._spiritPool);

        this._spirit = cc.BuilderReader.load(main_scene_image.uiEffect5, this);
        this._spirit.setPosition(this._spiritPoolLayerFit.spiritItemPoint);
        this.addChild(this._spirit);

        if (gameData.spirit.canUpgrade()) {
            this._spirit.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_2_1", 0);
        } else {
            this._spirit.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_1_1", 0);
        }

        var useGoldItem = cc.MenuItemImage.create(
            main_scene_image.button34,
            main_scene_image.button34,
            this._onClickUseGold,
            this
        );
        useGoldItem.setPosition(this._spiritPoolLayerFit.useGoldItemPoint);

        var menu = cc.Menu.create(backItem, useGoldItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._hook = cc.Sprite.create(main_scene_image.icon20);
        this._hook.setPosition(this._spiritPoolLayerFit.hookPoint);
        this.addChild(this._hook);
        this._hook.setVisible(this._useGold);

        return true;
    },

    update: function () {
        cc.log("SpiritPoolLayer update");

        this.spiritNode.setTexture(lz.getTexture(gameData.spirit.getSpiritUrl()));

        var spiritPool = gameData.spiritPool;

        this._lvLabel.setString("LV.  " + spiritPool.get("lv"));
        this._expLabel.setString("经验  " + spiritPool.get("exp") + " / " + spiritPool.get("maxExp"));
        this._countLabel.setString(spiritPool.get("collectCount"));
        this._preObtainLabel.setString(spiritPool.get("perObtain") + (this._useGold ? " x2" : ""));
    },

    _collectSpirit: function () {
        cc.log("SpiritPoolLayer collectSpirit");

        if (this._reward) {
            var spirit = cc.Sprite.create(main_scene_image.icon247);
            spirit.setPosition(this._spiritPoolLayerFit.spiritPoint);
            this.addChild(spirit);

            var str = "灵气: +" + this._reward.spirit_obtain;

            if (this._reward.isDouble) {
                str = "天降甘霖 灵气爆发: +" + this._reward.spirit_obtain;
                spirit.setScale(1.5);
            }

            var point1 = this._spiritPoolLayerFit.spiritPoolItemPoint;
            var point2 = this._spiritPoolLayerFit.spiritIconPoint;

            var pointArray = [
                point1,
                cc.p(lz.random(point1.x, point2.x), lz.random(point1.y, point2.y)),
                point2
            ];

            spirit.runAction(cc.Sequence.create(
                cc.Spawn.create(
                    cc.CardinalSplineTo.create(2, pointArray, 0),
                    cc.Sequence.create(
                        cc.DelayTime.create(1.5),
                        cc.CallFunc.create(function () {
                            if (gameData.spirit.canUpgrade()) {
                                this._spirit.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_2_2", 0);
                            } else {
                                this._spirit.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_1_2", 0);
                            }
                        }, this),
                        cc.ScaleTo.create(0.5, 0.3, 0.3)
                    )
                ),
                cc.Hide.create()
            ));

            this.scheduleOnce(function () {
                spirit.removeFromParent();
                TipLayer.tipNoBg(str);
                this.update();

                if (NoviceTeachingLayer.getInstance().isNoviceTeaching()) {
                    NoviceTeachingLayer.getInstance().next();
                }
            }, 2);
        }

        LazyLayer.closeCloudLayer();
    },

    _onClickSpiritPool: function () {
        cc.log("SpiritPoolLayer _onClickSoulTable");

        if (NoviceTeachingLayer.getInstance().isNoviceTeaching()) {
            NoviceTeachingLayer.getInstance().clearAndSave();
        }

        var spiritPool = gameData.spiritPool;

        if (!spiritPool.canCollect(this._useGold)) {
            return;
        }

        LazyLayer.showCloudLayer();

        var that = this;
        spiritPool.collect(function (data) {
            cc.log(data);

            if (data) {
                that._reward = data;
                that._spiritPool.animationManager.runAnimationsForSequenceNamedTweenDuration("xiantai_2", 0);
            } else {
                that.update();
                LazyLayer.closeCloudLayer();
            }
        }, this._useGold);
    },

    _onClickSpirit: function () {
        cc.log("SpiritPoolLayer _onClickSpirit");

        if (NoviceTeachingLayer.getInstance().isNoviceTeaching()) {
            NoviceTeachingLayer.getInstance().clearAndSave();
            NoviceTeachingLayer.getInstance().next();
        }

        MainScene.getInstance().addChild(SpiritDetails.create(), 1);
    },

    _onClickUseGold: function () {
        cc.log("SpiritPoolLayer _onClickUseGold");

        this._useGold = !this._useGold;
        this._hook.setVisible(this._useGold);

        this.update();
    },

    _onClickBack: function () {
        cc.log("SpiritPoolLayer _onClickBack");

        MainScene.getInstance().switchLayer(MainLayer);
    }
});


SpiritPoolLayer.create = function () {
    var ret = new SpiritPoolLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};