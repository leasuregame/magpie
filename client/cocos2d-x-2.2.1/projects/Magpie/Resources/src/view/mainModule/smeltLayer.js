/**
 * Created by lujunyu on 14-5-20.
 */

var SmeltLayer = cc.Layer.extend({
    smeltLayerFit: null,

    onEnter: function () {
        cc.log("SmeltLayer onEnter");

        this._super();
        this.updateGuide();
    },

    onExit: function () {
        cc.log("SmeltLayer onExit");

        this._super();
    },

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

        if (gameData.player.get("lv") < outputTables.function_limit.rows[1].card_smelt) {
            this._cardSmeltLabelItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button22h,
                main_scene_image.button22h,
                main_scene_image.button22h,
                main_scene_image.icon457,
                this._onClickCardSmeltLayer,
                this
            );
        } else {
            this._cardSmeltLabelItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button22,
                main_scene_image.button22s,
                main_scene_image.button22d,
                main_scene_image.icon457,
                this._onClickCardSmeltLayer,
                this
            );
        }
        this._cardSmeltLabelItem.setPosition(this._smeltLayerFit.cardSmeltLayerItemPoint);
        this._cardSmeltLabelItem.setOffset(cc.p(0, -5));

        if (gameData.player.get("lv") < outputTables.function_limit.rows[1].use_pill) {
            this._usePillLabelItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button23h,
                main_scene_image.button23h,
                main_scene_image.button23h,
                main_scene_image.icon458,
                this._onClickUsePillLayer,
                this
            );
        } else {
            this._usePillLabelItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button23,
                main_scene_image.button23s,
                main_scene_image.button23d,
                main_scene_image.icon458,
                this._onClickUsePillLayer,
                this
            );
        }
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
        this._switchLabel(CardSmeltLabel);

        this.retain();

        return true;
    },

    updateGuide: function () {
        cc.log("SmeltLayer updateGuide");

        if (gameGuide.get("usePillGuide") && !this._usePillGuide) {
            this._usePillGuide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._usePillGuide.setPosition(this._smeltLayerFit.usePillLayerItemPoint);
            this.addChild(this._usePillGuide, 2);
        }
    },

    _onClickCardSmeltLayer: function () {
        cc.log("SmeltLayer _onClickCardSmeltLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._switchLabel(CardSmeltLabel)) {
            this._cardSmeltLabelItem.setEnabled(false);
            this._usePillLabelItem.setEnabled(true);
        }
    },

    _onClickUsePillLayer: function () {
        cc.log("SmeltLayer _onClickUsePillLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._usePillGuide) {
            this._usePillGuide.removeFromParent();
            this._usePillGuide = null;
            gameGuide.set("usePillGuide", false);
        }

        if (this._switchLabel(UsePillLabel)) {
            this._cardSmeltLabelItem.setEnabled(true);
            this._usePillLabelItem.setEnabled(false);
        }
    },

    switchToCardListLayer: function (cardListLayer) {
        cc.log("SmeltLayer switchToCardListLayer");

        this.stopAllActions();
        MainScene.getInstance().switchTo(cardListLayer);
    },

    backToThisLayer: function () {
        cc.log("SmeltLayer backToThisLayer");

        MainScene.getInstance().switchTo(this);
    },

    _switchLabel: function (runLabel) {
        if (runLabel.canEnter && !runLabel.canEnter()) {
            return false;
        }

        if (!(this._nowLayer instanceof runLabel)) {
            if (this._nowLabel != null) this.removeChild(this._nowLabel);
            this._nowLabel = runLabel.create();
            this.addChild(this._nowLabel);
        }

        return true;
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

SmeltLayer.canEnter = function () {

    var limitLv = outputTables.function_limit.rows[1].card_smelt;
    var lv = gameData.player.get("lv");

    if (lv >= limitLv) {
        return true;
    }

    TipLayer.tip("觉醒功能" + limitLv + "级开放");

    return false;
};