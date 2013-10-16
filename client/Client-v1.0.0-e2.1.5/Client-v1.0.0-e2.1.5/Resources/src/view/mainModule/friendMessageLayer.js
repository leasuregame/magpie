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

        return true;
    },

    update: function () {
        cc.log("FriendMessageLayer update");

        var friendMessageList = gameData.message.get("friendMessage");

        cc.log(friendMessageList);

        var len = friendMessageList.length;

        if (this._scrollView != null) {
            this._scrollView.removeFromParent();
        }

        var scrollViewLayer = MarkLayer.create(cc.rect(57, 207, 605, 742));
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

            var timeLabel = cc.LabelTTF.create(this._getTimeStr(friendMessageList[i].createTime), "STHeitiTC-Medium", 16);
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

                    var acceptItem = cc.MenuItemImage.create(
                        main_scene_image.button20,
                        main_scene_image.button20s,
                        this._onClickAccept(id),
                        this
                    );
                    acceptItem.setPosition(cc.p(400, y + 60));
                    menu.addChild(acceptItem);

                    var rejectItem = cc.MenuItemImage.create(
                        main_scene_image.button20,
                        main_scene_image.button20s,
                        this._onClickReject(id),
                        this
                    );
                    rejectItem.setPosition(cc.p(530, y + 60));
                    menu.addChild(rejectItem);

                    var acceptIcon = cc.Sprite.create(main_scene_image.icon131);
                    acceptIcon.setPosition(cc.p(400, y + 60));
                    scrollViewLayer.addChild(acceptIcon, 1);

                    var rejectIcon = cc.Sprite.create(main_scene_image.icon133);
                    rejectIcon.setPosition(cc.p(530, y + 60));
                    scrollViewLayer.addChild(rejectIcon, 1);

                    this._scrollViewElement[id] = {
                        hasBeenAcceptIcon: hasBeenAcceptIcon,
                        hasBeenRejectIcon: hasBeenRejectIcon,
                        acceptItem: acceptItem,
                        rejectItem: rejectItem,
                        acceptIcon: acceptIcon,
                        rejectIcon: rejectIcon
                    };
                } else if (status == ACCEPT_STATUS) {
                    hasBeenRejectIcon.setVisible(false);
                } else if (status == REJECT_STATUS) {
                    hasBeenAcceptIcon.setVisible(false);
                }
            } else if (type == LEAVE_MESSAGE) {
                var addFriendItem = cc.MenuItemImage.create(
                    main_scene_image.button20,
                    main_scene_image.button20s,
                    this._onClickAddFriend(id),
                    this
                );
                addFriendItem.setPosition(cc.p(400, y + 60));
                menu.addChild(addFriendItem);

                var readItem = cc.MenuItemImage.create(
                    main_scene_image.button20,
                    main_scene_image.button20s,
                    this._onClickRead(friendMessageList[i].text),
                    this
                );
                readItem.setPosition(cc.p(530, y + 60));
                menu.addChild(readItem);

                var addFriendIcon = cc.Sprite.create(main_scene_image.icon132);
                addFriendIcon.setPosition(cc.p(400, y + 60));
                scrollViewLayer.addChild(addFriendIcon, 1);

                var readIcon = cc.Sprite.create(main_scene_image.icon134);
                readIcon.setPosition(cc.p(530, y + 60));
                scrollViewLayer.addChild(readIcon, 1);
            }


        }

        this._scrollView = cc.ScrollView.create(cc.size(605, 742), scrollViewLayer);
        this._scrollView.setPosition(cc.p(57, 207));
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

            var element = this._scrollViewElement[id];

            element.acceptItem.setVisible(false);
            element.rejectItem.setVisible(false);
            element.acceptIcon.setVisible(false);
            element.rejectIcon.setVisible(false);
            element.hasBeenAcceptIcon.setVisible(true);
        }
    },

    _onClickReject: function (id) {
        return function () {
            cc.log("FriendMessageLayer _onClickReject: " + id);

            gameData.message.reject(id);

            var element = this._scrollViewElement[id];

            element.acceptItem.setVisible(false);
            element.rejectItem.setVisible(false);
            element.acceptIcon.setVisible(false);
            element.rejectIcon.setVisible(false);
            element.hasBeenRejectIcon.setVisible(true);
        }
    },

    _onClickAddFriend: function () {
        return function () {
            cc.log("FriendMessageLayer _onClickAddFriend: ");

        }
    },

    _onClickRead: function (text) {
        return function () {
            cc.log("FriendMessageLayer _onClickRead: " + text);
        }
    },

    _getTimeStr: function (time) {
        cc.log("FriendMessageLayer _getTimeStr");

        var date = new Date(time);
        var today = new Date();
        var timeStr = "";

        if (today.toDateString() === date.toDateString()) {
            timeStr = date.getHours() + " : " + date.getMinutes() + " : " + date.getSeconds();
        } else {
            timeStr = date.getFullYear() + " . " + date.getMonth() + " . " + date.getDay();
        }

        return timeStr;
    }
});


FriendMessageLayer.create = function () {
    var ret = new FriendMessageLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};