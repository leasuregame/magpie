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
    _scrollView: null,
    _friendItem: {},
    _isFirstEnter: true,

    _scrollViewElement: [],

    onEnter: function () {
        cc.log("FriendLayer onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("好友界面");
    },

    onExit: function () {
        cc.log("FriendLayer onExit");

        this._super();

        lz.um.endLogPageView("好友界面");
    },

    init: function () {
        cc.log("FriendLayer init");

        if (!this._super()) return false;

        this._friendLayerFit = gameFit.mainScene.friendLayer;

        this._isFirstEnter = true;

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

    update: function () {
        cc.log("FriendLayer update");

        var friend = gameData.friend;

        if (this._scrollView != null) {
            this._scrollView.removeFromParent();
        }

        var friendList = friend.getFriendList();
        var len = friendList.length;

        var giveCount = friend.get("giveCount");
        var receiveCount = friend.get("receiveCount");

        this._giveCountLabel.setString(giveCount);
        this._receiveCountLabel.setString(receiveCount);
        this._friendCountLabel.setString(len);
        this._maxFriendCountLabel.setString(friend.get("maxFriendCount"));

        var scrollViewLayer = MarkLayer.create(this._friendLayerFit.scrollViewLayerRect);

        var scrollViewHeight = len * 127;
        if (scrollViewHeight < this._friendLayerFit.scrollViewHeight) {
            scrollViewHeight = this._friendLayerFit.scrollViewHeight;
        }

        this._friendItem = {};

        var slideLabel = [];

        for (var i = 0; i < len; ++i) {
            var id = friendList[i].id;
            var y = scrollViewHeight - 127 - 127 * i;

            slideLabel[i] = cc.Node.create();
            slideLabel[i].setPosition(cc.p(0, 0));
            slideLabel[i].setVisible(!this._isFirstEnter);

            var friendMenu = LazyMenu.create();
            friendMenu.setPosition(cc.p(0, 0));
            slideLabel[i].addChild(friendMenu);

            var menu = LazyMenu.create();
            menu.setPosition(cc.p(0, 0));
            slideLabel[i].addChild(menu);

            var nameIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
            nameIcon.setContentSize(cc.size(180, 35));
            nameIcon.setAnchorPoint(cc.p(0, 0.5));
            nameIcon.setPosition(cc.p(40, y + 85));
            slideLabel[i].addChild(nameIcon);

            var otherIcon = cc.Sprite.create(main_scene_image.icon30);
            otherIcon.setPosition(cc.p(96, y + 38));
            slideLabel[i].addChild(otherIcon);

            var nameLabel = cc.LabelTTF.create(friendList[i].name, "STHeitiTC-Medium", 22);
            nameLabel.setColor(cc.c3b(255, 242, 206));
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(50, y + 85));
            slideLabel[i].addChild(nameLabel);

            var lvLabel = cc.LabelTTF.create(friendList[i].lv, "STHeitiTC-Medium", 22);
            lvLabel.setColor(cc.c3b(56, 3, 5));
            lvLabel.setAnchorPoint(cc.p(0, 0.5));
            lvLabel.setPosition(cc.p(76, y + 36));
            slideLabel[i].addChild(lvLabel);

            var abilityLabel = cc.LabelTTF.create(friendList[i].ability, "STHeitiTC-Medium", 22);
            abilityLabel.setColor(cc.c3b(56, 3, 5));
            abilityLabel.setAnchorPoint(cc.p(0, 0.5));
            abilityLabel.setPosition(cc.p(157, y + 36));
            slideLabel[i].addChild(abilityLabel);

            var giveCountLabel = cc.LabelTTF.create("送出祝福: " + friendList[i].giveCount, "STHeitiTC-Medium", 22);
            giveCountLabel.setColor(cc.c3b(56, 3, 5));
            giveCountLabel.setAnchorPoint(cc.p(0, 0.5));
            giveCountLabel.setPosition(cc.p(250, y + 80));
            slideLabel[i].addChild(giveCountLabel);

            var receiveCountLabel = cc.LabelTTF.create("收到祝福: " + friendList[i].receiveCount, "STHeitiTC-Medium", 22);
            receiveCountLabel.setColor(cc.c3b(56, 3, 5));
            receiveCountLabel.setAnchorPoint(cc.p(0, 0.5));
            receiveCountLabel.setPosition(cc.p(250, y + 41));
            slideLabel[i].addChild(receiveCountLabel);

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

            var receiveBlessItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button10,
                main_scene_image.button10s,
                main_scene_image.icon123,
                this._onClickReceiveBless(id),
                this
            );
            receiveBlessItem.setPosition(point);
            menu.addChild(receiveBlessItem);

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
            giveBlessItem.setEnabled(friendList[i].canGive);

            var canReceive = false;
            if (receiveCount > 0 && friendList[i].canReceive) {
                canReceive = true;
            }
            receiveBlessItem.setVisible(canReceive);
            giveBlessItem.setVisible(!canReceive);

            scrollViewLayer.addChild(slideLabel[i]);

            this._scrollViewElement[id] = {
                giveCountLabel: giveCountLabel,
                receiveCountLabel: receiveCountLabel,
                receiveBlessItem: receiveBlessItem,
                giveBlessItem: giveBlessItem
            }
        }

        this._scrollView = cc.ScrollView.create(this._friendLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._friendLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(cc.p(0, this._scrollView.minContainerOffset().y));

        if (this._isFirstEnter) {
            this._isFirstEnter = false;
            var slideLayer = SlideLayer.create(
                {
                    labels: slideLabel,
                    slideTime: 0.4,
                    timeTick: 0.05
                }
            );

            slideLayer.showSlide();
        }
    },

    _update: function (id) {
        cc.log("FriendLayer _update: " + id);

        var friendList = gameData.friend.get("friendList");
        var len = friendList.length;
        var friend = null;

        for (var i = 0; i < len; i++) {
            if (friendList[i].id == id) {
                friend = friendList[i];
                break;
            }
        }

        var giveCount = gameData.friend.get("giveCount");
        var receiveCount = gameData.friend.get("receiveCount");

        this._giveCountLabel.setString(giveCount);
        this._receiveCountLabel.setString(receiveCount);
        this._friendCountLabel.setString(len);
        this._maxFriendCountLabel.setString(gameData.friend.get("maxFriendCount"));

        var canReceive = false;
        if (receiveCount > 0 && friend.canReceive) {
            canReceive = true;
        }

        this._scrollViewElement[id].receiveBlessItem.setVisible(canReceive);
        this._scrollViewElement[id].giveBlessItem.setVisible(!canReceive);
        this._scrollViewElement[id].giveBlessItem.setEnabled(friend.canGive);
        this._scrollViewElement[id].giveCountLabel.setString("送出祝福: " + friend.giveCount);
        this._scrollViewElement[id].receiveCountLabel.setString("收到祝福: " + friend.receiveCount);

    },

    _onClickAddFriend: function () {
        cc.log("FriendLayer _onClickAddFriend");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        MainScene.getInstance().switchLayer(AddFriendsLayer);
    },

    _onClickGiveBless: function (id) {
        return function () {
            cc.log("FriendLayer _onClickGiveBless: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var friend = gameData.friend;

            if (friend.get("giveCount") <= 0) {
                var tipVip = gameData.player.get("vip") + 1;

                tipVip = Math.max(tipVip, 2);
                tipVip = Math.min(tipVip, 12);

                GoPaymentLayer.pop({
                    title: "祝福次数已用完",
                    msg: "成为VIP" + tipVip + "，每日即可获得额外的祝福次数"
                });
                return;
            }

            var that = this;
            gameData.friend.giveBless(function (data) {
                cc.log(data);

                that._update(id);

            }, id);
        }

    },

    _onClickReceiveBless: function (id) {
        return function () {
            cc.log("FriendLayer _onClickReceiveBless: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var friend = gameData.friend;
            if (friend.get("receiveCount") <= 0) {
                TipLayer.tip("今天可领次数已用完");
                this.update();
            }

            var that = this;
            gameData.friend.receiveBless(function (data) {
                cc.log(data);

                that._update(id);
                gameMark.updateFriendMark(false);
            }, id);
        }
    },

    _onClickFriend: function (id) {
        return function () {
            cc.log("FriendLayer _onClickFriend: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var point = this._friendItem[id].convertToWorldSpace(cc.p(230, 98));

            this._selectFriend = id;
            this._skyDialog.show(point);
        }
    },

    _onClickDetail: function () {
        cc.log("FriendLayer _onClickDetail: " + this._selectFriend);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var friend = gameData.friend.getFriend(this._selectFriend);

        if (friend) {
            gameData.player.playerDetail(function (data) {
                cc.log(data);

                LineUpDetail.pop(data);
                gameMark.updateFriendMark(false);

            }, this._selectFriend);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    },

    _onClickSendMessage: function () {
        cc.log("FriendLayer _onClickSendMessage: " + this._selectFriend);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

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

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;
        gameData.player.fight(function (battleLogId) {
            BattlePlayer.getInstance().play({
                id: battleLogId
            });
        }, this._selectFriend);
    },

    _onClickDeleteFriend: function () {
        cc.log("FriendLayer _onClickDeleteFriend: " + this._selectFriend);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;
        gameData.friend.deleteFriend(function (data) {
            that.update();
        }, this._selectFriend);
    },

    _onClickBack: function () {
        cc.log("FriendLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

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