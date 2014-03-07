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

        lz.um.beginLogPageView("强化界面");
    },

    onExit: function () {
        cc.log("StrengthenLayer onExit");

        this._super();

        lz.um.endLogPageView("强化界面");
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

        this._cardTrainItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            main_scene_image.icon82,
            this._onClickCardTrain,
            this
        );
        this._cardTrainItem.setPosition(this._strengthenLayerFit.cardTrainItemPoint);
        this._cardTrainItem.setOffset(this._strengthenLayerFit.cardTrainItemOffset);

        this._cardEvolutionItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            main_scene_image.icon81,
            this._onClickCardEvolution,
            this
        );
        this._cardEvolutionItem.setPosition(this._strengthenLayerFit.cardEvolutionItemPoint);
        this._cardEvolutionItem.setOffset(this._strengthenLayerFit.cardEvolutionItemOffset);

        var menu = cc.Menu.create(
            this._cardUpgradeItem,
            this._cardTrainItem,
            this._cardEvolutionItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._cardUpgradeItem.setEnabled(false);
        this._cardTrainItem.setEnabled(true);
        this._cardEvolutionItem.setEnabled(true);

        this._switchLabel(CardUpgradeLabel);

        this.retain();

        return true;
    },

    switchToCardListLayer: function (cardListLayer) {
        cc.log("StrengthenLayer switchToCardListLayer");

        MainScene.getInstance().switchTo(cardListLayer);
    },

    backToThisLayer: function () {
        cc.log("StrengthenLayer backToThisLayer");

        MainScene.getInstance().switchTo(this);
    },

    _onClickCardUpgrade: function () {
        cc.log("StrengthenLayer _onClickCardUpgrade");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._cardUpgradeItem.setEnabled(false);
        this._cardTrainItem.setEnabled(true);
        this._cardEvolutionItem.setEnabled(true);

        this._switchLabel(CardUpgradeLabel);
    },

    _onClickCardTrain: function () {
        cc.log("StrengthenLayer _onClickSkillUpgrade");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._cardUpgradeItem.setEnabled(true);
        this._cardTrainItem.setEnabled(false);
        this._cardEvolutionItem.setEnabled(true);

        this._switchLabel(CardTrainLabel);

        if(mandatoryTeachingLayer) {
            if(mandatoryTeachingLayer.isTeaching()) {
                mandatoryTeachingLayer.clearAndSave();
                mandatoryTeachingLayer.next();
            }
        }
    },

    _onClickCardEvolution: function () {
        cc.log("EvolutionLayer _onClickCardEvolution");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._cardUpgradeItem.setEnabled(true);
        this._cardTrainItem.setEnabled(true);
        this._cardEvolutionItem.setEnabled(false);

        this._switchLabel(CardEvolutionLabel);
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