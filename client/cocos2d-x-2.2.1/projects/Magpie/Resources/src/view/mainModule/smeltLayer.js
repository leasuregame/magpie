/**
 * Created by lujunyu on 14-5-20.
 */

var SmeltLayer = cc.Layer.extend({
    smeltLayerFit: null,

    init: function () {
        cc.log("SmeltLayer init");

        if (!this._super()) return false;

        this._smeltLayerFit = gameFit.mainScene.smeltLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg1, this._smeltLayerFit.bgSpriteRect1);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._smeltLayerFit.bgSpritePoint);
        this.addChild(bgSprite, -1);

        var playerHeaderLabel = PlayerHeaderLabel.create();
        playerHeaderLabel.setPosition(this._smeltLayerFit.playerHeaderLabelPoint);
        this.addChild(playerHeaderLabel);

        bgSprite = cc.Sprite.create(main_scene_image.bg15, this._smeltLayerFit.bgSpriteRect2);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._smeltLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        this._cardSmeltLabelItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button22,
            main_scene_image.button22s,
            main_scene_image.button22d,
            main_scene_image.icon457,
            this._onClickCardSmeltLayer,
            this
        );
        this._cardSmeltLabelItem.setPosition(this._smeltLayerFit.cardSmeltLayerItemPoint);
        this._cardSmeltLabelItem.setOffset(cc.p(0, -5));

        this._usePillLabelItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            main_scene_image.icon458,
            this._onClickUsePillLayer,
            this
        );
        this._usePillLabelItem.setPosition(this._smeltLayerFit.usePillLayerItemPoint);
        this._usePillLabelItem.setOffset(cc.p(-6, -5));

        var menu = cc.Menu.create(
            this._cardSmeltLabelItem,
            this._usePillLabelItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        this._cardSmeltLabelItem.setEnabled(false);
        this._usePillLabelItem.setEnabled(true);
        this.switchLayer(CardSmeltLabel);

        return true;
    },

    _onClickCardSmeltLayer: function () {
        cc.log("SmeltLayer _onClickCardSmeltLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._cardSmeltLabelItem.setEnabled(false);
        this._usePillLabelItem.setEnabled(true);

        this.switchLayer(CardSmeltLabel);
    },

    _onClickUsePillLayer: function () {
        cc.log("SmeltLayer _onClickUsePillLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._cardSmeltLabelItem.setEnabled(true);
        this._usePillLabelItem.setEnabled(false);

        this.switchLayer(UsePillLabel);
    },

    backToThisLayer: function () {
        cc.log("SmeltLayer backToThisLayer");

        MainScene.getInstance().switchTo(this);
    },

    switchToCardListLayer: function (cardListLayer) {
        cc.log("SmeltLayer switchToCardListLayer");

        MainScene.getInstance().switchTo(cardListLayer);
    },


    switchLayer: function (runLayer) {
        cc.log("SmeltLayer switchMenu");
        cc.log("this._nowLayer is runLayer " + (this._nowLayer instanceof runLayer));

        if (!(this._nowLayer instanceof runLayer)) {
            if (this._nowLayer != null) this.removeChild(this._nowLayer);
            this._nowLayer = runLayer.create();
            this.addChild(this._nowLayer);
        }
    }

});

SmeltLayer.create = function () {
    cc.log("SmeltLayer create");

    var ret = new SmeltLayer();
    if (ret && ret.init()) {
        return ret;
    }
    return null;
};