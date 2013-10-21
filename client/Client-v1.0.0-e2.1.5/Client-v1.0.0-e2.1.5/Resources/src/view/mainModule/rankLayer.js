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
    _nowLayer: null,
    _abilityRankLayerItem: null,
    _lvRankLayerItem: null,
    _passRankLayerItem: null,
    _tournamentRankLayerItem: null,

    init: function () {
        cc.log("RankLayer init");

        if (!this._super()) return false;

        var headIcon = cc.Sprite.create(main_scene_image.icon1);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 962));
        this.addChild(headIcon);

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        this._abilityRankLayerItem = cc.MenuItemImage.create(
            main_scene_image.button22,
            main_scene_image.button22s,
            main_scene_image.button22d,
            this._onClickAbilityRankLayer,
            this
        );
        this._abilityRankLayerItem.setPosition(cc.p(111, 1005));

        this._lvRankLayerItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickLvRankLayer,
            this
        );
        this._lvRankLayerItem.setPosition(cc.p(254, 1005));

        this._passRankLayerItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickPassRankLayer,
            this
        );
        this._passRankLayerItem.setPosition(cc.p(404, 1005));

        this._tournamentRankLayerItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickTournamentRankLayer,
            this
        );
        this._tournamentRankLayerItem.setPosition(cc.p(554, 1005));

        var menu = cc.Menu.create(
            this._abilityRankLayerItem,
            this._lvRankLayerItem,
            this._passRankLayerItem,
            this._tournamentRankLayerItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        var abilityRankIcon = cc.Sprite.create(main_scene_image.icon196);
        abilityRankIcon.setPosition(cc.p(105, 1000));
        this.addChild(abilityRankIcon, 2);

        var lvRankIcon = cc.Sprite.create(main_scene_image.icon197);
        lvRankIcon.setPosition(cc.p(254, 1000));
        this.addChild(lvRankIcon, 2);

        var passRankIcon = cc.Sprite.create(main_scene_image.icon198);
        passRankIcon.setPosition(cc.p(404, 1000));
        this.addChild(passRankIcon, 2);

        var tournamentRankIcon = cc.Sprite.create(main_scene_image.icon199);
        tournamentRankIcon.setPosition(cc.p(554, 1000));
        this.addChild(tournamentRankIcon, 2);

        this._onClickAbilityRankLayer();

        return true;
    },

    _onClickAbilityRankLayer: function () {
        cc.log("RankLayer _onClickAbilityRankLayer");

        this._abilityRankLayerItem.setEnabled(false);
        this._lvRankLayerItem.setEnabled(true);
        this._passRankLayerItem.setEnabled(true);
        this._tournamentRankLayerItem.setEnabled(true);

        this.switchLayer(AbilityRankLayer);
    },

    _onClickLvRankLayer: function () {
        cc.log("RankLayer _onClickLvRankLayer");

        this._abilityRankLayerItem.setEnabled(true);
        this._lvRankLayerItem.setEnabled(false);
        this._passRankLayerItem.setEnabled(true);
        this._tournamentRankLayerItem.setEnabled(true);

        this.switchLayer(LvRankLayer);
    },

    _onClickPassRankLayer: function () {
        cc.log("RankLayer _onClickPassRankLayer");

        this._abilityRankLayerItem.setEnabled(true);
        this._lvRankLayerItem.setEnabled(true);
        this._passRankLayerItem.setEnabled(false);
        this._tournamentRankLayerItem.setEnabled(true);

        this.switchLayer(PassRankLayer);
    },

    _onClickTournamentRankLayer: function () {
        cc.log("RankLayer _onClickTournamentRankLayer");

        this._abilityRankLayerItem.setEnabled(true);
        this._lvRankLayerItem.setEnabled(true);
        this._passRankLayerItem.setEnabled(true);
        this._tournamentRankLayerItem.setEnabled(false);

        this.switchLayer(TournamentRankLayer);
    },

    switchLayer: function (runLayer) {
        cc.log("PveLayer switchMenu");
        cc.log("this._nowLayer is runLayer " + (this._nowLayer instanceof runLayer));

        if (!(this._nowLayer instanceof runLayer)) {
            if (this._nowLayer != null) this.removeChild(this._nowLayer);
            this._nowLayer = runLayer.create();
            this.addChild(this._nowLayer);
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
};