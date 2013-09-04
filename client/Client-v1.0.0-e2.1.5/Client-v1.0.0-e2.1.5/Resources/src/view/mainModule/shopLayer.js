/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午11:26
 * To change this template use File | Settings | File Templates.
 */


/*
 * shop layer
 * */

var ShopLayer = cc.Layer.extend({
    _nowLayer: null,
    _lotteryLayerItem: null,
    _vipLayerItem: null,
    _propsLayerItem: null,
    _treasureHuntLayerItem: null,

    init: function () {
        cc.log("ShopLayer init");

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

        this._vipLayerItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickVipLayer,
            this
        );
        this._vipLayerItem.setPosition(cc.p(254, 1005));

        this._propsLayerItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickPropsLayer,
            this
        );
        this._propsLayerItem.setPosition(cc.p(404, 1005));

        this._treasureHuntLayerItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickTreasureHuntLayer,
            this
        );
        this._treasureHuntLayerItem.setPosition(cc.p(554, 1005));

        var menu = cc.Menu.create(
            this._lotteryLayerItem,
            this._vipLayerItem,
            this._propsLayerItem,
            this._treasureHuntLayerItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        var lotteryIcon = cc.Sprite.create(main_scene_image.icon103);
        lotteryIcon.setPosition(cc.p(105, 1000));
        this.addChild(lotteryIcon, 2);

        var vipIcon = cc.Sprite.create(main_scene_image.icon158);
        vipIcon.setPosition(cc.p(254, 1000));
        this.addChild(vipIcon, 2);

        var propsIcon = cc.Sprite.create(main_scene_image.icon157);
        propsIcon.setPosition(cc.p(404, 1000));
        this.addChild(propsIcon, 2);

        var treasureHuntIcon = cc.Sprite.create(main_scene_image.icon104);
        treasureHuntIcon.setPosition(cc.p(554, 1005));
        this.addChild(treasureHuntIcon, 2);

        this._onClickLotteryLayer();

        return true;
    },

    _onClickLotteryLayer: function () {
        cc.log("ShopLayer _onClickLotteryLayer");

        this._lotteryLayerItem.setEnabled(false);
        this._vipLayerItem.setEnabled(true);
        this._propsLayerItem.setEnabled(true);
        this._treasureHuntLayerItem.setEnabled(true);

        this.switchLayer(LotteryLayer);
    },

    _onClickVipLayer: function () {
        cc.log("ShopLayer _onClickVipLayer");

        this._lotteryLayerItem.setEnabled(true);
        this._vipLayerItem.setEnabled(false);
        this._propsLayerItem.setEnabled(true);
        this._treasureHuntLayerItem.setEnabled(true);

        this.switchLayer(VipLayer);
    },

    _onClickPropsLayer: function () {
        cc.log("ShopLayer _onClickPropsLayer");

        this._lotteryLayerItem.setEnabled(true);
        this._vipLayerItem.setEnabled(true);
        this._propsLayerItem.setEnabled(false);
        this._treasureHuntLayerItem.setEnabled(true);

        this.switchLayer(PropsLayer);
    },

    _onClickTreasureHuntLayer: function () {
        cc.log("ShopLayer _onClickTreasureHuntLayer");

        this._lotteryLayerItem.setEnabled(true);
        this._vipLayerItem.setEnabled(true);
        this._propsLayerItem.setEnabled(true);
        this._treasureHuntLayerItem.setEnabled(false);

        this.switchLayer(TreasureHuntLayer);
    },

    switchLayer: function (runLayer) {
        cc.log("ShopLayer switchMenu");
        cc.log("this._nowLayer is runLayer " + (this._nowLayer instanceof runLayer));

        if (!(this._nowLayer instanceof runLayer)) {
            if (this._nowLayer != null) this.removeChild(this._nowLayer);
            this._nowLayer = runLayer.create();
            this.addChild(this._nowLayer);
        }
    }
});

ShopLayer.create = function () {
    var ret = new ShopLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};