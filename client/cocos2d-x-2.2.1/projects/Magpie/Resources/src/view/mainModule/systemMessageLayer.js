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

    _messages: [],
    _scrollView: null,
    _scrollViewElement: {},
    _handlerIcons: [],

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


        this._messages = systemMessageList;
        var scrollViewLayer = MarkLayer.create(this._systemMessageLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = len * 127;
        if (scrollViewHeight < this._systemMessageLayerFit.scrollViewHeight) {
            scrollViewHeight = this._systemMessageLayerFit.scrollViewHeight;
        }


        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 127 - 127 * i;
            var message = this._messages[i];

            var msgBgLabel = cc.Sprite.create(main_scene_image.icon449);
            msgBgLabel.setAnchorPoint(cc.p(0, 0));
            msgBgLabel.setPosition(cc.p(0, y));
            scrollViewLayer.addChild(msgBgLabel);

            var systemIcon = cc.Sprite.create(main_scene_image.icon452);
            systemIcon.setAnchorPoint(cc.p(0, 0.5));
            systemIcon.setPosition(cc.p(10, 57));
            msgBgLabel.addChild(systemIcon);

            var titleIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
            titleIcon.setContentSize(cc.size(200, 30));
            titleIcon.setAnchorPoint(cc.p(0, 0.5));
            titleIcon.setPosition(cc.p(115, 85));
            msgBgLabel.addChild(titleIcon);

            var titleLabel = cc.LabelTTF.create(message.title, "STHeitiTC-Medium", 22);
            titleLabel.setAnchorPoint(cc.p(0, 0.5));
            titleLabel.setPosition(cc.p(130, 85));
            msgBgLabel.addChild(titleLabel);

            var senderLabel = cc.LabelTTF.create("发件人：", "STHeitiTC-Medium", 22);
            senderLabel.setAnchorPoint(cc.p(0, 0.5));
            senderLabel.setPosition(cc.p(120, 52));
            senderLabel.setColor(cc.c3b(138, 85, 23));
            msgBgLabel.addChild(senderLabel);

            var nameLabel = cc.LabelTTF.create(message.sender, "STHeitiTC-Medium", 22);
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(205, 52));
            nameLabel.setColor(cc.c3b(123, 61, 56));
            msgBgLabel.addChild(nameLabel);

            var timeLabel = cc.LabelTTF.create(
                lz.getTimeStr({
                    time: message.createTime,
                    fmt: "dd-MM-yyyy hh:mm:ss"
                }),
                "STHeitiTC-Medium",
                20
            );
            timeLabel.setAnchorPoint(cc.p(0, 0.5));
            timeLabel.setPosition(cc.p(120, 22));
            timeLabel.setColor(cc.c3b(138, 85, 23));
            msgBgLabel.addChild(timeLabel);

            var readItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon134,
                this._onClickRead(i),
                this
            );
            readItem.setPosition(cc.p(520, y + 52));
            menu.addChild(readItem);

            var handlerIcon = cc.Sprite.create(main_scene_image.icon455);
            handlerIcon.setAnchorPoint(cc.p(1, 1));
            handlerIcon.setPosition(cc.p(604, y + 112));
            handlerIcon.setVisible(message.status == HANDLED_STATUS);
            scrollViewLayer.addChild(handlerIcon, 1);

            this._handlerIcons[i] = handlerIcon;
        }

        this._scrollView = cc.ScrollView.create(this._systemMessageLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._systemMessageLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(cc.p(0, this._scrollView.minContainerOffset().y));
    },

    _onClickRead: function (id) {
        var that = this;

        return function () {
            cc.log("SystemMessageLayer _onClickRead: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var cb = function () {
                that._handlerIcons[id].setVisible(true);
            };

            SystemMessageLabel.pop({
                message: that._messages[id],
                cb: cb
            });

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