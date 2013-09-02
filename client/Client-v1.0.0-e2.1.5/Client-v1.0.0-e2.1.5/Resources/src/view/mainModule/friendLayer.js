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
    _selectFriendId: 0,
    _giveBlessCountLabel: null,
    _receiveBlessCountLabel: null,
    _friendCountLabel: null,
    _maxFriendCountLabel: null,
    _shyLayer: null,
    _addFriendLayer: null,
    _nameEditBox: null,
    _scrollView: null,
    _scrollViewElement: {},

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

        this._giveBlessCountLabel = cc.LabelTTF.create("15", "黑体", 22);
        this._giveBlessCountLabel.setPosition(cc.p(215, 941));
        this.addChild(this._giveBlessCountLabel);

        this._receiveBlessCountLabel = cc.LabelTTF.create("15", "黑体", 22);
        this._receiveBlessCountLabel.setPosition(cc.p(215, 907));
        this.addChild(this._receiveBlessCountLabel);

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

        var friendCountIcon = cc.Sprite.create(main_scene_image.icon117);
        friendCountIcon.setPosition(cc.p(565, 227));
        this.addChild(friendCountIcon);

        var slashIcon = cc.LabelTTF.create("/", "黑体", 22);
        slashIcon.setPosition(cc.p(565, 227));
        this.addChild(slashIcon);

        this._friendCountLabel = cc.LabelTTF.create("0", "黑体", 22);
        this._friendCountLabel.setAnchorPoint(cc.p(1, 0.5));
        this._friendCountLabel.setPosition(cc.p(550, 227));
        this.addChild(this._friendCountLabel);

        this._maxFriendCountLabel = cc.LabelTTF.create("0", "黑体", 22);
        this._maxFriendCountLabel.setAnchorPoint(cc.p(0, 0.5));
        this._maxFriendCountLabel.setPosition(cc.p(580, 227));
        this.addChild(this._maxFriendCountLabel);

        this._addAddFriendLayer();
        this._addFunctionLayer();

        return true;
    },

    _addFunctionLayer: function () {
        cc.log("FriendLayer _addFunctionLayer");

        var that = this;
        this._shyLayer = ShyLayer.create(function () {
            that._shyLayer.setVisible(false);
        });

        var functionLabel = cc.Sprite.create(main_scene_image.bg16);
        functionLabel.setPosition(cc.p(360, 600));
        this._shyLayer.addChild(functionLabel);

        var sendMessageItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            this._onClickSendMessage,
            this
        );
        sendMessageItem.setPosition(cc.p(260, 660));

        var lineUpItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            this._onClickLineUp,
            this
        );
        lineUpItem.setPosition(cc.p(460, 660));

        var battleItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            this._onClickBattle,
            this
        );
        battleItem.setPosition(cc.p(260, 540));

        var deleteFriendItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            this._onClickDeleteFriend,
            this
        );
        deleteFriendItem.setPosition(cc.p(460, 540));

        var menu = cc.Menu.create(
            sendMessageItem,
            lineUpItem,
            battleItem,
            deleteFriendItem
        );
        menu.setPosition(cc.p(0, 0));
        this._shyLayer.addChild(menu);

        var sendMessageIcon = cc.Sprite.create(main_scene_image.icon119);
        sendMessageIcon.setPosition(cc.p(260, 660));
        this._shyLayer.addChild(sendMessageIcon);

        var lineUpIcon = cc.Sprite.create(main_scene_image.icon120);
        lineUpIcon.setPosition(cc.p(460, 660));
        this._shyLayer.addChild(lineUpIcon);

        var battleIcon = cc.Sprite.create(main_scene_image.icon121);
        battleIcon.setPosition(cc.p(260, 540));
        this._shyLayer.addChild(battleIcon);

        var deleteFriendIcon = cc.Sprite.create(main_scene_image.icon122);
        deleteFriendIcon.setPosition(cc.p(460, 540));
        this._shyLayer.addChild(deleteFriendIcon);

        this.addChild(this._shyLayer, 1);

        this._shyLayer.setVisible(false);
    },

    _addAddFriendLayer: function () {
        cc.log("FriendLayer _addAddFriendLayer");

        this._addFriendLayer = LazyLayer.create();

        var functionLabel = cc.Sprite.create(main_scene_image.bg16);
        functionLabel.setPosition(cc.p(360, 600));
        this._addFriendLayer.addChild(functionLabel);

        var tipIcon = cc.Sprite.create(main_scene_image.icon126);
        tipIcon.setPosition(cc.p(360, 670));
        this._addFriendLayer.addChild(tipIcon);

        this._nameEditBox = cc.EditBox.create(cc.size(305, 49), cc.Scale9Sprite.create(main_scene_image.edit3));
        this._nameEditBox.setPosition(cc.p(360, 600));
        this._nameEditBox.setDelegate(this);
        this._nameEditBox.setFont("黑体", 35);
        this._nameEditBox.setFontColor(cc.c3b(255, 255, 255));
        this._nameEditBox.setMaxLength(18);
        this._addFriendLayer.addChild(this._nameEditBox);

        var okItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            this._onClickOk,
            this
        );
        okItem.setPosition(cc.p(260, 530));

        var cancelItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            this._onClickCancel,
            this
        );
        cancelItem.setPosition(cc.p(460, 530));

        var menu = cc.Menu.create(
            okItem,
            cancelItem
        );
        menu.setPosition(cc.p(0, 0));
        this._addFriendLayer.addChild(menu);

        var okIcon = cc.Sprite.create(main_scene_image.icon95);
        okIcon.setPosition(cc.p(260, 530));
        this._addFriendLayer.addChild(okIcon);

        var cancelIcon = cc.Sprite.create(main_scene_image.icon72);
        cancelIcon.setPosition(cc.p(460, 530));
        this._addFriendLayer.addChild(cancelIcon);

        this.addChild(this._addFriendLayer, 1);

        this._addFriendLayer.setVisible(false);
    },

    update: function () {
        cc.log("FriendLayer update");

        var friend = gameData.friend;

        this._giveBlessCountLabel.setString(friend.get("giveBlessCount"));
        this._receiveBlessCountLabel.setString(friend.get("receiveBlessCount"));
        this._friendCountLabel.setString(friend.get("friendCount"));
        this._maxFriendCountLabel.setString(friend.get("maxFriendCount"));

        if (this._scrollView != null) {
            this._scrollView.removeFromParent();
        }

        var friendList = friend.get("friendList");
        var len = friendList.length;

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 194, 640, 733));
        var friendMenu = LazyMenu.create();
        friendMenu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(friendMenu);

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        var scrollViewHeight = len * 127 - 18;
        if (scrollViewHeight < 620) {
            scrollViewHeight = 620;
        }

        this._scrollViewElement = {};

        for (var i = 0; i < len; ++i) {
            var id = friendList[i].id;

            var nameLabel = cc.LabelTTF.create(friendList[i].name, "黑体", 22);
            nameLabel.setPosition(cc.p(100, scrollViewHeight - 25 - 127 * i));
            scrollViewLayer.addChild(nameLabel);

            var lvLabel = cc.LabelTTF.create(friendList[i].lv, "黑体", 22);
            lvLabel.setPosition(cc.p(115, scrollViewHeight - 70 - 127 * i));
            scrollViewLayer.addChild(lvLabel);

            var abilityLabel = cc.LabelTTF.create(friendList[i].ability, "黑体", 22);
            abilityLabel.setPosition(cc.p(300, scrollViewHeight - 55 - 127 * i));
            scrollViewLayer.addChild(abilityLabel);

            var friendItem = cc.MenuItemImage.create(
                main_scene_image.button36,
                main_scene_image.button36s,
                this._onClickFriend(id),
                this
            );
            friendItem.setAnchorPoint(cc.p(0, 0));
            friendItem.setPosition(cc.p(0, scrollViewHeight - 109 - 127 * i));
            friendMenu.addChild(friendItem);

            var point = cc.p(510, scrollViewHeight - 55 - 127 * i);

            var receiveBlessItem = cc.MenuItemImage.create(
                main_scene_image.button21,
                main_scene_image.button21s,
                this._onClickReceiveBless(id),
                this
            );
            receiveBlessItem.setPosition(point);
            menu.addChild(receiveBlessItem);
            receiveBlessItem.setVisible(false);

            var giveBlessItem = cc.MenuItemImage.create(
                main_scene_image.button20,
                main_scene_image.button20s,
                this._onClickGiveBless(id),
                this
            );
            giveBlessItem.setPosition(point);
            menu.addChild(giveBlessItem);

            var giveBlessIcon = cc.Sprite.create(main_scene_image.icon124);
            giveBlessIcon.setPosition(point);
            scrollViewLayer.addChild(giveBlessIcon);

            var receiveBlessIcon = cc.Sprite.create(main_scene_image.icon123);
            receiveBlessIcon.setPosition(point);
            scrollViewLayer.addChild(receiveBlessIcon);
            receiveBlessIcon.setVisible(false);

            this._scrollViewElement[id] = {
                giveBlessItem: giveBlessItem,
                receiveBlessItem: receiveBlessItem,
                giveBlessIcon: giveBlessIcon,
                receiveBlessIcon: receiveBlessIcon
            };
        }

        this._scrollView = cc.ScrollView.create(cc.size(595, 620), scrollViewLayer);
        this._scrollView.setPosition(cc.p(60, 260));
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(cc.p(0, this._scrollView.minContainerOffset().y));
    },

    _onClickAddFriend: function () {
        cc.log("FriendLayer _onClickAddFriend");

        this._addFriendLayer.setVisible(true);
    },

    _onClickOk: function () {
        cc.log("FriendLayer _onClickOk");
        cc.log("name: " + this._nameEditBox.getText());

        gameData.friend.addFriend(name);
    },

    _onClickCancel: function () {
        cc.log("FriendLayer _onClickCancel");

        this._addFriendLayer.setVisible(false);
    },

    _onClickGiveBless: function (id) {
        return function () {
            cc.log("FriendLayer _onClickGiveBless: " + id);

            var element = this._scrollViewElement[id];


        }

    },

    _onClickReceiveBless: function (id) {
        return function () {
            cc.log("FriendLayer _onClickReceiveBless: " + id);

            var element = this._scrollViewElement[id];

            element.giveBlessItem.setVisible(true);
            element.giveBlessIcon.setVisible(true);

            element.receiveBlessItem.setVisible(false);
            element.receiveBlessIcon.setVisible(false);
        }
    },

    _onClickFriend: function (id) {
        return function () {
            cc.log("FriendLayer _onClickFriend: " + id);

            this._selectFriend = id;
            this._shyLayer.setVisible(true);
        }
    },

    _onClickSendMessage: function () {
        cc.log("FriendLayer _onClickSendMessage: " + this._selectFriend);

    },

    _onClickLineUp: function () {
        cc.log("FriendLayer _onClickLineUp: " + this._selectFriend);

    },

    _onClickBattle: function () {
        cc.log("FriendLayer _onClickBattle: " + this._selectFriend);

    },

    _onClickDeleteFriend: function () {
        cc.log("FriendLayer _onClickDeleteFriend: " + this._selectFriend);

    }
});


FriendLayer.create = function () {
    var res = new FriendLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
};