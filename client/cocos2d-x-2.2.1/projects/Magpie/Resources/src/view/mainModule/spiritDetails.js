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

    ccbSpiritNode: null,
    _lvLabel: null,
    _expLabel: null,
    _passiveHarmLabel: null,
    _oldPassiveHarm: 0,
    _skillHarmLabel: null,
    _upgradeItem: null,
    _ccbNode: null,
    _showUpgrade: false,

    onEnter: function () {
        cc.log("SpiritDetails onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("元神界面");
    },

    onExit: function () {
        cc.log("SpiritDetails onExit");

        this._super();

        lz.um.endLogPageView("元神界面");
    },

    init: function () {
        cc.log("SpiritDetails init");

        if (!this._super()) return false;

        this._spiritDetailsFit = gameFit.mainScene.spiritDetails;
        this._showUpgrade = false;

        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 255), 640, 1136);
        bgLayer.setPosition(this._spiritDetailsFit.bgLayerPoint);
        this.addChild(bgLayer);

        this._ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect4, this);
        this._ccbNode.setPosition(this._spiritDetailsFit.spiritNodeBgSpritePoint);
        this.addChild(this._ccbNode);

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

        this._passiveHarmLabel = cc.LabelTTF.create("0%", "STHeitiTC-Medium", 23);
        this._passiveHarmLabel.setPosition(this._spiritDetailsFit.passiveHarmLabelPoint);
        this.addChild(this._passiveHarmLabel);

        this._lvLabel = cc.LabelTTF.create("Lv.  0 / 0", "STHeitiTC-Medium", 22);
        this._lvLabel.setPosition(this._spiritDetailsFit.lvLabelPoint);
        this.addChild(this._lvLabel);

        var spiritIcon = cc.Sprite.create(main_scene_image.icon317);
        spiritIcon.setPosition(this._spiritDetailsFit.spiritIconPoint);
        this.addChild(spiritIcon);

        this._expLabel = cc.LabelTTF.create("灵气:  0 / 0", "STHeitiTC-Medium", 22);
        this._expLabel.setPosition(this._spiritDetailsFit.expLabelPoint);
        this.addChild(this._expLabel);

        this._upgradeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon52,
            this._onClickUpgrade,
            this
        );
        this._upgradeItem.setPosition(this._spiritDetailsFit.upgradeItemPoint);

        var ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect33, this);
        ccbNode.setPosition(cc.p(75, 35));
        this._upgradeItem.getNormalImage().addChild(ccbNode);

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon36,
            this._onClickClose,
            this
        );
        closeItem.setPosition(this._spiritDetailsFit.closeItemPoint);

        var menu = cc.Menu.create(this._upgradeItem, closeItem);
        menu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    update: function () {
        cc.log("SpiritDetails update");

        var spirit = gameData.spirit;

        this.ccbSpiritNode.setTexture(lz.getTexture(spirit.getSpiritUrl()));

        this._upgradeItem.setEnabled(spirit.canUpgrade());

        this._lvLabel.setString("Lv.  " + spirit.get("lv") + " / " + spirit.get("maxLv"));
        this._expLabel.setString("灵气:  " + spirit.get("exp") + " / " + spirit.get("maxExp"));
        this._passiveHarmLabel.setString(spirit.get("passiveHarm") + "%");

        if (this._showUpgrade) {
            this._showUpgrade = false;
            var moveByAction = cc.Sequence.create(
                cc.MoveBy.create(0.1, cc.p(5, 0)),
                cc.MoveBy.create(0.1, cc.p(-5, 0)),
                cc.MoveBy.create(0.1, cc.p(5, 0)),
                cc.MoveBy.create(0.1, cc.p(-5, 0))
            );
            var scaleToAction = cc.Sequence.create(
                cc.ScaleTo.create(0.1, 1.5),
                cc.ScaleTo.create(0.1, 1),
                cc.ScaleTo.create(0.1, 1.5),
                cc.ScaleTo.create(0.1, 1)

            );
            var spawnAction = cc.Spawn.create(moveByAction, scaleToAction);

            this._passiveHarmLabel.runAction(spawnAction);
        }
    },

    ccbFnUpdate: function () {
        cc.log("SpiritDetails ccbFnUpdate");

        this.update();
    },

    ccbFnCloseCloud: function () {
        cc.log("SpiritDetails ccbFnCloseCloud");

        var effect = cc.BuilderReader.load(main_scene_image.uiEffect59, this);
        var controller = effect.controller;
        var spirit = gameData.spirit;

        var lv = spirit.get("lv");
        controller.ccbOldLvLabel.setString("Lv.  " + (lv - 1));
        controller.ccbNowLvLabel.setString("Lv.  " + lv);
        controller.ccbOldPassiveHarmLabel.setString(this._oldPassiveHarm);
        controller.ccbNowPassiveHarmLabel.setString(spirit.get("passiveHarm") + "%");
        controller.ccbSpiritIcon.setTexture(lz.getTexture(main_scene_image["spirit_1_" + Math.ceil(lv / 2)]));

        effect.setPosition(this._spiritDetailsFit.effectPoint);
        effect.animationManager.setCompletedAnimationCallback(this, function () {
            effect.removeFromParent();
            LazyLayer.closeCloudAll();
            if (noviceTeachingLayer.isNoviceTeaching()) {
                noviceTeachingLayer.next();
            }
        });

        this.addChild(effect);
    },

    _onClickUpgrade: function () {
        cc.log("SpiritDetails _onClickUpgrade");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (noviceTeachingLayer.isNoviceTeaching()) {
            noviceTeachingLayer.clearAndSave();
        }

        LazyLayer.showCloudAll();

        this._upgradeItem.setEnabled(false);

        var that = this;
        gameData.spirit.upgrade(function (success) {
            cc.log(success);

            if (success) {
                that._showUpgrade = true;
                that._oldPassiveHarm = that._passiveHarmLabel.getString();
                that._ccbNode.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_2", 0);
            } else {
                that.update();
                TipLayer.tip("升级出错");
                LazyLayer.closeCloudAll();
            }
        });
    },

    _onClickClose: function () {
        cc.log("SpiritDetails _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().getLayer().update();

        this.removeFromParent();

        if (noviceTeachingLayer.isNoviceTeaching()) {
            noviceTeachingLayer.clearAndSave();
            noviceTeachingLayer.next();
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
