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
    _shopLayerFit: null,

    _nowLayer: null,
    _vipLayerItem: null,
    _propsLayerItem: null,

    onEnter: function () {
        cc.log("ShopLayer onEnter");

        this._super();

        lz.um.beginLogPageView("商城界面");
    },

    onExit: function () {
        cc.log("ShopLayer onExit");

        this._super();

        lz.um.endLogPageView("商城界面");
    },

    init: function () {
        cc.log("ShopLayer init");

        if (!this._super()) return false;

        this._shopLayerFit = gameFit.mainScene.shopLayer;

        var headIcon = cc.Sprite.create(main_scene_image.icon1);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._shopLayerFit.headIconPoint);
        this.addChild(headIcon, 1);

        this._vipLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            main_scene_image.icon158,
            this._onClickVipLayer,
            this
        );
        this._vipLayerItem.setPosition(this._shopLayerFit.vipLayerItemPoint);
        this._vipLayerItem.setOffset(cc.p(0, -5));

        this._propsLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button22,
            main_scene_image.button22s,
            main_scene_image.button22d,
            main_scene_image.icon157,
            this._onClickPropsLayer,
            this
        );
        this._propsLayerItem.setPosition(this._shopLayerFit.propsLayerItemPoint);
        this._propsLayerItem.setOffset(cc.p(-6, -5));

        var menu = cc.Menu.create(
            this._vipLayerItem,
            this._propsLayerItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        this._vipLayerItem.setEnabled(true);
        this._propsLayerItem.setEnabled(false);
        this.switchLayer(PropsLayer);

        return true;
    },

    _onClickVipLayer: function () {
        cc.log("ShopLayer _onClickVipLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._vipLayerItem.setEnabled(false);
        this._propsLayerItem.setEnabled(true);

        this.switchLayer(VipLayer);
    },

    _onClickPropsLayer: function () {
        cc.log("ShopLayer _onClickPropsLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._vipLayerItem.setEnabled(true);
        this._propsLayerItem.setEnabled(false);

        this.switchLayer(PropsLayer);
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