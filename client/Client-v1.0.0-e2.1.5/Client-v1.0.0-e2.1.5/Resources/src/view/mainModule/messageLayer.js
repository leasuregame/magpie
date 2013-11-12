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
    _messageLayerFit: null,

    _nowLayer: null,
    _battleMessageLayerItem: null,
    _friendMessageLayerItem: null,
    _systemMessageLayerItem: null,

    init: function () {
        cc.log("MessageLayer init");

        if (!this._super()) return false;

        this._messageLayerFit = gameFit.mainScene.messageLayer;

        var headIcon = cc.Sprite.create(main_scene_image.icon1);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._messageLayerFit.headIconPoint);
        this.addChild(headIcon);

        this._battleMessageLayerItem = cc.MenuItemImage.create(
            main_scene_image.button22,
            main_scene_image.button22s,
            main_scene_image.button22d,
            this._onClickBattleMessageLayer,
            this
        );
        this._battleMessageLayerItem.setPosition(this._messageLayerFit.battleMessageLayerItemPoint);

        this._friendMessageLayerItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickFriendMessageLayer,
            this
        );
        this._friendMessageLayerItem.setPosition(this._messageLayerFit.friendMessageLayerItemPoint);

        this._systemMessageLayerItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickSystemMessageLayer,
            this
        );
        this._systemMessageLayerItem.setPosition(this._messageLayerFit.systemMessageLayerItemPoint);

        var menu = cc.Menu.create(
            this._battleMessageLayerItem,
            this._friendMessageLayerItem,
            this._systemMessageLayerItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        var battleMessageIcon = cc.Sprite.create(main_scene_image.icon128);
        battleMessageIcon.setPosition(this._messageLayerFit.battleMessageIconPoint);
        this.addChild(battleMessageIcon, 2);

        var friendMessageIcon = cc.Sprite.create(main_scene_image.icon129);
        friendMessageIcon.setPosition(this._messageLayerFit.friendMessageIconPoint);
        this.addChild(friendMessageIcon, 2);

        var systemMessageIcon = cc.Sprite.create(main_scene_image.icon130);
        systemMessageIcon.setPosition(this._messageLayerFit.systemMessageIconPoint);
        this.addChild(systemMessageIcon, 2);

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._messageLayerFit.bgSpritePoint);
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