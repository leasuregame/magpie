/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-16
 * Time: 下午4:28
 * To change this template use File | Settings | File Templates.
 */


/*
 * pve layer
 * */


var PveLayer = cc.Layer.extend({
    _nowLayer: null,
    _taskLayerItem: null,
    _passLayerItem: null,
    _taskStrLabel1: null,
    _taskStrLabel2: null,
    _passStrLabel1: null,
    _passStrLabel2: null,

    init: function () {
        cc.log("PveLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg4);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 936));
        this.addChild(bgSprite, 1);

        this._taskLayerItem = cc.MenuItemImage.create(main_scene_image.button12, main_scene_image.button12s, main_scene_image.button12d, this._onClickTaskLayer, this);
        this._taskLayerItem.setPosition(cc.p(100, 972));

        this._passLayerItem = cc.MenuItemImage.create(main_scene_image.button12, main_scene_image.button12s, main_scene_image.button12d, this._onClickPassLayer, this);
        this._passLayerItem.setPosition(cc.p(250, 972));

        var menu = cc.Menu.create(this._taskLayerItem, this._passLayerItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

//        this._taskStrLabel1 = cc.Sprite.create();
//        this._taskStrLabel1.setPosition();
//        this.addChild();
//
//        this._taskStrLabel2 = cc.Sprite.create();
//        this._taskStrLabel2.setPosition();
//        this.addChild();
//
//        this._passStrLabel1 = cc.Sprite.create();
//        this._passStrLabel1.setPosition();
//        this.addChild();
//
//        this._passStrLabel2 = cc.Sprite.create();
//        this._passStrLabel2.setPosition();
//        this.addChild();

        this._onClickTaskLayer();

        return true;
    },

    _onClickTaskLayer: function () {
        cc.log("PveLayer _onClickTaskLayer");

        this._taskLayerItem.setEnabled(false);
        this._passLayerItem.setEnabled(true);
        this.switchLayer(TaskLayer);
    },

    _onClickPassLayer: function () {
        cc.log("PveLayer _onClickPassLayer");

        this._taskLayerItem.setEnabled(true);
        this._passLayerItem.setEnabled(false);
        this.switchLayer(PassLayer);
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
})

PveLayer.create = function () {
    var ret = new PveLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}