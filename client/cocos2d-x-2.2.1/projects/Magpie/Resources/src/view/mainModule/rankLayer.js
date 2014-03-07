/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-18
 * Time: 下午12:00
 * To change this template use File | Settings | File Templates.
 */


/*
 * ranking layer
 * */


var RankLayer = cc.Layer.extend({
    _rankLayerFit: null,

    _nowLayer: null,
    _abilityRankLayerItem: null,
    _lvRankLayerItem: null,
    _passRankLayerItem: null,
    _tournamentRankLayerItem: null,

    onEnter: function () {
        cc.log("RankLayer onEnter");

        this._super();

        lz.um.beginLogPageView("排行榜界面");
    },

    onExit: function () {
        cc.log("RankLayer onExit");

        this._super();

        lz.um.endLogPageView("排行榜界面");
    },

    init: function () {
        cc.log("RankLayer init");

        if (!this._super()) return false;

        this._rankLayerFit = gameFit.mainScene.rankLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._rankLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon1);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._rankLayerFit.headIconPoint);
        this.addChild(headIcon);

        this._abilityRankLayerItem = cc.MenuItemImage.create(
            main_scene_image.button22,
            main_scene_image.button22s,
            main_scene_image.button22d,
            this._onClickAbilityRankLayer,
            this
        );
        this._abilityRankLayerItem.setPosition(this._rankLayerFit.abilityRankLayerItemPoint);

        this._lvRankLayerItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickLvRankLayer,
            this
        );
        this._lvRankLayerItem.setPosition(this._rankLayerFit.lvRankLayerItemPoint);

        this._passRankLayerItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickPassRankLayer,
            this
        );
        this._passRankLayerItem.setPosition(this._rankLayerFit.passRankLayerItemPoint);

        var menu = cc.Menu.create(
            this._abilityRankLayerItem,
            this._lvRankLayerItem,
            this._passRankLayerItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 0);

        var abilityRankIcon = cc.Sprite.create(main_scene_image.icon196);
        abilityRankIcon.setPosition(this._rankLayerFit.abilityRankIconPoint);
        this.addChild(abilityRankIcon, 1);

        var lvRankIcon = cc.Sprite.create(main_scene_image.icon197);
        lvRankIcon.setPosition(this._rankLayerFit.lvRankIconPoint);
        this.addChild(lvRankIcon, 1);

        var passRankIcon = cc.Sprite.create(main_scene_image.icon198);
        passRankIcon.setPosition(this._rankLayerFit.passRankIconPoint);
        this.addChild(passRankIcon, 1);

        this._abilityRankLayerItem.setEnabled(false);
        this._lvRankLayerItem.setEnabled(true);
        this._passRankLayerItem.setEnabled(true);
        this.switchLayer(AbilityRankLayer);

        return true;
    },

    _onClickAbilityRankLayer: function () {
        cc.log("RankLayer _onClickAbilityRankLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._abilityRankLayerItem.setEnabled(false);
        this._lvRankLayerItem.setEnabled(true);
        this._passRankLayerItem.setEnabled(true);

        this.switchLayer(AbilityRankLayer);
    },

    _onClickLvRankLayer: function () {
        cc.log("RankLayer _onClickLvRankLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._abilityRankLayerItem.setEnabled(true);
        this._lvRankLayerItem.setEnabled(false);
        this._passRankLayerItem.setEnabled(true);

        this.switchLayer(LvRankLayer);
    },

    _onClickPassRankLayer: function () {
        cc.log("RankLayer _onClickPassRankLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._abilityRankLayerItem.setEnabled(true);
        this._lvRankLayerItem.setEnabled(true);
        this._passRankLayerItem.setEnabled(false);

        this.switchLayer(PassRankLayer);
    },

    switchLayer: function (runLayer) {
        cc.log("RankLayer switchMenu");
        cc.log("this._nowLayer is runLayer " + (this._nowLayer instanceof runLayer));

        if (!(this._nowLayer instanceof runLayer)) {
            if (this._nowLayer != null) this.removeChild(this._nowLayer);
            this._nowLayer = runLayer.create();
            this.addChild(this._nowLayer, 1);
        }
    }
});


RankLayer.create = function () {
    var ret = new RankLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};

RankLayer.canEnter = function () {
    var limitLv = outputTables.function_limit.rows[1].ranking_list;
    var lv = gameData.player.get("lv");

    if (lv >= limitLv) {
        return true;
    }

    TipLayer.tip("排行榜" + limitLv + "级开放");

    return false;
};