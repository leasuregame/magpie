/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-23
 * Time: 上午10:48
 * To change this template use File | Settings | File Templates.
 */


/*
 * spirit details
 * */


var SpiritDetails = LazyLayer.extend({
    _spiritDetailsFit: null,

    _menu: null,
    _spiritNode: null,
    _lvLabel: null,
    _expLabel: null,
    _passiveHarmLabel: null,
    _skillHarmLabel: null,
    _upgradeItem: null,

    onEnter: function () {
        cc.log("SpiritDetails onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("SpiritDetails init");

        if (!this._super()) return false;

        this._spiritDetailsFit = gameFit.mainScene.spiritDetails;

        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 255), 640, 1136);
        bgLayer.setPosition(this._spiritDetailsFit.bgLayerPoint);
        this.addChild(bgLayer);

        var spiritNodeBgSprite = cc.Sprite.create(main_scene_image.icon234);
        spiritNodeBgSprite.setPosition(this._spiritDetailsFit.spiritNodeBgSpritePoint);
        this.addChild(spiritNodeBgSprite);

        var cloudSprite = cc.Sprite.create(main_scene_image.icon237);
        cloudSprite.setPosition(this._spiritDetailsFit.cloudSpritePoint);
        this.addChild(cloudSprite);

        cloudSprite.runAction(
            cc.RepeatForever.create(
                cc.Sequence.create(
                    cc.MoveTo.create(lz.random(6, 12), this._spiritDetailsFit.cloudSpritePoint2),
                    cc.MoveTo.create(lz.random(6, 12), this._spiritDetailsFit.cloudSpritePoint)
                )
            )
        );

        var cloudSprite1 = cc.Sprite.create(main_scene_image.icon238);
        cloudSprite1.setPosition(this._spiritDetailsFit.cloudSprite1Point);
        this.addChild(cloudSprite1);

        var cloudSprite2 = cc.Sprite.create(main_scene_image.icon239);
        cloudSprite2.setPosition(this._spiritDetailsFit.cloudSprite2Point);
        this.addChild(cloudSprite2);

        var lineSprite1 = cc.Sprite.create(main_scene_image.icon240);
        lineSprite1.setPosition(this._spiritDetailsFit.lineSprite1Point);
        this.addChild(lineSprite1);

        var lineSprite2 = cc.Sprite.create(main_scene_image.icon240);
        lineSprite2.setPosition(this._spiritDetailsFit.lineSprite2Point);
        this.addChild(lineSprite2);

        var stoneSprite1 = cc.Sprite.create(main_scene_image.icon235);
        stoneSprite1.setPosition(this._spiritDetailsFit.stoneSprite1Point);
        this.addChild(stoneSprite1);

        stoneSprite1.runAction(
            cc.RepeatForever.create(
                cc.Sequence.create(
                    cc.MoveTo.create(lz.random(5, 10), this._spiritDetailsFit.stoneSprite1Point2),
                    cc.MoveTo.create(lz.random(8, 16), this._spiritDetailsFit.stoneSprite1Point)
                )
            )
        );

        var stoneSprite2 = cc.Sprite.create(main_scene_image.icon236);
        stoneSprite2.setPosition(this._spiritDetailsFit.stoneSprite2Point);
        this.addChild(stoneSprite2);

        stoneSprite2.runAction(
            cc.RepeatForever.create(
                cc.Sequence.create(
                    cc.MoveTo.create(lz.random(4, 8), this._spiritDetailsFit.stoneSprite2Point2),
                    cc.MoveTo.create(lz.random(3, 6), this._spiritDetailsFit.stoneSprite2Point)
                )
            )
        );

        var passiveIcon = cc.LabelTTF.create("元神守护", "STHeitiTC-Medium", 30);
        passiveIcon.setColor(cc.c3b(255, 248, 69));
        passiveIcon.setPosition(this._spiritDetailsFit.passiveIconPoint);
        this.addChild(passiveIcon);

        var passiveDescription = cc.LabelTTF.create("所有上阵卡牌基础生命值和攻击力获得额外加成", "STHeitiTC-Medium", 20);
        passiveDescription.setAnchorPoint(cc.p(0, 0.5));
        passiveDescription.setPosition(this._spiritDetailsFit.passiveDescriptionPoint);
        this.addChild(passiveDescription);

        var passiveHarmIcon = cc.LabelTTF.create("当前加成效果:", "STHeitiTC-Medium", 20);
        passiveHarmIcon.setColor(cc.c3b(162, 235, 47));
        passiveHarmIcon.setPosition(this._spiritDetailsFit.passiveHarmIconPoint);
        this.addChild(passiveHarmIcon);

        var skillIcon = cc.LabelTTF.create("元神之怒", "STHeitiTC-Medium", 30);
        skillIcon.setColor(cc.c3b(255, 248, 69));
        skillIcon.setPosition(this._spiritDetailsFit.skillIconPoint);
        this.addChild(skillIcon);

        var skillDescription1 = cc.LabelTTF.create("每次我方卡牌阵亡，将有一定概率触发元神之怒，", "STHeitiTC-Medium", 20);
        skillDescription1.setAnchorPoint(cc.p(0, 0.5));
        skillDescription1.setPosition(this._spiritDetailsFit.skillDescription1Point);
        this.addChild(skillDescription1);

        var skillDescription2 = cc.LabelTTF.create("元神将释放阵亡卡牌的技能效果。", "STHeitiTC-Medium", 20);
        skillDescription2.setAnchorPoint(cc.p(0, 0.5));
        skillDescription2.setPosition(this._spiritDetailsFit.skillDescription2Point);
        this.addChild(skillDescription2);

//        var skillHarmIcon = cc.LabelTTF.create("当前加成效果:", "STHeitiTC-Medium", 20);
//        skillHarmIcon.setColor(cc.c3b(146, 180, 83));
//        skillHarmIcon.setPosition(cc.p(420, 220));
//        this.addChild(skillHarmIcon);

        this._passiveHarmLabel = cc.LabelTTF.create("0%", "STHeitiTC-Medium", 23);
        this._passiveHarmLabel.setPosition(this._spiritDetailsFit.passiveHarmLabelPoint);
        this.addChild(this._passiveHarmLabel);

//        this._skillHarmLabel = cc.LabelTTF.create("0%", "STHeitiTC-Medium", 23);
//        this._skillHarmLabel.setColor(cc.c3b(255, 239, 131));
//        this._skillHarmLabel.setPosition(cc.p(520, 220));
//        this.addChild(this._skillHarmLabel);

        this._lvLabel = cc.LabelTTF.create("LV.  0", "STHeitiTC-Medium", 40);
        this._lvLabel.setPosition(this._spiritDetailsFit.lvLabelPoint);
        this.addChild(this._lvLabel);

        this._expLabel = cc.LabelTTF.create("灵气:    0 / 0", "STHeitiTC-Medium", 22);
        this._expLabel.setPosition(this._spiritDetailsFit.expLabelPoint);
        this.addChild(this._expLabel);

        this._upgradeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon52,
            this._onClickUpgrade,
            this
        );
        this._upgradeItem.setPosition(this._spiritDetailsFit.upgradeItemPoint);

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon36,
            this._onClickClose,
            this
        );
        closeItem.setPosition(this._spiritDetailsFit.closeItemPoint);

        this._menu = cc.Menu.create(this._upgradeItem, closeItem);
        this._menu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        this._menu.setPosition(cc.p(0, 0));
        this.addChild(this._menu);

        return true;
    },

    update: function () {
        cc.log("SpiritDetails update");

        var spirit = gameData.spirit;

        if (this._spiritNode != null) {
            this._spiritNode.removeFromParent();
            this._spiritNode = null;
        }

        this._spiritNode = SpiritNode.create();
        this._spiritNode.setScale(1.2);
        this._spiritNode.setPosition(this._spiritDetailsFit.spiritNodePoint);
        this.addChild(this._spiritNode, 2);

        this._upgradeItem.setVisible(spirit.canUpgrade());

        this._lvLabel.setString("LV.  " + spirit.get("lv"));
        this._expLabel.setString("灵气:    " + spirit.get("exp") + " / " + spirit.get("maxExp"));
        this._passiveHarmLabel.setString(spirit.get("passiveHarm") + "%");
//        this._skillHarmLabel.setString(spirit.get("skillHarm") + "%");
    },

    _play: function () {
        var lazyLayer = LazyLayer.create();
        lazyLayer.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        this.addChild(lazyLayer, 3);

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 255), 640, 1136);
        bgLayer.setPosition(this._spiritDetailsFit.bgLayerPoint);
        lazyLayer.addChild(bgLayer);

        var that = this;
        var cb = function () {
            that.update();

            lazyLayer.setZOrder(1);

            that.scheduleOnce(function () {
                bgLayer.runAction(
                    cc.Sequence.create(
                        cc.FadeOut.create(1),
                        cc.CallFunc.create(function () {
                            lazyLayer.removeFromParent();

                            if (NoviceTeachingLayer.getInstance().isNoviceTeaching()) {
                                NoviceTeachingLayer.getInstance().next();
                            }
                        }, this)
                    )
                );
            }, 2);
        };

        bgLayer.runAction(
            cc.Sequence.create(
                cc.FadeIn.create(1),
                cc.CallFunc.create(function () {
                    playEffect({
                        effectId: 10,
                        target: that,
                        loops: 1,
                        delay: 0.1,
                        zOrder: 10,
                        position: this._spiritDetailsFit.effectPoint,
                        clear: true,
                        cb: cb
                    });
                }, this)
            )
        );
    },

    _onClickUpgrade: function () {
        cc.log("SpiritDetails _onClickUpgrade");

        if (NoviceTeachingLayer.getInstance().isNoviceTeaching()) {
            NoviceTeachingLayer.getInstance().clearAndSave();
        }

        LazyLayer.showCloudAll();

        var that = this;
        gameData.spirit.upgrade(function (success) {
            cc.log(success);

            if (success) {
                that._play();
            } else {
                that.update();
                TipLayer.tip("升级出错");
            }
            LazyLayer.closeCloudAll();
        });
    },

    _onClickClose: function () {
        cc.log("SpiritDetails _onClickClose");

        this._menu.setEnabled(false);

        this.removeFromParent();

        if (NoviceTeachingLayer.getInstance().isNoviceTeaching()) {
            NoviceTeachingLayer.getInstance().clearAndSave();
            NoviceTeachingLayer.getInstance().next();
        }
    }
});


SpiritDetails.create = function () {
    var ret = new SpiritDetails();

    if (ret && ret.init()) {
        return ret;
    }

    return ret;
};
