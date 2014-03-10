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
    _systemMessageLayerFit: null,

    _scrollView: null,
    _scrollViewElement: {},

    onEnter: function () {
        cc.log("SystemMessageLayer onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("系统消息界面");
    },

    onExit: function () {
        cc.log("SystemMessageLayer onExit");

        this._super();

        lz.um.endLogPageView("系统消息界面");
    },

    init: function () {
        cc.log("SystemMessageLayer init");

        if (!this._super()) return false;
        this._systemMessageLayerFit = gameFit.mainScene.systemMessageLayer;
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

        var scrollViewLayer = MarkLayer.create(this._systemMessageLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = len * 127 - 20;
        if (scrollViewHeight < this._systemMessageLayerFit.scrollViewHeight) {
            scrollViewHeight = this._systemMessageLayerFit.scrollViewHeight;
        }

        this._scrollViewElement = {};

        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 107 - 127 * i;

            var id = systemMessageList[i].id;
            var status = systemMessageList[i].status;

            var hasBeenReceiveIcon = cc.Sprite.create(main_scene_image.icon138);
            hasBeenReceiveIcon.setPosition(cc.p(530, y + 60));
            scrollViewLayer.addChild(hasBeenReceiveIcon, 1);
            hasBeenReceiveIcon.setVisible(status == HANDLED_STATUS);

            var msgBgSprite = cc.Sprite.create(main_scene_image.icon127);
            msgBgSprite.setAnchorPoint(cc.p(0, 0));
            msgBgSprite.setPosition(cc.p(0, y));
            scrollViewLayer.addChild(msgBgSprite);

            var msgLabel = cc.LabelTTF.create(systemMessageList[i].content, "STHeitiTC-Medium", 22);
            msgLabel.setAnchorPoint(cc.p(0, 0.5));
            msgLabel.setPosition(cc.p(20, y + 60));
            scrollViewLayer.addChild(msgLabel);

            var timeLabel = cc.LabelTTF.create(
                lz.getTimeStr({
                    time: systemMessageList[i].createTime,
                    fmt: "yyyy.MM.dd hh:mm"
                }),
                "STHeitiTC-Medium",
                16
            );
            timeLabel.setAnchorPoint(cc.p(1, 0));
            timeLabel.setPosition(cc.p(580, y + 13));
            scrollViewLayer.addChild(timeLabel);

            var receiveItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button10,
                main_scene_image.button10s,
                main_scene_image.icon123,
                this._onClickReceive(id),
                this
            );
            receiveItem.setPosition(cc.p(520, y + 62));
            menu.addChild(receiveItem);

            receiveItem.setVisible(status == UNHANDLED_STATUS);

            this._scrollViewElement[id] = {
                hasBeenReceiveIcon: hasBeenReceiveIcon,
                receiveItem: receiveItem
            };
        }

        this._scrollView = cc.ScrollView.create(this._systemMessageLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._systemMessageLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(cc.p(0, this._scrollView.minContainerOffset().y));
    },

    _onClickReceive: function (id) {
        return function () {
            cc.log("SystemMessageLayer onClickPlayback: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var element = this._scrollViewElement[id];

            gameData.message.receive(function () {
                element.receiveItem.setVisible(false);
                element.hasBeenReceiveIcon.setVisible(true);

                gameMark.updateSystemMessageMark(false);

            }, id);
        }
    }
});


SystemMessageLayer.create = function () {
    var ret = new SystemMessageLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};