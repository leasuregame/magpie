/**
 * Created by lujunyu on 14-2-27.
 */

var BossLayer = cc.Layer.extend({
    _bossLayerFit: null,

    init: function () {
        cc.log("BossLayer init");

        if (!this._super()) return false;

        this._bossLayerFit = gameFit.mainScene.bossLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._bossLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._bossLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon394);
        titleIcon.setPosition(this._bossLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var headLabel = cc.Sprite.create(main_scene_image.icon147);
        headLabel.setAnchorPoint(cc.p(0, 0));
        headLabel.setPosition(this._bossLayerFit.headLabelPoint);
        this.addChild(headLabel);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setPosition(this._bossLayerFit.goldIconPoint);
        this.addChild(goldIcon);

        this._goldLabel = cc.LabelTTF.create("100000", "STHeitiTC-Medium", 20);
        this._goldLabel.setAnchorPoint(cc.p(0, 0.5));
        this._goldLabel.setPosition(this._bossLayerFit.goldLabelPoint);
        this.addChild(this._goldLabel);

        var bossNameLabel = cc.LabelTTF.create("无敌大魔王", "STHeitiTC-Medium", 30);
        bossNameLabel.setAnchorPoint(cc.p(0.5, 0));
        bossNameLabel.setPosition(this._bossLayerFit.bossNameLabelPoint);
        bossNameLabel.setColor(cc.c3b(252, 254, 143));
        this.addChild(bossNameLabel);

        var runAwayTimeLabel = cc.LabelTTF.create("逃跑时间: ", "STHeitiTC-Medium", 22);
        runAwayTimeLabel.setAnchorPoint(cc.p(0.5, 0));
        runAwayTimeLabel.setPosition(this._bossLayerFit.runAwayLabelPoint);
        this.addChild(runAwayTimeLabel);

        this._bossCdTimeLabel = cc.LabelTTF.create("00: 00: 00", "STHeitiTC-Medium", 22);
        this._bossCdTimeLabel.setAnchorPoint(cc.p(0.5, 0));
        this._bossCdTimeLabel.setPosition(this._bossLayerFit.bossCdTimeLabelPoint);
        this.addChild(this._bossCdTimeLabel);

        var cardFrame = cc.Sprite.create(main_scene_image.card_frame1);
        cardFrame.setAnchorPoint(cc.p(0.5, 0));
        cardFrame.setScale(1.2);
        cardFrame.setPosition(this._bossLayerFit.cardFramePoint);
        this.addChild(cardFrame);

        var bossCard = cc.Sprite.create(main_scene_image.card43_half3);
        bossCard.setAnchorPoint(cc.p(0.5, 0));
        bossCard.setPosition(this._bossLayerFit.bossCardPoint);
        bossCard.setScale(1.4);
        this.addChild(bossCard);

        this._countLeftLabel = cc.LabelTTF.create("剩余攻击次数: 9次", "STHeitiTC-Medium", 25);
        this._countLeftLabel.setAnchorPoint(cc.p(0.5, 0));
        this._countLeftLabel.setPosition(this._bossLayerFit.countLeftLabelPoint);
        this._countLeftLabel.setColor(cc.c3b(167, 28, 0));
        this.addChild(this._countLeftLabel);

        var inspireIcon = cc.Sprite.create(main_scene_image.icon399);
        inspireIcon.setAnchorPoint(cc.p(0.5, 0));
        inspireIcon.setPosition(this._bossLayerFit.inspireIconPoint);
        this.addChild(inspireIcon);

        var additionBgLabel = cc.Sprite.create(main_scene_image.icon401);
        additionBgLabel.setAnchorPoint(cc.p(0.5, 0));
        additionBgLabel.setPosition(this._bossLayerFit.additionBgLabelPoint);
        this.addChild(additionBgLabel);

        this._additionLabel = cc.LabelTTF.create("攻击加成: 100%", "STHeitiTC-Medium", 20);
        this._additionLabel.setAnchorPoint(cc.p(0.5, 0));
        this._additionLabel.setPosition(this._bossLayerFit.additionLabelPoint);
        this.addChild(this._additionLabel);

        var attackCdTimeLabel = cc.LabelTTF.create("攻击冷却时间: ","STHeitiTC-Medium", 22);
        attackCdTimeLabel.setAnchorPoint(cc.p(0.5, 0));
        attackCdTimeLabel.setPosition(this._bossLayerFit.attackCdTimeLabelPoint);
        this.addChild(attackCdTimeLabel);

        this._cdTimeLabel = cc.LabelTTF.create("00: 00: 00","STHeitiTC-Medium", 22);
        this._cdTimeLabel.setAnchorPoint(cc.p(0.5, 0));
        this._cdTimeLabel.setPosition(this._bossLayerFit.cdTimeLabelPoint);
        this.addChild(this._cdTimeLabel);

        var addItem = cc.MenuItemImage.create(
            main_scene_image.button16,
            main_scene_image.button16s,
            this._onClickAdd,
            this
        );

        addItem.setAnchorPoint(cc.p(0.5, 0));
        addItem.setScale(1.2);
        addItem.setPosition(this._bossLayerFit.addItemPoint);

        var subItem = cc.MenuItemImage.create(
            main_scene_image.button35,
            main_scene_image.button35s,
            this._onClickSub,
            this
        );

        subItem.setAnchorPoint(cc.p(0.5, 0));
        subItem.setScale(1.2);
        subItem.setPosition(this._bossLayerFit.subItemPoint);

        var attack = cc.MenuItemImage.create(
            main_scene_image
        );

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );

        backItem.setPosition(this._bossLayerFit.backItemPoint);

        var attackRecordItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon398,
            this._onClickAttackRecord,
            this
        );

        attackRecordItem.setPosition(this._bossLayerFit.attackRecordItemPoint);

        var menu = cc.Menu.create(addItem, subItem, backItem, attackRecordItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    _onClickAdd: function () {
        cc.log("BossLayer _onClickAdd");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

    },

    _onClickSub: function () {
        cc.log("BossLayer _onClickSub");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

    },

    _onClickBack: function () {
        cc.log("BossLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(BossListLayer);
    },

    _onClickAttackRecord: function () {
        cc.log("BossLayer _onClickAttackRecord");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
    }

});

BossLayer.create = function () {
    cc.log("BossLayer create");

    var ref = new BossLayer();
    if (ref && ref.init()) {
        return ref;
    }
    return null;
};