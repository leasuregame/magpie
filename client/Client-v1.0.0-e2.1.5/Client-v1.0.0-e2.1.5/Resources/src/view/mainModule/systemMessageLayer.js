/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-28
 * Time: 下午6:48
 * To change this template use File | Settings | File Templates.
 */


/*
 * system message layer
 * */


var SystemMessageLayer = cc.Layer.extend({
    _scrollView: null,
    _scrollViewElement: {},

    onEnter: function () {
        cc.log("SystemMessageLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("SystemMessageLayer init");

        if (!this._super()) return false;

        return true;
    },

    update: function () {
        cc.log("SystemMessageLayer update");

        var systemMessageList = gameData.message.get("systemMessage");

        cc.log(systemMessageList);

        var len = systemMessageList.length;

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

            var id = systemMessageList[i].id;

            var hasBeenReceiveIcon = cc.Sprite.create(main_scene_image.icon136);
            hasBeenReceiveIcon.setPosition(cc.p(530, y + 60));
            scrollViewLayer.addChild(hasBeenReceiveIcon, 1);
            hasBeenReceiveIcon.setVisible(false);

            var msgBgSprite = cc.Sprite.create(main_scene_image.icon127);
            msgBgSprite.setAnchorPoint(cc.p(0, 0));
            msgBgSprite.setPosition(cc.p(0, y));
            scrollViewLayer.addChild(msgBgSprite);

            var msgLabel = cc.LabelTTF.create(systemMessageList[i].content, "STHeitiTC-Medium", 22);
            msgLabel.setAnchorPoint(cc.p(0, 0.5));
            msgLabel.setPosition(cc.p(20, y + 60));
            scrollViewLayer.addChild(msgLabel);

            var timeLabel = cc.LabelTTF.create(this._getTimeStr(systemMessageList[i].createTime), "STHeitiTC-Medium", 16);
            timeLabel.setAnchorPoint(cc.p(1, 0));
            timeLabel.setPosition(cc.p(580, y + 13));
            scrollViewLayer.addChild(timeLabel);

            var receiveItem = cc.MenuItemImage.create(
                main_scene_image.button20,
                main_scene_image.button20s,
                this._onClickReceive(id),
                this
            );
            receiveItem.setPosition(cc.p(530, y + 60));
            menu.addChild(receiveItem);

            var receiveIcon = cc.Sprite.create(main_scene_image.icon123);
            receiveIcon.setPosition(cc.p(530, y + 60));
            scrollViewLayer.addChild(receiveIcon, 1);

            this._scrollViewElement[id] = {
                hasBeenReceiveIcon: hasBeenReceiveIcon,
                receiveItem: receiveItem,
                receiveIcon: receiveIcon
            };

        }

        this._scrollView = cc.ScrollView.create(cc.size(605, 742), scrollViewLayer);
        this._scrollView.setPosition(cc.p(57, 207));
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(cc.p(0, this._scrollView.minContainerOffset().y));
    },

    _onClickReceive: function (id) {
        return function () {
            cc.log("SystemMessageLayer onClickPlayback: " + id);

            gameData.message.receive(id);

            var element = this._scrollViewElement[id];

            element.receiveItem.setVisible(false);
            element.receiveIcon.setVisible(false);
            element.hasBeenReceiveIcon.setVisible(true);
        }
    },

    _getTimeStr: function (time) {
        cc.log("SystemMessageLayer _getTimeStr");

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


SystemMessageLayer.create = function () {
    var ret = new SystemMessageLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};


/*

 gameData.message.push({
 id: 100,
 sender: 0,
 receiver: 5,
 type: 4,
 status: 6,
 content: "系统送来了一个美女",
 createTime: 3545234545
 })

 * */