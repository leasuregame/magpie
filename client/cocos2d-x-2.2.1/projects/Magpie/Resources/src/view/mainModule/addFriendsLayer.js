/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-12-14
 * Time: 下午3:23
 * To change this template use File | Settings | File Templates.
 */


var AddFriendsLayer = cc.Layer.extend({
    _addFriendsLayerFit: null,

    _updateFriendsItem: null,
    _searchFriendItem: null,
    _nameEditBox: null,
    _friendsList: [],
    _scrollView: null,
    _skyDialog: null,
    _friendItem: [],
    _selectFriend: null,

    onEnter: function () {
        cc.log("AddFriendsLayer onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("添加好友界面");
    },

    onExit: function () {
        cc.log("AddFriendsLayer onExit");

        this._super();

        lz.um.endLogPageView("添加好友界面");
    },

    init: function () {
        cc.log("AddFriendsLayer init");

        if (!this._super()) return false;

        this._addFriendsLayerFit = gameFit.mainScene.addFriendLayer;

        this._friendsList = [];
        this._friendItem = [];

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._addFriendsLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._addFriendsLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon118);
        titleIcon.setPosition(this._addFriendsLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var lineIcon = cc.Sprite.create(main_scene_image.icon18);
        lineIcon.setPosition(this._addFriendsLayerFit.lineIconPoint);
        this.addChild(lineIcon);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._addFriendsLayerFit.backItemPoint);

        var giveCountIcon = cc.LabelTTF.create("今日可送祝福:", "STHeitiTC-Medium", 20);
        giveCountIcon.setColor(cc.c3b(255, 239, 131));
        giveCountIcon.setPosition(this._addFriendsLayerFit.giveCountIconPoint);
        this.addChild(giveCountIcon);

        var receiveCountIcon = cc.LabelTTF.create("今日可领祝福:", "STHeitiTC-Medium", 20);
        receiveCountIcon.setColor(cc.c3b(255, 239, 131));
        receiveCountIcon.setPosition(this._addFriendsLayerFit.receiveCountIconPoint);
        this.addChild(receiveCountIcon);

        this._giveCountLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._giveCountLabel.setPosition(this._addFriendsLayerFit.giveCountLabelPoint);
        this.addChild(this._giveCountLabel);

        this._receiveCountLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._receiveCountLabel.setPosition(this._addFriendsLayerFit.receiveCountLabelPoint);
        this.addChild(this._receiveCountLabel);

        this._updateFriendsItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon310,
            this._onClickUpdateFriends,
            this
        );
        this._updateFriendsItem.setPosition(this._addFriendsLayerFit.updateFriendsItemPoint);

        var nameEditBoxIcon = cc.Sprite.create(main_scene_image.edit4);
        nameEditBoxIcon.setPosition(this._addFriendsLayerFit.nameEditBoxIconPoint);
        this.addChild(nameEditBoxIcon);

        this._nameEditBox = cc.EditBox.create(this._addFriendsLayerFit.nameEditBoxSize, cc.Scale9Sprite.create(main_scene_image.edit));
        this._nameEditBox.setPosition(this._addFriendsLayerFit.nameEditBoxPoint);
        this._nameEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._nameEditBox.setDelegate(this);
        this._nameEditBox.setFont("STHeitiTC-Medium", 35);
        this._nameEditBox.setPlaceHolder("请输入好友名字");
        this.addChild(this._nameEditBox);

        this._searchFriendItem = cc.MenuItemImage.create(
            main_scene_image.button68,
            main_scene_image.button68s,
            this._onClickSearchFriend,
            this
        );

        this._searchFriendItem.setPosition(this._addFriendsLayerFit.searchFriendItemPoint);

        var menu = cc.Menu.create(this._searchFriendItem, this._updateFriendsItem, backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var friendCountIcon = cc.Sprite.create(main_scene_image.icon117);
        friendCountIcon.setPosition(this._addFriendsLayerFit.friendCountIconPoint);
        this.addChild(friendCountIcon);

        var slashIcon = cc.LabelTTF.create("/", "STHeitiTC-Medium", 22);
        slashIcon.setColor(cc.c3b(255, 239, 131));
        slashIcon.setPosition(this._addFriendsLayerFit.slashIconPoint);
        this.addChild(slashIcon);

        this._friendCountLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._friendCountLabel.setColor(cc.c3b(255, 239, 131));
        this._friendCountLabel.setAnchorPoint(cc.p(1, 0.5));
        this._friendCountLabel.setPosition(this._addFriendsLayerFit.friendCountLabelPoint);
        this.addChild(this._friendCountLabel);

        this._maxFriendCountLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._maxFriendCountLabel.setColor(cc.c3b(255, 239, 131));
        this._maxFriendCountLabel.setAnchorPoint(cc.p(0, 0.5));
        this._maxFriendCountLabel.setPosition(this._addFriendsLayerFit.maxFriendCountLabelPoint);
        this.addChild(this._maxFriendCountLabel);

        this._skyDialog = SkyDialog.create();
        this.addChild(this._skyDialog, 10);

        var label = cc.Scale9Sprite.create(main_scene_image.bg16);
        label.setContentSize(this._addFriendsLayerFit.labelContentSize);

        var detailItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon120,
            this._onClickDetail,
            this
        );
        detailItem.setPosition(this._addFriendsLayerFit.detailItemPoint);

        var sendMessageItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon119,
            this._onClickSendMessage,
            this
        );
        sendMessageItem.setPosition(this._addFriendsLayerFit.sendMessageItemPoint);

        var skyDialogMenu = cc.Menu.create(detailItem, sendMessageItem);
        skyDialogMenu.setPosition(cc.p(0, 0));
        label.addChild(skyDialogMenu);

        this._skyDialog.setLabel(label);
        this._skyDialog.setRect(this._addFriendsLayerFit.skyDialogRect);

        this._onClickUpdateFriends();

        return true;
    },

    update: function () {
        cc.log("AddFriendsLayer update");

        var friend = gameData.friend;
        var giveCount = friend.get("giveCount");
        var receiveCount = friend.get("receiveCount");
        var friendList = friend.get("friendList");
        var len = friendList.length;

        this._giveCountLabel.setString(giveCount);
        this._receiveCountLabel.setString(receiveCount);
        this._friendCountLabel.setString(len);
        this._maxFriendCountLabel.setString(friend.get("maxFriendCount"));

        if (this._scrollView != null) {
            this._scrollView.removeFromParent();
        }

        var listLen = this._friendsList.length;

        var scrollViewLayer = MarkLayer.create(this._addFriendsLayerFit.scrollViewLayerRect);
        var scrollViewHeight = listLen * 127;
        if (scrollViewHeight < this._addFriendsLayerFit.scrollViewHeight) {
            scrollViewHeight = this._addFriendsLayerFit.scrollViewHeight;
        }

        var slideLabel = [];

        for (var i = 0; i < listLen; i++) {

            var y = scrollViewHeight - 127 - 127 * i;

            slideLabel[i] = cc.Node.create();
            slideLabel[i].setPosition(cc.p(0, 0));
            slideLabel[i].setVisible(false);

            var friendItem = cc.MenuItemImage.create(
                main_scene_image.button15,
                main_scene_image.button15s,
                main_scene_image.button15d,
                this._onClickFriend(i),
                this
            );
            friendItem.setAnchorPoint(cc.p(0, 0));
            friendItem.setPosition(cc.p(0, y));
            friendItem.setScaleY(0.9);

            var friendMenu = LazyMenu.create();
            friendMenu.setPosition(cc.p(0, 0));
            friendMenu.addChild(friendItem);
            slideLabel[i].addChild(friendMenu);

            this._friendItem[i] = friendItem;

            var nameIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
            nameIcon.setContentSize(cc.size(180, 35));
            nameIcon.setAnchorPoint(cc.p(0, 0.5));
            nameIcon.setPosition(cc.p(40, y + 85));
            slideLabel[i].addChild(nameIcon);

            var otherIcon = cc.Sprite.create(main_scene_image.icon30);
            otherIcon.setPosition(cc.p(96, y + 38));
            slideLabel[i].addChild(otherIcon);

            var nameLabel = cc.LabelTTF.create(this._friendsList[i].name, "STHeitiTC-Medium", 22);
            nameLabel.setColor(cc.c3b(255, 242, 206));
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(50, y + 85));
            slideLabel[i].addChild(nameLabel);

            var lvLabel = cc.LabelTTF.create(this._friendsList[i].lv, "STHeitiTC-Medium", 22);
            lvLabel.setColor(cc.c3b(56, 3, 5));
            lvLabel.setAnchorPoint(cc.p(0, 0.5));
            lvLabel.setPosition(cc.p(76, y + 36));
            slideLabel[i].addChild(lvLabel);

            var abilityLabel = cc.LabelTTF.create(this._friendsList[i].ability, "STHeitiTC-Medium", 22);
            abilityLabel.setColor(cc.c3b(56, 3, 5));
            abilityLabel.setAnchorPoint(cc.p(0, 0.5));
            abilityLabel.setPosition(cc.p(157, y + 36));
            slideLabel[i].addChild(abilityLabel);

            var point = cc.p(490, y + 63);

            var addFriendItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon311,
                this._onClickAddFriend(i),
                this
            );
            addFriendItem.setPosition(point);
            var menu = LazyMenu.create();
            menu.setPosition(cc.p(0, 0));
            menu.addChild(addFriendItem);
            slideLabel[i].addChild(menu);

            scrollViewLayer.addChild(slideLabel[i]);
        }

        this._scrollView = cc.ScrollView.create(this._addFriendsLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._addFriendsLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(cc.p(0, this._scrollView.minContainerOffset().y));

        var slideLayer = SlideLayer.create({
            labels: slideLabel,
            slideTime: 0.4,
            timeTick: 0.05
        });

        slideLayer.showSlide();
    },

    _onClickFriend: function (index) {
        return function () {
            cc.log("AddFriendsLayer _onClickFriend: " + index);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var point = this._friendItem[index].convertToWorldSpace(cc.p(230, 98));

            this._selectFriend = index;
            this._skyDialog.show(point);
        }
    },

    _onClickDetail: function () {
        cc.log("AddFriendsLayer _onClickDetail: " + this._selectFriend);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        gameData.player.playerDetail(function (data) {
            cc.log(data);

            LineUpDetail.pop(data);
            gameMark.updateFriendMark(false);

        }, this._friendsList[this._selectFriend].id);
    },

    _onClickSendMessage: function () {
        cc.log("AddFriendsLayer _onClickSendMessage: " + this._selectFriend);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var friend = this._friendsList[this._selectFriend];

        SendMessageLayer.pop(friend.id, friend.name);
    },

    _onClickAddFriend: function (index) {
        var that = this;
        return function () {
            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var name = that._friendsList[index].name;
            cc.log("AddFriendsLayer _onClickAddFriend: " + name);

            gameData.friend.addFriend(name);
        }
    },

    _onClickSearchFriend: function () {
        cc.log("AddFriendsLayer _onClickSearchFriend");

        var text = this._nameEditBox.getText();
        cc.log("add friend's name: " + text);

        if (text == null || text == "") {
            TipLayer.tip("请先输入好友名字");
            return;
        }

        this._searchFriendItem.setEnabled(false);

        var that = this;
        gameData.friend.searchFriend(text, function (friend) {
            that._friendsList = [];
            if (friend) {
                that._friendsList[0] = friend;
            }
            that.update();
            that._searchFriendItem.setEnabled(true);
        });

    },

    _onClickBack: function () {
        cc.log("AddFriendsLayer _onClickBack");

        MainScene.getInstance().switchLayer(FriendLayer);
    },

    _onClickUpdateFriends: function () {
        cc.log("AddFriendsLayer _onClickUpdateFriends");

        this._updateFriendsItem.setEnabled(false);

        var that = this;
        gameData.friend.randomFriendsList(function (friends) {
            that._friendsList = friends || [];
            that.update();
            that._updateFriendsItem.setEnabled(true);
        });
    }
});

AddFriendsLayer.create = function () {
    var ret = new AddFriendsLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};
