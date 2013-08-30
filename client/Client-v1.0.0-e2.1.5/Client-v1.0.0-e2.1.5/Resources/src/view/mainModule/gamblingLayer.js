/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-21
 * Time: 下午3:36
 * To change this template use File | Settings | File Templates.
 */


/*
 * gambling layer
 * */


var GamblingLayer = cc.Layer.extend({
    _nowLayer: null,
    _lotteryLayerItem: null,
    _treasureHuntLayerItem: null,

    init: function () {
        cc.log("GamblingLayer init");

        if (!this._super()) return false;

        var headIcon = cc.Sprite.create(main_scene_image.icon1);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 962));
        this.addChild(headIcon);

        this._lotteryLayerItem = cc.MenuItemImage.create(
            main_scene_image.button22,
            main_scene_image.button22s,
            main_scene_image.button22d,
            this._onClickLotteryLayer,
            this
        );
        this._lotteryLayerItem.setPosition(cc.p(111, 1005));

        this._treasureHuntLayerItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickTreasureHuntLayer,
            this
        );
        this._treasureHuntLayerItem.setPosition(cc.p(254, 1005));

        var menu = cc.Menu.create(this._lotteryLayerItem, this._treasureHuntLayerItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        var lotteryIcon = cc.Sprite.create(main_scene_image.icon103);
        lotteryIcon.setPosition(cc.p(105, 1000));
        this.addChild(lotteryIcon, 2);

        var treasureHuntIcon = cc.Sprite.create(main_scene_image.icon104);
        treasureHuntIcon.setPosition(cc.p(254, 1000));
        this.addChild(treasureHuntIcon, 2);

        this._onClickLotteryLayer();

        return true;
    },

    _onClickLotteryLayer: function () {
        cc.log("GamblingLayer _onClickLotteryLayer");

        this._lotteryLayerItem.setEnabled(false);
        this._treasureHuntLayerItem.setEnabled(true);
        this.switchLayer(LotteryLayer);
    },

    _onClickTreasureHuntLayer: function () {
        cc.log("GamblingLayer _onClickTreasureHuntLayer");

        this._lotteryLayerItem.setEnabled(true);
        this._treasureHuntLayerItem.setEnabled(false);
        this.switchLayer(TreasureHuntLayer);
    },

    switchLayer: function (runLayer) {
        cc.log("GamblingLayer switchMenu");
        cc.log("this._nowLayer is runLayer " + (this._nowLayer instanceof runLayer));

        if (!(this._nowLayer instanceof runLayer)) {
            if (this._nowLayer != null) this.removeChild(this._nowLayer);
            this._nowLayer = runLayer.create();
            this.addChild(this._nowLayer);
        }
    }
});

GamblingLayer.create = function () {
    var ret = new GamblingLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};