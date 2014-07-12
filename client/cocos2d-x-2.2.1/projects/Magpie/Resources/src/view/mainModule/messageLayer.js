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
    _friendMessageMark: null,
    _systemMessageMark: null,

    onEnter: function () {
        cc.log("MessageLayer onEnter");

        this._super();
        this.updateMark();

        lz.um.beginLogPageView("消息界面");
    },

    onExit: function () {
        cc.log("MessageLayer onExit");

        this._super();

        lz.um.endLogPageView("消息界面");
    },

    init: function () {
        cc.log("MessageLayer init");

        if (!this._super()) return false;

        this._messageLayerFit = gameFit.mainScene.messageLayer;

        var headIcon = cc.Sprite.create(main_scene_image.icon1);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._messageLayerFit.headIconPoint);
        this.addChild(headIcon, 1);

        this._battleMessageLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button22,
            main_scene_image.button22s,
            main_scene_image.button22d,
            main_scene_image.icon128,
            this._onClickBattleMessageLayer,
            this
        );
        this._battleMessageLayerItem.setPosition(this._messageLayerFit.battleMessageLayerItemPoint);
        this._battleMessageLayerItem.setOffset(cc.p(-7, -2));

        this._friendMessageLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            main_scene_image.icon129,
            this._onClickFriendMessageLayer,
            this
        );
        this._friendMessageLayerItem.setPosition(this._messageLayerFit.friendMessageLayerItemPoint);
        this._friendMessageLayerItem.setOffset(cc.p(0, -2));

        this._friendMessageMark = cc.BuilderReader.load(main_scene_image.uiEffect34, this);
        this._friendMessageMark.setPosition(cc.p(125, 50));
        this._friendMessageMark.setVisible(false);
        this._friendMessageLayerItem.addChild(this._friendMessageMark, 3);

        this._systemMessageLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            main_scene_image.icon130,
            this._onClickSystemMessageLayer,
            this
        );
        this._systemMessageLayerItem.setPosition(this._messageLayerFit.systemMessageLayerItemPoint);
        this._systemMessageLayerItem.setOffset(cc.p(0, -2));

        this._systemMessageMark = cc.BuilderReader.load(main_scene_image.uiEffect34, this);
        this._systemMessageMark.setPosition(cc.p(125, 50));
        this._systemMessageMark.setVisible(false);
        this._systemMessageLayerItem.addChild(this._systemMessageMark, 3);

        var menu = cc.Menu.create(
            this._battleMessageLayerItem,
            this._friendMessageLayerItem,
            this._systemMessageLayerItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);


        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._messageLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        this._battleMessageLayerItem.setEnabled(false);
        this._friendMessageLayerItem.setEnabled(true);
        this._systemMessageLayerItem.setEnabled(true);
        this.switchLayer(BattleMessageLayer);

        return true;
    },

    _onClickBattleMessageLayer: function () {
        cc.log("MessageLayer _onClickBattleMessageLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._battleMessageLayerItem.setEnabled(false);
        this._friendMessageLayerItem.setEnabled(true);
        this._systemMessageLayerItem.setEnabled(true);

        this.switchLayer(BattleMessageLayer);
    },

    _onClickFriendMessageLayer: function () {
        cc.log("MessageLayer _onClickFriendMessageLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._battleMessageLayerItem.setEnabled(true);
        this._friendMessageLayerItem.setEnabled(false);
        this._systemMessageLayerItem.setEnabled(true);

        this.switchLayer(FriendMessageLayer);
    },

    _onClickSystemMessageLayer: function () {
        cc.log("MessageLayer _onClickSystemMessageLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

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
    },

    updateMark: function () {
        cc.log("MessageLayer updateMark");
        this._friendMessageMark.setVisible(gameMark.getFriendMessageMark());
        this._systemMessageMark.setVisible(gameMark.getSystemMessageMark());

    }
});

MessageLayer.create = function () {
    var res = new MessageLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
};