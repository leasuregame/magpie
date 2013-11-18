/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-16
 * Time: 下午5:15
 * To change this template use File | Settings | File Templates.
 */


/*
 * evolution layer
 * */


var EvolutionLayer = cc.Layer.extend({
    _evolutionLayerFit: null,

    _nowLabel: null,
    _cardEvolutionItem: null,
    _cardTrainItem: null,

    onEnter: function () {
        cc.log("EvolutionLayer onEnter");

        this._super();

        lz.dc.beginLogPageView("进阶界面");
    },

    onExit: function() {
        cc.log("EvolutionLayer onExit");

        this._super();

        lz.dc.endLogPageView("进阶界面");
    },

    init: function () {
        cc.log("EvolutionLayer init");

        if (!this._super()) return false;

        this._evolutionLayerFit = gameFit.mainScene.evolutionLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg1, this._evolutionLayerFit.bgSpriteRect1);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._evolutionLayerFit.bgSpritePoint);
        this.addChild(bgSprite, -1);

        var playerHeaderLabel = PlayerHeaderLabel.create();
        playerHeaderLabel.setPosition(this._evolutionLayerFit.playerHeaderLabelPoint);
        this.addChild(playerHeaderLabel);

        bgSprite = cc.Sprite.create(main_scene_image.bg15, this._evolutionLayerFit.bgSpriteRect2);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._evolutionLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        this._cardEvolutionItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button22,
            main_scene_image.button22s,
            main_scene_image.button22d,
            main_scene_image.icon81,
            this._onClickCardEvolution,
            this
        );
        this._cardEvolutionItem.setPosition(this._evolutionLayerFit.cardEvolutionItemPoint);
        this._cardEvolutionItem.setOffset(this._evolutionLayerFit.cardEvolutionItemOffset);

        this._cardTrainItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            main_scene_image.icon82,
            this._onClickCardTrain,
            this
        );
        this._cardTrainItem.setPosition(this._evolutionLayerFit.cardTrainItemPoint);
        this._cardTrainItem.setOffset(this._evolutionLayerFit.cardTrainItemOffset);

        var menu = cc.Menu.create(this._cardEvolutionItem, this._cardTrainItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._onClickCardEvolution();

        this.retain();

        return true;
    },

    switchToCardListLayer: function (cardListLayer) {
        cc.log("EvolutionLayer switchToCardListLayer");

        MainScene.getInstance().switch(cardListLayer);
    },

    backToThisLayer: function () {
        cc.log("EvolutionLayer backToThisLayer");

        MainScene.getInstance().switch(this);
    },

    _onClickCardEvolution: function () {
        cc.log("EvolutionLayer _onClickCardEvolution");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._cardEvolutionItem.setEnabled(false);
        this._cardTrainItem.setEnabled(true);

        this._switchLabel(CardEvolutionLayer);
    },

    _onClickCardTrain: function () {
        cc.log("EvolutionLayer _onClickCardTrain");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._cardEvolutionItem.setEnabled(true);
        this._cardTrainItem.setEnabled(false);

        this._switchLabel(CardTrainLabel);
    },

    _switchLabel: function (runLabel) {
        if (!(this._nowLayer instanceof runLabel)) {
            if (this._nowLabel != null) this.removeChild(this._nowLabel);
            this._nowLabel = runLabel.create();
            this.addChild(this._nowLabel);
        }
    }
});


EvolutionLayer.create = function () {
    var ret = new EvolutionLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};