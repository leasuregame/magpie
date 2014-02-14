/**
 * Created by lujunyu on 14-2-14.
 */

var GreetingLabel = LazyLayer.extend({

    _msgEditBox: null,
    _scrollView: null,
    _scrollViewLayer: null,
    _layer: [],
    _msgList: [],

    init: function () {
        cc.log("GreetingLabel init");

        if (!this._super()) return false;

        this._msgEditBox = null;
        this._scrollView = null;
        this._scrollViewLayer = null;
        this._layer = [];
        this._msgList = [];

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(540, 780));
        bgSprite.setPosition(cc.p(320, 550));
        this.addChild(bgSprite);

        var titleIcon = cc.Sprite.create(main_scene_image.icon371);
        titleIcon.setPosition(cc.p(320, 930));
        this.addChild(titleIcon);

        var msgBgIcon = cc.Sprite.create(main_scene_image.icon175);
        msgBgIcon.setAnchorPoint(cc.p(0, 0.5));
        msgBgIcon.setPosition(cc.p(70, 850));
        msgBgIcon.setScaleY(0.5);
        msgBgIcon.setScaleX(0.8);
        this.addChild(msgBgIcon);

        var speakerIcon = cc.Sprite.create(main_scene_image.icon369);
        speakerIcon.setPosition(cc.p(110, 850));
        speakerIcon.setScale(0.6);
        this.addChild(speakerIcon);

        this._msgEditBox = cc.EditBox.create(cc.size(325, 48), cc.Scale9Sprite.create(main_scene_image.edit));
        this._msgEditBox.setPosition(cc.p(305, 850));
        this._msgEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._msgEditBox.setDelegate(this);
        this._msgEditBox.setFont("STHeitiTC-Medium", 35);
        this._msgEditBox.setPlaceHolder("请输入信息");
        this.addChild(this._msgEditBox);

        var sendItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button4,
            main_scene_image.button4s,
            main_scene_image.icon372,
            this._onClickSend,
            this
        );
        sendItem.setPosition(520, 850);

        var menu = LazyMenu.create(sendItem);
        menu.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 1);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._scrollViewLayer = MarkLayer.create(cc.rect(54, 190, 600, 590));
        this._scrollViewLayer.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY);

        var scrollViewBgLayer = cc.Scale9Sprite.create(main_scene_image.icon169);
        scrollViewBgLayer.setContentSize(cc.size(500, 600));
        scrollViewBgLayer.setPosition(cc.p(320, 500));
        this.addChild(scrollViewBgLayer);

        this._scrollView = cc.ScrollView.create(cc.size(600, 590), this._scrollViewLayer);
        this._scrollView.setPosition(cc.p(70, 205));
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 1);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        var msgList = gameData.greeting.getMsgList();
        var len = 50;//msgList.length;

        for (var i = 0; i < len; i++) {
            this.pushMsg({
                time: 50 - i,
                name: "玩家" + i,
                content: "爱的勇气人评论吧乒乒乓乓噼噼啪啪劈劈啪啪"
            });
        }

        return true;
    },

    update: function () {
        cc.log("GreetingLabel update");

        this._msgList.sort(this._sort);
        var len = this._layer.length;
        var scrollViewHeight = len * 120;
        if (scrollViewHeight < 590) {
            scrollViewHeight = 590;
        }
        for (var i = 0; i < len; i++) {
            var y = scrollViewHeight - 120 * i;
            this._layer[this._msgList[i].id].setPosition(cc.p(0, y));
        }
        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());
    },

    pushMsg: function (msg) {
        cc.log("GreetingLabel pushMsg");
        cc.log(msg);

        var len = this._layer.length;
        var index = len;

        if (len == MAX_MSG_LEN) {
            index = len - 1;
        }

        if (!this._msgList[index]) {
            this._msgList[index] = {id: index};
        }

        this._msgList[index].time = msg.time;

        var id = this._msgList[index].id;

        if (this._layer[id]) {
            this._layer[id].removeFromParent();
            this._layer[id] = null;
        }



        this._layer[id] = cc.Layer.create();
        this._scrollViewLayer.addChild(this._layer[id]);

        var nameLabel = cc.LabelTTF.create(msg.name, "STHeitiTC-Medium", 25);
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(cc.p(70, -40));
        nameLabel.setColor(cc.c3b(255, 239, 131));
        this._layer[id].addChild(nameLabel);

        var contentLabel = cc.LabelTTF.create(msg.content, "STHeitiTC-Medium", 22);
        contentLabel.setAnchorPoint(cc.p(0, 0.5));
        contentLabel.setPosition(cc.p(70, -80));
        this._layer[id].addChild(contentLabel);

        var line = cc.LayerColor.create(cc.c4b(100, 66, 57, 255), 470, 5);
        line.setPosition(cc.p(55, -120));
        this._layer[id].addChild(line);

        this.update();

    },

    _sort: function (a, b) {
        return b.time - a.time;
    },

    _onClickSend: function () {
        cc.log("GreetingLabel _onClickSend");
        var text = this._msgEditBox.getText();
        cc.log("send msg text: " + text);
        if (text == null || text == "") {
            TipLayer.tip("请输入信息");
            return;
        } else if (text.length > 20) {
            TipLayer.tip("信息长度不能超过20个字");
            return;
        }

        var that = this;
//        gameData.greeting.sendMsg(function () {
//            that._msgEditBox.setText("");
//        }, text);
    }

});

GreetingLabel.create = function () {
    cc.log("GreetingLabel create");

    var ref = new GreetingLabel();
    if (ref && ref.init()) {
        return ref;
    }
    return null;
};

GreetingLabel.pop = function () {
    var greetingLabel = GreetingLabel.create();
    MainScene.getInstance().addChild(greetingLabel, 10);
};

/*
 * 单例
 * */
(function () {
    var _greetingLabel = null;

    GreetingLabel.getInstance = function () {
        if (_greetingLabel == null) {
            _greetingLabel = new GreetingLabel();
            _greetingLabel.init();
        }

        return _greetingLabel;
    };

})();
