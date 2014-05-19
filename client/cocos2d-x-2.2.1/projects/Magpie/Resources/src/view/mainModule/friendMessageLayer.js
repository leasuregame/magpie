/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-28
 * Time: 下午6:48
 * To change this template use File | Settings | File Templates.
 */


/*
 * friend message layer
 * */


var FriendMessageLayer = cc.Layer.extend({
    _friendMessageLayerFit: null,

    _friendMessageList: [],
    _scrollView: null,
    _scrollViewElement: {},
    _markEffect: [],

    onEnter: function () {
        cc.log("FriendMessageLayer onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("好友消息界面");
    },

    onExit: function () {
        cc.log("FriendMessageLayer onExit");

        this._super();

        lz.um.endLogPageView("好友消息界面");
    },

    init: function () {
        cc.log("FriendMessageLayer init");

        if (!this._super()) return false;

        this._friendMessageLayerFit = gameFit.mainScene.friendMessageLayer;
        return true;
    },

    update: function () {
        cc.log("FriendMessageLayer update");

        this._friendMessageList = gameData.message.get("friendMessage");
        this._markEffect = [];
        var len = this._friendMessageList.length;

        if (this._scrollView != null) {
            this._scrollView.removeFromParent();
        }

        var scrollViewLayer = MarkLayer.create(this._friendMessageLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = len * 127;
        if (scrollViewHeight < this._friendMessageLayerFit.scrollViewHeight) {
            scrollViewHeight = this._friendMessageLayerFit.scrollViewHeight;
        }

        this._scrollViewElement = {};
        var that = this;
        for (var i = 0; i < len; ++i) {
            (function (i) {
                var y = scrollViewHeight - 127 - 127 * i;

                var id = that._friendMessageList[i].id;
                var type = that._friendMessageList[i].type;
                var status = that._friendMessageList[i].status;

                var msgBgLabel = cc.Sprite.create(main_scene_image.icon449);
                msgBgLabel.setAnchorPoint(cc.p(0, 0));
                msgBgLabel.setPosition(cc.p(0, y));
                scrollViewLayer.addChild(msgBgLabel);

                var friendIcon = cc.Sprite.create(main_scene_image.icon451);
                friendIcon.setAnchorPoint(cc.p(0, 0.5));
                friendIcon.setPosition(cc.p(10, 57));
                msgBgLabel.addChild(friendIcon);

                var nameIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
                nameIcon.setContentSize(cc.size(180, 30));
                nameIcon.setAnchorPoint(cc.p(0, 0.5));
                nameIcon.setPosition(cc.p(115, 85));
                msgBgLabel.addChild(nameIcon);

                var nameLabel = cc.LabelTTF.create("哈哈哈哈哈哈", "STHeitiTC-Medium", 22);
                nameLabel.setAnchorPoint(cc.p(0, 0.5));
                nameLabel.setPosition(cc.p(130, 85));
                msgBgLabel.addChild(nameLabel);

                var msgLabel = cc.LabelTTF.create(that._friendMessageList[i].content, "STHeitiTC-Medium", 22);
                msgLabel.setAnchorPoint(cc.p(0, 0.5));
                msgLabel.setPosition(cc.p(120, 35));
                msgLabel.setColor(cc.c3b(138, 85, 23));
                msgBgLabel.addChild(msgLabel);

                var timeLabel = cc.LabelTTF.create(
                    lz.getTimeStr({
                        time: that._friendMessageList[i].createTime,
                        fmt: "yyyy.MM.dd hh:mm"
                    }),
                    "STHeitiTC-Medium",
                    16
                );
                timeLabel.setAnchorPoint(cc.p(1, 0));
                timeLabel.setPosition(cc.p(580, y + 13));
                timeLabel.setColor(cc.c3b(138, 85, 23));
                scrollViewLayer.addChild(timeLabel);

                if (type == ADD_FRIEND_MESSAGE) {
                    var hasBeenAcceptIcon = cc.Sprite.create(main_scene_image.icon136);
                    hasBeenAcceptIcon.setPosition(cc.p(530, y + 60));
                    scrollViewLayer.addChild(hasBeenAcceptIcon, 1);

                    var hasBeenRejectIcon = cc.Sprite.create(main_scene_image.icon137);
                    hasBeenRejectIcon.setPosition(cc.p(530, y + 60));
                    scrollViewLayer.addChild(hasBeenRejectIcon, 1);

                    if (status == ASKING_STATUS) {
                        hasBeenAcceptIcon.setVisible(false);
                        hasBeenRejectIcon.setVisible(false);

                        var acceptItem = cc.MenuItemImage.createWithIcon(
                            main_scene_image.button9,
                            main_scene_image.button9s,
                            main_scene_image.icon131,
                            that._onClickAccept(id),
                            that
                        );
                        acceptItem.setPosition(cc.p(380, y + 62));
                        menu.addChild(acceptItem);

                        var rejectItem = cc.MenuItemImage.createWithIcon(
                            main_scene_image.button9,
                            main_scene_image.button9s,
                            main_scene_image.icon133,
                            that._onClickReject(id),
                            that
                        );
                        rejectItem.setPosition(cc.p(525, y + 62));
                        menu.addChild(rejectItem);

                        that._scrollViewElement[id] = {
                            hasBeenAcceptIcon: hasBeenAcceptIcon,
                            hasBeenRejectIcon: hasBeenRejectIcon,
                            acceptItem: acceptItem,
                            rejectItem: rejectItem
                        };
                    } else if (status == ACCEPT_STATUS) {
                        hasBeenRejectIcon.setVisible(false);
                    } else if (status == REJECT_STATUS) {
                        hasBeenAcceptIcon.setVisible(false);
                    }
                } else if (type == LEAVE_MESSAGE) {
                    var name = that._friendMessageList[i].senderName;

                    if (!gameData.friend.getFriend(name)) {
                        var addFriendItem = cc.MenuItemImage.createWithIcon(
                            main_scene_image.button9,
                            main_scene_image.button9s,
                            main_scene_image.icon41,
                            that._onClickAddFriend(name),
                            that
                        );
                        addFriendItem.setPosition(cc.p(380, y + 62));
                        menu.addChild(addFriendItem);
                    }

                    var readItem = cc.MenuItemImage.createWithIcon(
                        main_scene_image.button9,
                        main_scene_image.button9s,
                        main_scene_image.icon134,
                        that._onClickRead(i),
                        that
                    );
                    readItem.setPosition(cc.p(525, y + 62));

                    if (status == UNHANDLED_STATUS && !that._markEffect[i]) {
                        that._markEffect[i] = cc.BuilderReader.load(main_scene_image.uiEffect34, that);
                        that._markEffect[i].setPosition(cc.p(130, 55));
                        readItem.addChild(that._markEffect[i]);
                    }

                    menu.addChild(readItem);
                }
            })(i);

        }

        this._scrollView = cc.ScrollView.create(this._friendMessageLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._friendMessageLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(cc.p(0, this._scrollView.minContainerOffset().y));
    },

    _onClickAccept: function (id) {
        return function () {
            cc.log("FriendMessageLayer _onClickAccept: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            var element = this._scrollViewElement[id];

            var friendList = gameData.friend.get("friendList");
            var len = friendList.length;
            var maxFriends = gameData.friend.get("maxFriendCount");

            if (len >= maxFriends) {
                TipLayer.tip("你的好友已达上限");
                return;
            }

            gameData.message.accept(function () {
                gameMark.updateFriendMessageMark(false);

                element.acceptItem.setVisible(false);
                element.rejectItem.setVisible(false);
                element.hasBeenAcceptIcon.setVisible(true);
            }, id);


        }
    },

    _onClickReject: function (id) {
        return function () {
            cc.log("FriendMessageLayer _onClickReject: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            var element = this._scrollViewElement[id];

            gameData.message.reject(function () {
                gameMark.updateFriendMessageMark(false);

                element.acceptItem.setVisible(false);
                element.rejectItem.setVisible(false);
                element.hasBeenRejectIcon.setVisible(true);
            }, id);

        }
    },

    _onClickAddFriend: function (name) {
        return function () {
            cc.log("FriendMessageLayer _onClickAddFriend: ");

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            gameData.friend.addFriend(name);
        }
    },

    _onClickRead: function (index) {

        var that = this;

        return function () {
            cc.log("FriendMessageLayer _onClickRead: " + index);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var message = that._friendMessageList[index];
            var id = that._friendMessageList[index].id;
            var status = that._friendMessageList[index].status;

            if (status == UNHANDLED_STATUS) {
                gameData.message.setAsRead(id, function () {
                    that._friendMessageList[index].status = HANDLED_STATUS;
                    if (that._markEffect[index]) {
                        that._markEffect[index].removeFromParent();
                        that._markEffect[index] = null;
                    }
                });
            }

            gameMark.updateFriendMessageMark(false);

            ReadMessageLayer.pop(message.sender, message.senderName, message.text);
        }
    }
});


FriendMessageLayer.create = function () {
    var ret = new FriendMessageLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};