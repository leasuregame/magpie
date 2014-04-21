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

        lz.um.beginLogPageView("进阶界面");
    },

    onExit: function () {
        cc.log("EvolutionLayer onExit");

        this._super();

        lz.um.endLogPageView("进阶界面");
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

        if (gameData.player.get("lv") < outputTables.function_limit.rows[1].skill_upgrade) {
            this._skillUpgradeItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button22h,
                main_scene_image.button22h,
                main_scene_image.button22h,
                main_scene_image.icon46,
                this._onClickSkillUpgrade,
                this
            );
        } else {
            this._skillUpgradeItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button22,
                main_scene_image.button22s,
                main_scene_image.button22d,
                main_scene_image.icon46,
                this._onClickSkillUpgrade,
                this
            );
        }
        this._skillUpgradeItem.setPosition(this._evolutionLayerFit.skillUpgradeItemPoint);
        this._skillUpgradeItem.setOffset(this._evolutionLayerFit.skillUpgradeItemOffset);

        if (gameData.player.get("lv") < outputTables.function_limit.rows[1].pass_skillafresh) {
            this._passiveSkillUpgradeItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button23h,
                main_scene_image.button23h,
                main_scene_image.button23h,
                main_scene_image.icon47,
                this._onClickPassiveSkillUpgrade,
                this
            );
        } else {
            this._passiveSkillUpgradeItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button23,
                main_scene_image.button23s,
                main_scene_image.button23d,
                main_scene_image.icon47,
                this._onClickPassiveSkillUpgrade,
                this
            );
        }
        this._passiveSkillUpgradeItem.setPosition(this._evolutionLayerFit.passiveSkillUpgradeItemPoint);
        this._passiveSkillUpgradeItem.setOffset(this._evolutionLayerFit.passiveSkillUpgradeItemOffset);

        var menu = cc.Menu.create(
            this._skillUpgradeItem,
            this._passiveSkillUpgradeItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._skillUpgradeItem.setEnabled(false);
        this._passiveSkillUpgradeItem.setEnabled(true);
        this._switchLabel(SkillUpgradeLabel);

        this.retain();

        return true;
    },

    switchToCardListLayer: function (cardListLayer) {
        cc.log("EvolutionLayer switchToCardListLayer");

        MainScene.getInstance().switchTo(cardListLayer);
    },

    backToThisLayer: function () {
        cc.log("EvolutionLayer backToThisLayer");

        MainScene.getInstance().switchTo(this);
    },

    _onClickSkillUpgrade: function () {
        cc.log("StrengthenLayer _onClickSkillUpgrade");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._skillUpgradeItem.setEnabled(false);
        this._passiveSkillUpgradeItem.setEnabled(true);

        this._switchLabel(SkillUpgradeLabel);

        if (mandatoryTeachingLayer) {
            if (mandatoryTeachingLayer.isTeaching()) {
                mandatoryTeachingLayer.clearAndSave();
                mandatoryTeachingLayer.next();
            }
        }
    },

    _onClickPassiveSkillUpgrade: function () {
        cc.log("EvolutionLayer _onClickCardEvolution");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._switchLabel(PassiveSkillAfreshLabel)) {
            this._skillUpgradeItem.setEnabled(true);
            this._passiveSkillUpgradeItem.setEnabled(false);
        }

        if (mandatoryTeachingLayer) {
            if (mandatoryTeachingLayer.isTeaching()) {
                mandatoryTeachingLayer.clearAndSave();
                mandatoryTeachingLayer.next();
            }
        }
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


EvolutionLayer.create = function () {
    var ret = new EvolutionLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};

EvolutionLayer.canEnter = function () {
    var limitLv = outputTables.function_limit.rows[1].skill_upgrade;
    var lv = gameData.player.get("lv");

    if (lv >= limitLv) {
        return true;
    }

    TipLayer.tip("技能培养" + limitLv + "级开放");

    return false;
};