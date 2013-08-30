/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午11:53
 * To change this template use File | Settings | File Templates.
 */


/*
 * message layer
 * */

var MessageLayer = cc.Layer.extend({
    _nowLayer: null,
    _battleMessageLayerItem: null,
    _friendMessageLayerItem: null,
    _systemMessageLayerItem: null,

    init: function () {
        cc.log("MessageLayer init");

        if (!this._super()) return false;

        var headIcon = cc.Sprite.create(main_scene_image.icon1);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 962));
        this.addChild(headIcon);

        this._battleMessageLayerItem = cc.MenuItemImage.create(
            main_scene_image.button22,
            main_scene_image.button22s,
            main_scene_image.button22d,
            this._onClickBattleMessageLayer,
            this
        );
        this._battleMessageLayerItem.setPosition(cc.p(111, 1005));

        this._friendMessageLayerItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickFriendMessageLayer,
            this
        );
        this._friendMessageLayerItem.setPosition(cc.p(254, 1005));

        this._systemMessageLayerItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickSystemMessageLayer,
            this
        );
        this._systemMessageLayerItem.setPosition(cc.p(395, 1005));

        var menu = cc.Menu.create(
            this._battleMessageLayerItem,
            this._friendMessageLayerItem,
            this._systemMessageLayerItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        var battleMessageIcon = cc.Sprite.create(main_scene_image.icon128);
        battleMessageIcon.setPosition(cc.p(105, 1000));
        this.addChild(battleMessageIcon, 2);

        var friendMessageIcon = cc.Sprite.create(main_scene_image.icon129);
        friendMessageIcon.setPosition(cc.p(254, 1000));
        this.addChild(friendMessageIcon, 2);

        var systemMessageIcon = cc.Sprite.create(main_scene_image.icon130);
        systemMessageIcon.setPosition(cc.p(395, 1000));
        this.addChild(systemMessageIcon, 2);

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        this._onClickBattleMessageLayer();

        return true;
    },

    _onClickBattleMessageLayer: function () {
        cc.log("MessageLayer _onClickBattleMessageLayer");

        this._battleMessageLayerItem.setEnabled(false);
        this._friendMessageLayerItem.setEnabled(true);
        this._systemMessageLayerItem.setEnabled(true);

        this.switchLayer(BattleMessageLayer);
    },

    _onClickFriendMessageLayer: function () {
        cc.log("MessageLayer _onClickFriendMessageLayer");

        this._battleMessageLayerItem.setEnabled(true);
        this._friendMessageLayerItem.setEnabled(false);
        this._systemMessageLayerItem.setEnabled(true);

        this.switchLayer(FriendMessageLayer);
    },

    _onClickSystemMessageLayer: function () {
        cc.log("MessageLayer _onClickSystemMessageLayer");

        this._battleMessageLayerItem.setEnabled(true);
        this._friendMessageLayerItem.setEnabled(true);
        this._systemMessageLayerItem.setEnabled(false);

        this.switchLayer(SystemMessageLayer);
    },

    switchLayer: function (runLayer) {
        cc.log("MessageLayer switchMenu");
        cc.log("this._nowLayer is runLayer " + (this._nowLayer instanceof runLayer));

        if (!(this._nowLayer instanceof runLayer)) {
            if (this._nowLayer != null) this.removeChild(this._nowLayer);
            this._nowLayer = runLayer.create();
            this.addChild(this._nowLayer);
        }
    }
});

MessageLayer.create = function () {
    var res = new MessageLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
};