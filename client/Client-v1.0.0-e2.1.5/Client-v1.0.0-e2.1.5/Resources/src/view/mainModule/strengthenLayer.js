/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:59
 * To change this template use File | Settings | File Templates.
 */


/*
 * strengthen layer
 * */


var StrengthenLayer = cc.Layer.extend({
    _strengthenLayerFit: null,

    _nowLabel: null,
    _cardUpgradeItem: null,
    _skillUpgradeItem: null,
    _passiveSkillUpgradeItem: null,

    onEnter: function () {
        cc.log("StrengthenLayer onEnter");

        this._super();

        lz.dc.beginLogPageView("强化界面");
    },

    onExit: function () {
        cc.log("StrengthenLayer onExit");

        this._super();

        lz.dc.endLogPageView("强化界面");
    },

    init: function () {
        cc.log("StrengthenLayer init");

        if (!this._super()) return false;

        this._strengthenLayerFit = gameFit.mainScene.strengthenLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg1, this._strengthenLayerFit.bgSpriteRect1);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._strengthenLayerFit.bgSpritePoint);
        this.addChild(bgSprite, -1);

        var playerHeaderLabel = PlayerHeaderLabel.create();
        playerHeaderLabel.setPosition(this._strengthenLayerFit.playerHeaderLabelPoint);
        this.addChild(playerHeaderLabel);

        bgSprite = cc.Sprite.create(main_scene_image.bg15, this._strengthenLayerFit.bgSpriteRect2);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._strengthenLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        this._cardUpgradeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button22,
            main_scene_image.button22s,
            main_scene_image.button22d,
            main_scene_image.icon45,
            this._onClickCardUpgrade,
            this
        );
        this._cardUpgradeItem.setPosition(this._strengthenLayerFit.cardUpgradeItemPoint);
        this._cardUpgradeItem.setOffset(this._strengthenLayerFit.cardUpgradeItemOffset);

        this._skillUpgradeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            main_scene_image.icon46,
            this._onClickSkillUpgrade,
            this
        );
        this._skillUpgradeItem.setPosition(this._strengthenLayerFit.skillUpgradeItemPoint);
        this._skillUpgradeItem.setOffset(this._strengthenLayerFit.skillUpgradeItemOffset);

        this._passiveSkillUpgradeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            main_scene_image.icon47,
            this._onClickPassiveSkillUpgrade,
            this
        );
        this._passiveSkillUpgradeItem.setPosition(this._strengthenLayerFit.passiveSkillUpgradeItemPoint);
        this._passiveSkillUpgradeItem.setOffset(this._strengthenLayerFit.passiveSkillUpgradeItemOffset);

        var menu = cc.Menu.create(
            this._cardUpgradeItem,
            this._skillUpgradeItem,
            this._passiveSkillUpgradeItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._onClickCardUpgrade();

        this.retain();

        return true;
    },

    switchToCardListLayer: function (cardListLayer) {
        cc.log("StrengthenLayer switchToCardListLayer");

        MainScene.getInstance().switch(cardListLayer);
    },

    backToThisLayer: function () {
        cc.log("StrengthenLayer backToThisLayer");

        MainScene.getInstance().switch(this);
    },

    _onClickCardUpgrade: function () {
        cc.log("StrengthenLayer _onClickCardUpgrade");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._cardUpgradeItem.setEnabled(false);
        this._skillUpgradeItem.setEnabled(true);
        this._passiveSkillUpgradeItem.setEnabled(true);

        this._switchLabel(CardUpgradeLabel);
    },

    _onClickSkillUpgrade: function () {
        cc.log("StrengthenLayer _onClickSkillUpgrade");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._cardUpgradeItem.setEnabled(true);
        this._skillUpgradeItem.setEnabled(false);
        this._passiveSkillUpgradeItem.setEnabled(true);

        this._switchLabel(SkillUpgradeLabel);
    },

    _onClickPassiveSkillUpgrade: function () {
        cc.log("StrengthenLayer _onClickPassiveSkillUpgrade");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._cardUpgradeItem.setEnabled(true);
        this._skillUpgradeItem.setEnabled(true);
        this._passiveSkillUpgradeItem.setEnabled(false);

        this._switchLabel(PassiveSkillAfreshLabel);
    },

    _switchLabel: function (runLabel) {
        if (!(this._nowLayer instanceof runLabel)) {
            if (this._nowLabel != null) this.removeChild(this._nowLabel);
            this._nowLabel = runLabel.create();
            this.addChild(this._nowLabel);
        }
    }
});

StrengthenLayer.create = function () {
    var res = new StrengthenLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
};