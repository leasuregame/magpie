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
    _nowLabel: null,
    _cardEvolutionItem: null,
    _cardTrainItem: null,

    init: function () {
        cc.log("EvolutionLayer init");

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

        this._cardEvolutionItem = cc.MenuItemImage.create(
            main_scene_image.button22,
            main_scene_image.button22s,
            main_scene_image.button22d,
            this._onClickCardEvolution,
            this
        );
        this._cardEvolutionItem.setPosition(cc.p(110, 844));

        this._cardTrainItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickCardTrain,
            this
        );
        this._cardTrainItem.setPosition(cc.p(254, 844));

        var menu = cc.Menu.create(this._cardEvolutionItem, this._cardTrainItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var cardEvolutionIcon = cc.Sprite.create(main_scene_image.icon45);
        cardEvolutionIcon.setPosition(cc.p(103, 844));
        this.addChild(cardEvolutionIcon);

        var cardTrainIcon = cc.Sprite.create(main_scene_image.icon46);
        cardTrainIcon.setPosition(cc.p(254, 844));
        this.addChild(cardTrainIcon);

        this._onClickCardEvolution();

        return true;
    },

    _switchToCardListLayer: function (cardListLayer) {
        cc.log("EvolutionLayer _switchToCardListLayer");

        this.retain();
        this.setVisible(false);
        MainScene.getInstance().switch(cardListLayer);
    },

    _backToThisLayer: function (cardListLayer) {
        cc.log("EvolutionLayer _backToThisLayer");

        this.setVisible(true);
        MainScene.getInstance().switch(this);
    },

    _onClickCardEvolution: function () {
        cc.log("EvolutionLayer _onClickCardEvolution");

        this._cardEvolutionItem.setEnabled(false);
        this._cardTrainItem.setEnabled(true);

        this._switchLabel(CardUpgradeLabel);
    },

    _onClickCardTrain: function () {
        cc.log("EvolutionLayer _onClickCardTrain");

        this._cardEvolutionItem.setEnabled(true);
        this._cardTrainItem.setEnabled(false);

        this._switchLabel(SkillUpgradeLabel);
    },

    _switchLabel: function (runLabel) {
        if (!(this._nowLayer instanceof runLabel)) {
            if (this._nowLabel != null) this.removeChild(this._nowLabel);
            this._nowLabel = runLabel.create();
            this.addChild(this._nowLabel);
        }
    }
})


EvolutionLayer.create = function () {
    var ret = new EvolutionLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}