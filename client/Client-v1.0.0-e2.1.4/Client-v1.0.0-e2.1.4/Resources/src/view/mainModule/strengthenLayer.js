/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:59
 * To change this template use File | Settings | File Templates.
 */


/*
 * 强化
 * */


var StrengthenLayer = cc.Layer.extend({
    _nowLabel: null,
    _cardUpgradeItem: null,
    _skillUpgradeItem: null,
    _passiveSkillUpgradeItem: null,

    init: function () {
        cc.log("StrengthenLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg1);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite, -1);

        var playerHeaderLabel = PlayerHeaderLabel.create();
        playerHeaderLabel.setPosition(cc.p(40, 890));
        this.addChild(playerHeaderLabel);

        bgSprite = cc.Sprite.create(main_scene_image.bg15);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        this._cardUpgradeItem = cc.MenuItemImage.create(
            main_scene_image.button22,
            main_scene_image.button22s,
            main_scene_image.button22d,
            this._onClickCardUpgrade,
            this
        );
        this._cardUpgradeItem.setPosition(cc.p(110, 848));

        this._skillUpgradeItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickSkillUpgrade,
            this
        );
        this._skillUpgradeItem.setPosition(cc.p(254, 848));

        this._passiveSkillUpgradeItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickPassiveSkillUpgrade,
            this
        );
        this._passiveSkillUpgradeItem.setPosition(cc.p(404, 848));

        var menu = cc.Menu.create(this._cardUpgradeItem, this._skillUpgradeItem, this._passiveSkillUpgradeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var cardUpgradeIcon = cc.Sprite.create(main_scene_image.icon45);
        cardUpgradeIcon.setPosition(cc.p(103, 848));
        this.addChild(cardUpgradeIcon);

        var skillUpgradeIcon = cc.Sprite.create(main_scene_image.icon46);
        skillUpgradeIcon.setPosition(cc.p(254, 848));
        this.addChild(skillUpgradeIcon);

        var passiveSkillUpgradeIcon = cc.Sprite.create(main_scene_image.icon47);
        passiveSkillUpgradeIcon.setPosition(cc.p(404, 848));
        this.addChild(passiveSkillUpgradeIcon);

        this._onClickCardUpgrade();

        return true;
    },

    _switchToCardListLayer: function (cardListLayer) {
        cc.log("StrengthenLayer _switchToCardListLayer");

        this.setVisible(false);
        MainScene.getInstance().switch(cardListLayer);
    },

    _backToThisLayer: function (cardListLayer) {
        cc.log("StrengthenLayer _backToThisLayer");

        this.setVisible(true);
        MainScene.getInstance().switch(this);
    },

    _onClickCardUpgrade: function () {
        cc.log("StrengthenLayer _onClickCardUpgrade");

        this._cardUpgradeItem.setEnabled(false);
        this._skillUpgradeItem.setEnabled(true);
        this._passiveSkillUpgradeItem.setEnabled(true);

        this._switchLabel(CardUpgradeLabel);
    },

    _onClickSkillUpgrade: function () {
        cc.log("StrengthenLayer _onClickSkillUpgrade");

        this._cardUpgradeItem.setEnabled(true);
        this._skillUpgradeItem.setEnabled(false);
        this._passiveSkillUpgradeItem.setEnabled(true);

        this._switchLabel(SkillUpgradeLabel);
    },

    _onClickPassiveSkillUpgrade: function () {
        cc.log("StrengthenLayer _onClickPassiveSkillUpgrade");

        this._cardUpgradeItem.setEnabled(true);
        this._skillUpgradeItem.setEnabled(true);
        this._passiveSkillUpgradeItem.setEnabled(false);

        this._switchLabel(PassiveSkillUpgradeLabel);
    },

    _switchLabel: function (runLabel) {
        if (!(this._nowLayer instanceof runLabel)) {
            this.removeChild(this._nowLabel);
            this._nowLabel = runLabel.create();
            this.addChild(this._nowLabel);
        }
    }
})

StrengthenLayer.create = function () {
    var res = new StrengthenLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
}