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

    _scrollView: null,
    _scrollViewElement: {},

    onEnter: function () {
        cc.log("FriendMessageLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("FriendMessageLayer init");

        if (!this._super()) return false;

        this._friendMessageLayerFit = gameFit.mainScene.friendMessageLayer;

        return true;
    },

    update: function () {
        cc.log("FriendMessageLayer update");

        var friendMessageList = gameData.message.get("friendMessage");

        var len = friendMessageList.length;

        if (this._scrollView != null) {
            this._scrollView.removeFromParent();
        }

        var scrollViewLayer = MarkLayer.create(this._friendMessageLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = len * 127 - 20;
        if (scrollViewHeight < 742) {
            scrollViewHeight = 742;
        }

        this._scrollViewElement = {};

        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 107 - 127 * i;

            var id = friendMessageList[i].id;
            var type = friendMessageList[i].type;
            var status = friendMessageList[i].status;

            var msgBgSprite = cc.Sprite.create(main_scene_image.icon127);
            msgBgSprite.setAnchorPoint(cc.p(0, 0));
            msgBgSprite.setPosition(cc.p(0, y));
            scrollViewLayer.addChild(msgBgSprite);

            var msgLabel = cc.LabelTTF.create(friendMessageList[i].content, "STHeitiTC-Medium", 22);
            msgLabel.setAnchorPoint(cc.p(0, 0.5));
            msgLabel.setPosition(cc.p(20, y + 60));
            scrollViewLayer.addChild(msgLabel);

            var timeLabel = cc.LabelTTF.create(
                lz.getTimeStr(friendMessageList[i].createTime),
                "STHeitiTC-Medium",
                16
            );
            timeLabel.setAnchorPoint(cc.p(1, 0));
            timeLabel.setPosition(cc.p(580, y + 13));
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
                        this._onClickAccept(id),
                        this
                    );
                    acceptItem.setPosition(cc.p(375, y + 62));
                    menu.addChild(acceptItem);

                    var rejectItem = cc.MenuItemImage.createWithIcon(
                        main_scene_image.button9,
                        main_scene_image.button9s,
                        main_scene_image.icon133,
                        this._onClickReject(id),
                        this
                    );
                    rejectItem.setPosition(cc.p(520, y + 62));
                    menu.addChild(rejectItem);

                    this._scrollViewElement[id] = {
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
                var name = friendMessageList[i].senderName;

                if (!gameData.friend.getFriend(name)) {
                    var addFriendItem = cc.MenuItemImage.createWithIcon(
                        main_scene_image.button9,
                        main_scene_image.button9s,
                        main_scene_image.icon41,
                        this._onClickAddFriend(name),
                        this
                    );
                    addFriendItem.setPosition(cc.p(375, y + 62));
                    menu.addChild(addFriendItem);
                }


                var readItem = cc.MenuItemImage.createWithIcon(
                    main_scene_image.button9,
                    main_scene_image.button9s,
                    main_scene_image.icon134,
                    this._onClickRead(friendMessageList[i]),
                    this
                );
                readItem.setPosition(cc.p(520, y + 62));
                menu.addChild(readItem);
            }
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

            gameData.message.accept(id);
            gameMark.updateFriendMessageMark(false);

            var element = this._scrollViewElement[id];

            element.acceptItem.setVisible(false);
            element.rejectItem.setVisible(false);
            element.hasBeenAcceptIcon.setVisible(true);
        }
    },

    _onClickReject: function (id) {
        return function () {
            cc.log("FriendMessageLayer _onClickReject: " + id);

            gameData.message.reject(id);
            gameMark.updateFriendMessageMark(false);

            var element = this._scrollViewElement[id];

            element.acceptItem.setVisible(false);
            element.rejectItem.setVisible(false);
            element.hasBeenRejectIcon.setVisible(true);
        }
    },

    _onClickAddFriend: function (name) {
        return function () {
            cc.log("FriendMessageLayer _onClickAddFriend: ");

            gameData.friend.addFriend(name);
        }
    },

    _onClickRead: function (message) {
        return function () {
            cc.log("FriendMessageLayer _onClickRead: " + message);

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