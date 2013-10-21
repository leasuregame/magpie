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
    _vipLayerItem: null,
    _propsLayerItem: null,

    init: function () {
        cc.log("ShopLayer init");

        if (!this._super()) return false;

        var headIcon = cc.Sprite.create(main_scene_image.icon1);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 962));
        this.addChild(headIcon);

        this._vipLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button22,
            main_scene_image.button22s,
            main_scene_image.button22d,
            main_scene_image.icon158,
            this._onClickVipLayer,
            this
        );
        this._vipLayerItem.setPosition(cc.p(111, 1005));
        this._vipLayerItem.setOffset(cc.p(-6, -5));

        this._propsLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            main_scene_image.icon157,
            this._onClickPropsLayer,
            this
        );
        this._propsLayerItem.setPosition(cc.p(254, 1005));
        this._propsLayerItem.setOffset(cc.p(0, -5));

        var menu = cc.Menu.create(
            this._vipLayerItem,
            this._propsLayerItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        this._onClickVipLayer();

        return true;
    },

    _onClickVipLayer: function () {
        cc.log("ShopLayer _onClickVipLayer");

        this._vipLayerItem.setEnabled(false);
        this._propsLayerItem.setEnabled(true);

        this.switchLayer(VipLayer);
    },

    _onClickPropsLayer: function () {
        cc.log("ShopLayer _onClickPropsLayer");

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