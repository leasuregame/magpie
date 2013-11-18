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

    init: function () {
        cc.log("PveLayer init");

        if (!this._super()) return false;

        var headIcon = cc.Sprite.create(main_scene_image.icon1);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 962));
        this.addChild(headIcon);

        this._taskLayerItem = cc.MenuItemImage.create(
            main_scene_image.button22,
            main_scene_image.button22s,
            main_scene_image.button22d,
            this._onClickTaskLayer,
            this
        );
        this._taskLayerItem.setPosition(cc.p(111, 1005));

        this._passLayerItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickPassLayer,
            this
        );
        this._passLayerItem.setPosition(cc.p(254, 1005));

        var menu = cc.Menu.create(this._taskLayerItem, this._passLayerItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var taskIcon = cc.Sprite.create(main_scene_image.icon16);
        taskIcon.setPosition(cc.p(105, 1000));
        this.addChild(taskIcon);

        var passIcon = cc.Sprite.create(main_scene_image.icon17);
        passIcon.setPosition(cc.p(254, 1000));
        this.addChild(passIcon);

        this._onClickTaskLayer();

        return true;
    },

    _onClickTaskLayer: function () {
        cc.log("PveLayer _onClickTaskLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._taskLayerItem.setEnabled(false);
        this._passLayerItem.setEnabled(true);
        this.switchLayer(TaskLayer);
    },

    _onClickPassLayer: function () {
        cc.log("PveLayer _onClickPassLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._taskLayerItem.setEnabled(true);
        this._passLayerItem.setEnabled(false);
        this.switchLayer(PassLayer);
    },

    switchLayer: function (runLayer) {
        cc.log("PveLayer switchLayer");
        cc.log("this._nowLayer is runLayer " + (this._nowLayer instanceof runLayer));

        if (!(this._nowLayer instanceof runLayer)) {
            if (this._nowLayer != null) this.removeChild(this._nowLayer);
            this._nowLayer = runLayer.create();
            this.addChild(this._nowLayer);
        }
    }
});

PveLayer.create = function () {
    var ret = new PveLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};