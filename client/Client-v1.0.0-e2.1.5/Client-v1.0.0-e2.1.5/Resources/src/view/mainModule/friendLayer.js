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
    _selectFriend: 0,
    _giveCountLabel: null,
    _receiveCountLabel: null,
    _friendCountLabel: null,
    _maxFriendCountLabel: null,
    _skyDialog: null,
    _addFriendLayer: null,
    _nameEditBox: null,
    _scrollView: null,
    _friendItem: {},

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
        headIcon.setPosition(cc.p(40, 968));
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon118);
        titleIcon.setPosition(cc.p(360, 1008));
        this.addChild(titleIcon);

        var lineIcon = cc.Sprite.create(main_scene_image.icon18);
        lineIcon.setPosition(cc.p(360, 887));
        this.addChild(lineIcon);

        var giveCountIcon = cc.LabelTTF.create("今日可送祝福:", "STHeitiTC-Medium", 20);
        giveCountIcon.setColor(cc.c3b(255, 239, 131));
        giveCountIcon.setPosition(cc.p(130, 946));
        this.addChild(giveCountIcon);

        var receiveCountIcon = cc.LabelTTF.create("今日可领祝福:", "STHeitiTC-Medium", 20);
        receiveCountIcon.setColor(cc.c3b(255, 239, 131));
        receiveCountIcon.setPosition(cc.p(130, 912));
        this.addChild(receiveCountIcon);

        this._giveCountLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._giveCountLabel.setColor(cc.c3b(255, 239, 131));
        this._giveCountLabel.setPosition(cc.p(215, 944));
        this.addChild(this._giveCountLabel);

        this._receiveCountLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._receiveCountLabel.setColor(cc.c3b(255, 239, 131));
        this._receiveCountLabel.setPosition(cc.p(215, 910));
        this.addChild(this._receiveCountLabel);

        var addFriendItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon125,
            this._onClickAddFriend,
            this
        );
        addFriendItem.setPosition(cc.p(600, 929));

        var menu = cc.Menu.create(addFriendItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var friendCountIcon = cc.Sprite.create(main_scene_image.icon117);
        friendCountIcon.setPosition(cc.p(565, 227));
        this.addChild(friendCountIcon);

        var slashIcon = cc.LabelTTF.create("/", "STHeitiTC-Medium", 22);
        slashIcon.setColor(cc.c3b(255, 239, 131));
        slashIcon.setPosition(cc.p(565, 225));
        this.addChild(slashIcon);

        this._friendCountLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._friendCountLabel.setColor(cc.c3b(255, 239, 131));
        this._friendCountLabel.setAnchorPoint(cc.p(1, 0.5));
        this._friendCountLabel.setPosition(cc.p(550, 225));
        this.addChild(this._friendCountLabel);

        this._maxFriendCountLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._maxFriendCountLabel.setColor(cc.c3b(255, 239, 131));
        this._maxFriendCountLabel.setAnchorPoint(cc.p(0, 0.5));
        this._maxFriendCountLabel.setPosition(cc.p(580, 225));
        this.addChild(this._maxFriendCountLabel);

        this._addAddFriendLayer();

        this._skyDialog = SkyDialog.create();
        this.addChild(this._skyDialog, 10);

        var label = cc.Scale9Sprite.create(main_scene_image.bg16);
        label.setContentSize(cc.size(216, 390));

        var detailItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon120,
            this._onClickDetail,
            this
        );
        detailItem.setPosition(cc.p(108, 330));

        var sendMessageItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon119,
            this._onClickSendMessage,
            this
        );
        sendMessageItem.setPosition(cc.p(108, 240));

        var battleItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon121,
            this._onClickFight,
            this
        );
        battleItem.setPosition(cc.p(108, 150));

        var deleteFriendItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon122,
            this._onClickDeleteFriend,
            this
        );
        deleteFriendItem.setPosition(cc.p(108, 60));

        var skyDialogMenu = cc.Menu.create(detailItem, sendMessageItem, battleItem, deleteFriendItem);
        skyDialogMenu.setPosition(cc.p(0, 0));
        label.addChild(skyDialogMenu);

        this._skyDialog.setLabel(label);
        this._skyDialog.setRect(cc.rect(40, 198, 640, 700));

        return true;
    },

    _addAddFriendLayer: function () {
        cc.log("FriendLayer _addAddFriendLayer");

        this._addFriendLayer = LazyLayer.create();

        var functionLabel = cc.Sprite.create(main_scene_image.bg16);
        functionLabel.setPosition(cc.p(360, 600));
        this._addFriendLayer.addChild(functionLabel);

        var tipLabel = cc.LabelTTF.create("请输入玩家名字", "STHeitiTC-Medium", 26);
        tipLabel.setColor(cc.c3b(255, 239, 131));
        tipLabel.setPosition(cc.p(360, 670));
        this._addFriendLayer.addChild(tipLabel);

        this._nameEditBox = cc.EditBox.create(cc.size(305, 49), cc.Scale9Sprite.create(main_scene_image.edit3));
        this._nameEditBox.setPosition(cc.p(360, 600));
        this._nameEditBox.setDelegate(this);
        this._nameEditBox.setFont("STHeitiTC-Medium", 35);
        this._nameEditBox.setFontColor(cc.c3b(255, 239, 131));
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

        var okIcon = cc.Sprite.create(main_scene_image.icon21);
        okIcon.setPosition(cc.p(260, 530));
        this._addFriendLayer.addChild(okIcon);

        var cancelIcon = cc.Sprite.create(main_scene_image.icon72);
        cancelIcon.setPosition(cc.p(460, 530));
        this._addFriendLayer.addChild(cancelIcon);

        this.addChild(this._addFriendLayer, 1);

        this._nameEditBox.setVisible(false);
        this._addFriendLayer.setVisible(false);
    },

    update: function () {
        cc.log("FriendLayer update");

        var friend = gameData.friend;

        if (this._scrollView != null) {
            this._scrollView.removeFromParent();
        }

        var friendList = friend.get("friendList");
        var len = friendList.length;

        var giveCount = friend.get("giveCount");
        var receiveCount = friend.get("receiveCount");

        this._giveCountLabel.setString(giveCount);
        this._receiveCountLabel.setString(receiveCount);
        this._friendCountLabel.setString(len);
        this._maxFriendCountLabel.setString(friend.get("maxFriendCount"));

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 194, 640, 733));

        var friendMenu = LazyMenu.create();
        friendMenu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(friendMenu);

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        var scrollViewHeight = len * 127;
        if (scrollViewHeight < 620) {
            scrollViewHeight = 620;
        }

        this._friendItem = {};

        for (var i = 0; i < len; ++i) {
            var id = friendList[i].id;
            var y = scrollViewHeight - 127 - 127 * i;

            var nameIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
            nameIcon.setContentSize(cc.size(180, 35));
            nameIcon.setAnchorPoint(cc.p(0, 0.5));
            nameIcon.setPosition(cc.p(40, y + 85));
            scrollViewLayer.addChild(nameIcon);

            var otherIcon = cc.Sprite.create(main_scene_image.icon30);
            otherIcon.setPosition(cc.p(96, y + 38));
            scrollViewLayer.addChild(otherIcon);

            var nameLabel = cc.LabelTTF.create(friendList[i].name, "STHeitiTC-Medium", 22);
            nameLabel.setColor(cc.c3b(255, 242, 206));
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(50, y + 85));
            scrollViewLayer.addChild(nameLabel);

            var lvLabel = cc.LabelTTF.create(friendList[i].lv, "STHeitiTC-Medium", 22);
            lvLabel.setColor(cc.c3b(56, 3, 5));
            lvLabel.setAnchorPoint(cc.p(0, 0.5));
            lvLabel.setPosition(cc.p(76, y + 36));
            scrollViewLayer.addChild(lvLabel);

            var abilityLabel = cc.LabelTTF.create(friendList[i].ability, "STHeitiTC-Medium", 22);
            abilityLabel.setColor(cc.c3b(56, 3, 5));
            abilityLabel.setAnchorPoint(cc.p(0, 0.5));
            abilityLabel.setPosition(cc.p(157, y + 36));
            scrollViewLayer.addChild(abilityLabel);

            var friendItem = cc.MenuItemImage.create(
                main_scene_image.button15,
                main_scene_image.button15s,
                main_scene_image.button15d,
                this._onClickFriend(id),
                this
            );
            friendItem.setAnchorPoint(cc.p(0, 0));
            friendItem.setPosition(cc.p(0, y));
            friendMenu.addChild(friendItem);
            friendItem.setScaleY(0.9);

            this._friendItem[id] = friendItem;

            var point = cc.p(490, y + 63);

            if (receiveCount > 0 && friendList[i].canReceive) {
                var receiveBlessItem = cc.MenuItemImage.createWithIcon(
                    main_scene_image.button10,
                    main_scene_image.button10s,
                    main_scene_image.icon123,
                    this._onClickReceiveBless(id),
                    this
                );
                receiveBlessItem.setPosition(point);
                menu.addChild(receiveBlessItem);
            } else {
                var giveBlessItem = cc.MenuItemImage.createWithIcon(
                    main_scene_image.button9,
                    main_scene_image.button9s,
                    main_scene_image.button9d,
                    main_scene_image.icon124,
                    this._onClickGiveBless(id),
                    this
                );
                giveBlessItem.setPosition(point);
                menu.addChild(giveBlessItem);

                giveBlessItem.setEnabled(giveCount > 0 && friendList[i].canGive);
            }
        }

        this._scrollView = cc.ScrollView.create(cc.size(591, 620), scrollViewLayer);
        this._scrollView.setPosition(cc.p(65, 260));
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(cc.p(0, this._scrollView.minContainerOffset().y));
    },

    _onClickAddFriend: function () {
        cc.log("FriendLayer _onClickAddFriend");

        this._nameEditBox.setVisible(true);
        this._addFriendLayer.setVisible(true);
    },

    _onClickOk: function () {
        cc.log("FriendLayer _onClickOk");
        cc.log("name: " + this._nameEditBox.getText());

        gameData.friend.addFriend(this._nameEditBox.getText());

        this._onClickCancel();
    },

    _onClickCancel: function () {
        cc.log("FriendLayer _onClickCancel");

        this._nameEditBox.setVisible(false);
        this._addFriendLayer.setVisible(false);
    },

    _onClickGiveBless: function (id) {
        return function () {
            cc.log("FriendLayer _onClickGiveBless: " + id);

            var that = this;
            gameData.friend.giveBless(function (data) {
                cc.log(data);

                that.update();
            }, id);
        }

    },

    _onClickReceiveBless: function (id) {
        return function () {
            cc.log("FriendLayer _onClickReceiveBless: " + id);

            var that = this;
            gameData.friend.receiveBless(function (data) {
                cc.log(data);

                that.update();
            }, id);
        }
    },

    _onClickFriend: function (id) {
        return function () {
            cc.log("FriendLayer _onClickFriend: " + id);

            var point = this._friendItem[id].convertToWorldSpace(cc.p(230, 98));

            this._selectFriend = id;
            this._skyDialog.show(point);
        }
    },

    _onClickDetail: function () {
        cc.log("FriendLayer _onClickDetail: " + this._selectFriend);

        var friend = gameData.friend.getFriend(this._selectFriend);

        if (friend) {
            gameData.player.playerDetail(function (data) {
                cc.log(data);

                LineUpDetail.pop(data);
            }, this._selectFriend);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    },

    _onClickSendMessage: function () {
        cc.log("FriendLayer _onClickSendMessage: " + this._selectFriend);

        var friend = gameData.friend.getFriend(this._selectFriend);

        if (friend) {
            SendMessageLayer.pop(friend.id, friend.name);
        } else {
            TipLayer.tip("找不到该好友");
        }
    },

    _onClickFight: function () {
        cc.log("FriendLayer _onClickFight: " + this._selectFriend);
        cc.log(this._selectFriend);

        var that = this;
        gameData.player.fight(function (battleLogId) {
            BattlePlayer.getInstance().play(battleLogId);
        }, this._selectFriend);
    },

    _onClickDeleteFriend: function () {
        cc.log("FriendLayer _onClickDeleteFriend: " + this._selectFriend);

        var that = this;
        gameData.friend.deleteFriend(function (data) {
            that.update();
        }, this._selectFriend);
    }
});


FriendLayer.create = function () {
    var res = new FriendLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
};