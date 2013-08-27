/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午11:52
 * To change this template use File | Settings | File Templates.
 */

/*
 * friend layer
 * */

var FriendLayer = cc.Layer.extend({
    _blessingCountLabel: null,
    _receiveCountLabel: null,

    onEnter: function () {
        cc.log("FriendLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("FriendLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 962));
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon118);
        titleIcon.setPosition(cc.p(360, 1000));
        this.addChild(titleIcon);

        var lineIcon = cc.Sprite.create(main_scene_image.icon18);
        lineIcon.setPosition(cc.p(360, 887));
        this.addChild(lineIcon);

        var blessingCountIcon = cc.LabelTTF.create("今日可送祝福：", "黑体", 22);
        blessingCountIcon.setPosition(cc.p(130, 943));
        this.addChild(blessingCountIcon);

        var receiveCountIcon = cc.LabelTTF.create("今日可领祝福：", "黑体", 22);
        receiveCountIcon.setPosition(cc.p(130, 909));
        this.addChild(receiveCountIcon);

        this._blessingCountLabel = cc.LabelTTF.create("15", "黑体", 22);
        this._blessingCountLabel.setPosition(cc.p(215, 941));
        this.addChild(this._blessingCountLabel);

        this._receiveCountLabel = cc.LabelTTF.create("15", "黑体", 22);
        this._receiveCountLabel.setPosition(cc.p(215, 907));
        this.addChild(this._receiveCountLabel);

        var addFriendItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            this._onClickAddFriend,
            this
        );
        addFriendItem.setPosition(cc.p(600, 926));

        var menu = cc.Menu.create(
            addFriendItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var addFriendIcon = cc.Sprite.create(main_scene_image.icon125);
        addFriendIcon.setPosition(cc.p(600, 926));
        this.addChild(addFriendIcon);



        return true;
    },

    _addFunctionLayer: function() {
        cc.log("FriendLayer _addFunctionLayer");

        this._shyLayer = ShyLayer.create();

        var functionLabel = cc.Sprite.create(main_scene_image.bg16);
        functionLabel.setPosition(cc.p(360, 600));
        this._shyLayer.addChild(functionLabel);

        var sendMessageItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            this._onClickSendMessage,
            this
        );
        sendMessageItem.setPosition(cc.p(600, 926));

        var lineUpItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            this._onClickLineUp,
            this
        );
        lineUpItem.setPosition(cc.p(600, 926));

        var battleItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            this._onClickBattle,
            this
        );
        battleItem.setPosition(cc.p(600, 926));

        var deleteFriendItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            this._onClickDeleteFriend,
            this
        );
        deleteFriendItem.setPosition(cc.p(600, 926));

        var menu = cc.Menu.create(
            sendMessageItem,
            lineUpItem,
            battleItem,
            deleteFriendItem
        );
        menu.setPosition(cc.p(0, 0));
        this._shyLayer.addChild(menu);

        this.addChild(this._shyLayer, 1);
    },

    update: function () {
        cc.log("FriendLayer update");


    },

    _onClickAddFriend: function () {
        cc.log("FriendLayer _onClickAddFriend");

        var shyLayer = ShyLayer.create();
        var tipLabel = cc.Sprite.create(main_scene_image.bg16);
        tipLabel.setPosition(cc.p(360, 600));
        shyLayer.addChild(tipLabel);
        this.addChild(shyLayer, 1);
    },

    _onClickBlessing: function () {
        cc.log("FriendLayer _onClickBlessing");

    },

    _onClickReceive: function () {
        cc.log("FriendLayer _onClickReceive");

    },

    _onClickFriend: function () {
        cc.log("FriendLayer _onClickFriend");


    },

    _onClickSendMessage: function () {
        cc.log("FriendLayer _onClickSendMessage");

    },

    _onClickLineUp: function () {
        cc.log("FriendLayer _onClickLineUp");

    },

    _onClickBattle: function () {
        cc.log("FriendLayer _onClickBattle");

    },

    _onClickDeleteFriend: function () {
        cc.log("FriendLayer _onClickDeleteFriend");

    }
});


FriendLayer.create = function () {
    var res = new FriendLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
};