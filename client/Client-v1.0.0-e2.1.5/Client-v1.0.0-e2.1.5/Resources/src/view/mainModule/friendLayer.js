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
    _friendLayerFit: null,

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

        this._friendLayerFit = gameFit.mainScene.friendLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._friendLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._friendLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon118);
        titleIcon.setPosition(this._friendLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var lineIcon = cc.Sprite.create(main_scene_image.icon18);
        lineIcon.setPosition(this._friendLayerFit.lineIconPoint);
        this.addChild(lineIcon);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._friendLayerFit.backItemPoint);
        var menu = cc.Menu.create(backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        var giveCountIcon = cc.LabelTTF.create("今日可送祝福:", "STHeitiTC-Medium", 20);
        giveCountIcon.setColor(cc.c3b(255, 239, 131));
        giveCountIcon.setPosition(this._friendLayerFit.giveCountIconPoint);
        this.addChild(giveCountIcon);

        var receiveCountIcon = cc.LabelTTF.create("今日可领祝福:", "STHeitiTC-Medium", 20);
        receiveCountIcon.setColor(cc.c3b(255, 239, 131));
        receiveCountIcon.setPosition(this._friendLayerFit.receiveCountIconPoint);
        this.addChild(receiveCountIcon);

        this._giveCountLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._giveCountLabel.setPosition(this._friendLayerFit.giveCountLabelPoint);
        this.addChild(this._giveCountLabel);

        this._receiveCountLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._receiveCountLabel.setPosition(this._friendLayerFit.receiveCountLabelPoint);
        this.addChild(this._receiveCountLabel);

        var addFriendItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon125,
            this._onClickAddFriend,
            this
        );
        addFriendItem.setPosition(this._friendLayerFit.addFriendItemPoint);

        var menu = cc.Menu.create(addFriendItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var friendCountIcon = cc.Sprite.create(main_scene_image.icon117);
        friendCountIcon.setPosition(this._friendLayerFit.friendCountIconPoint);
        this.addChild(friendCountIcon);

        var slashIcon = cc.LabelTTF.create("/", "STHeitiTC-Medium", 22);
        slashIcon.setColor(cc.c3b(255, 239, 131));
        slashIcon.setPosition(this._friendLayerFit.slashIconPoint);
        this.addChild(slashIcon);

        this._friendCountLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._friendCountLabel.setColor(cc.c3b(255, 239, 131));
        this._friendCountLabel.setAnchorPoint(cc.p(1, 0.5));
        this._friendCountLabel.setPosition(this._friendLayerFit.friendCountLabelPoint);
        this.addChild(this._friendCountLabel);

        this._maxFriendCountLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._maxFriendCountLabel.setColor(cc.c3b(255, 239, 131));
        this._maxFriendCountLabel.setAnchorPoint(cc.p(0, 0.5));
        this._maxFriendCountLabel.setPosition(this._friendLayerFit.maxFriendCountLabelPoint);
        this.addChild(this._maxFriendCountLabel);

        this._addAddFriendLayer();

        this._skyDialog = SkyDialog.create();
        this.addChild(this._skyDialog, 10);

        var label = cc.Scale9Sprite.create(main_scene_image.bg16);
        label.setContentSize(this._friendLayerFit.labelContentSize);

        var detailItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon120,
            this._onClickDetail,
            this
        );
        detailItem.setPosition(this._friendLayerFit.detailItemPoint);

        var sendMessageItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon119,
            this._onClickSendMessage,
            this
        );
        sendMessageItem.setPosition(this._friendLayerFit.sendMessageItemPoint);

        var battleItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon121,
            this._onClickFight,
            this
        );
        battleItem.setPosition(this._friendLayerFit.battleItemPoint);

        var deleteFriendItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon122,
            this._onClickDeleteFriend,
            this
        );
        deleteFriendItem.setPosition(this._friendLayerFit.deleteFriendItemPoint);

        var skyDialogMenu = cc.Menu.create(detailItem, sendMessageItem, battleItem, deleteFriendItem);
        skyDialogMenu.setPosition(cc.p(0, 0));
        label.addChild(skyDialogMenu);

        this._skyDialog.setLabel(label);
        this._skyDialog.setRect(this._friendLayerFit.skyDialogRect);

        return true;
    },

    _addAddFriendLayer: function () {
        cc.log("FriendLayer _addAddFriendLayer");

        this._addFriendLayer = LazyLayer.create();

        var functionLabel = cc.Sprite.create(main_scene_image.bg16);
        functionLabel.setPosition(this._friendLayerFit.functionLabelPoint);
        this._addFriendLayer.addChild(functionLabel);

        var tipLabel = cc.LabelTTF.create("请输入玩家名字", "STHeitiTC-Medium", 26);
        tipLabel.setColor(cc.c3b(255, 239, 131));
        tipLabel.setPosition(this._friendLayerFit.tipLabelPoint);
        this._addFriendLayer.addChild(tipLabel);

        this._nameEditBox = cc.EditBox.create(this._friendLayerFit.nameEditBoxSize, cc.Scale9Sprite.create(main_scene_image.edit3));
        this._nameEditBox.setPosition(this._friendLayerFit.nameEditBoxPoint);
        this._nameEditBox.setDelegate(this);
        this._nameEditBox.setFont("STHeitiTC-Medium", 35);
        this._nameEditBox.setMaxLength(18);
        this._addFriendLayer.addChild(this._nameEditBox);

        var okItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            this._onClickOk,
            this
        );
        okItem.setPosition(this._friendLayerFit.okPoint);

        var cancelItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            this._onClickCancel,
            this
        );
        cancelItem.setPosition(this._friendLayerFit.cancelPoint);

        var menu = cc.Menu.create(
            okItem,
            cancelItem
        );
        menu.setPosition(cc.p(0, 0));
        this._addFriendLayer.addChild(menu);

        var okIcon = cc.Sprite.create(main_scene_image.icon21);
        okIcon.setPosition(this._friendLayerFit.okPoint);
        this._addFriendLayer.addChild(okIcon);

        var cancelIcon = cc.Sprite.create(main_scene_image.icon72);
        cancelIcon.setPosition(this._friendLayerFit.cancelPoint);
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

        var scrollViewLayer = MarkLayer.create(this._friendLayerFit.scrollViewLayerRect);

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

        this._scrollView = cc.ScrollView.create(this._friendLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._friendLayerFit.scrollViewPoint);
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
    },

    _onClickBack: function () {
        cc.log("FriendLayer _onClickBack");

        MainScene.getInstance().switchLayer(MainLayer);
    }
});


FriendLayer.create = function () {
    var res = new FriendLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
};