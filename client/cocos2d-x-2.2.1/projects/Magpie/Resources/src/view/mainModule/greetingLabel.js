/**
 * Created by lujunyu on 14-2-14.
 */

var GreetingLabel = LazyLayer.extend({
    _greetingLabelFit: null,

    _msgEditBox: null,
    _scrollView: null,
    _scrollViewLayer: null,
    _layer: [],
    _msgList: [],

    onEnter: function () {
        cc.log("GreetingLabel onEnter");
        this._super();
        this.update();
    },

    init: function () {
        cc.log("GreetingLabel init");

        if (!this._super()) return false;

        this._greetingLabelFit = gameFit.mainScene.greetingLabel;

        this._msgEditBox = null;
        this._scrollView = null;
        this._scrollViewLayer = null;
        this._layer = [];
        this._msgList = [];
        this._playerItem = [];

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(this._greetingLabelFit.bgSpriteSize);
        bgSprite.setPosition(this._greetingLabelFit.bgSpritePoint);
        this.addChild(bgSprite);

        var titleBgIcon = cc.Sprite.create(main_scene_image.icon371);
        titleBgIcon.setPosition(this._greetingLabelFit.titleBgIconPoint);
        this.addChild(titleBgIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon377);
        titleIcon.setPosition(this._greetingLabelFit.titleIconPoint);
        this.addChild(titleIcon);

        var msgBgIcon = cc.Sprite.create(main_scene_image.icon175);
        msgBgIcon.setAnchorPoint(cc.p(0, 0.5));
        msgBgIcon.setPosition(this._greetingLabelFit.msgBgIconPoint);
        msgBgIcon.setScaleY(0.5);
        msgBgIcon.setScaleX(0.8);
        this.addChild(msgBgIcon);

        var speakerIcon = cc.Sprite.create(main_scene_image.icon369);
        speakerIcon.setPosition(this._greetingLabelFit.speakerIconPoint);
        speakerIcon.setScale(0.6);
        this.addChild(speakerIcon);

        var speakerNumIcon = cc.Sprite.create(main_scene_image.icon373);
        speakerNumIcon.setPosition(this._greetingLabelFit.speakerNumPoint);
        this.addChild(speakerNumIcon);

        this._speakerNumLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 20);
        this._speakerNumLabel.setPosition(this._greetingLabelFit.speakerNumPoint);
        this.addChild(this._speakerNumLabel);

        this._scrollViewLayer = cc.Layer.create();

        var scrollViewBgLayer = cc.Scale9Sprite.create(main_scene_image.icon169);
        scrollViewBgLayer.setContentSize(this._greetingLabelFit.scrollViewBgLayerSize);
        scrollViewBgLayer.setPosition(this._greetingLabelFit.scrollViewBgLayerPoint);
        this.addChild(scrollViewBgLayer);

        this._scrollView = cc.ScrollView.create(this._greetingLabelFit.scrollViewSize, this._scrollViewLayer);
        this._scrollView.setPosition(this._greetingLabelFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 1);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        var markLayer = MarkLayer.create(this._greetingLabelFit.scrollViewLayerRect);
        markLayer.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY);
        this.addChild(markLayer);

        this._msgEditBox = cc.EditBox.create(cc.size(325, 48), cc.Scale9Sprite.create(main_scene_image.edit));
        this._msgEditBox.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY);
        this._msgEditBox.setPosition(this._greetingLabelFit.msgEditBoxPoint);
        this._msgEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._msgEditBox.setDelegate(this);
        this._msgEditBox.setFont("STHeitiTC-Medium", 26);
        this._msgEditBox.setPlaceHolder("请输入信息");
        this.addChild(this._msgEditBox);

        var sendItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button4,
            main_scene_image.button4s,
            main_scene_image.icon372,
            this._onClickSend,
            this
        );
        sendItem.setPosition(this._greetingLabelFit.sendItemPoint);

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button37,
            main_scene_image.button37s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(this._greetingLabelFit.closeItemPoint);

        var menu = cc.Menu.create(sendItem, closeItem);
        menu.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._skyDialog = SkyDialog.create();
        this.addChild(this._skyDialog, 10);

        var skyLabel = cc.Scale9Sprite.create(main_scene_image.bg16);
        skyLabel.setContentSize(cc.size(216, 300));

        var detailItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon120,
            this._onClickDetail,
            this
        );
        detailItem.setPosition(cc.p(108, 240));

        var sendMessageItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon119,
            this._onClickSendMessage,
            this
        );
        sendMessageItem.setPosition(cc.p(108, 150));

        var addFriendItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon41,
            this._onClickAddFriend,
            this
        );
        addFriendItem.setPosition(cc.p(108, 60));

        var skyMenu = cc.Menu.create(detailItem, sendMessageItem, addFriendItem);
        skyMenu.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 1);
        skyMenu.setPosition(cc.p(0, 0));
        skyLabel.addChild(skyMenu);

        this._skyDialog.setLabel(skyLabel);
        this._skyDialog.setRect(cc.rect(40, 110, 640, 700));

        return true;
    },

    insertMessages: function () {
        cc.log("GreetingLabel insertMessages");
        var msgList = gameData.greeting.getMsgList();
        var len = msgList.length;
        this._speakerNumLabel.setString(gameData.player.get("speaker"));
        for (var i = 0; i < len; i++) {
            this.pushMsg(msgList[i]);
        }
    },

    update: function () {
        cc.log("GreetingLabel update");

        this._speakerNumLabel.setString(gameData.player.get("speaker"));
        this._msgList.sort(this._sort);
        var len = this._layer.length;
        var scrollViewHeight = len * 120;
        if (scrollViewHeight < this._greetingLabelFit.scrollViewHeight) {
            scrollViewHeight = this._greetingLabelFit.scrollViewHeight;
        }
        for (var i = 0; i < len; i++) {
            var y = scrollViewHeight - 120 * i;
            this._layer[this._msgList[i].id].setPosition(cc.p(55, y));
        }
        this._scrollView.setContentSize(cc.size(600, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());
    },

    pushMsg: function (msg) {
        cc.log("GreetingLabel pushMsg");

        var len = this._layer.length;
        var index = len;

        if (len == MAX_MSG_LEN) {
            index = len - 1;
        }

        if (!this._msgList[index]) {
            this._msgList[index] = {id: index};
        }

        for (var key in msg) {
            this._msgList[index][key] = msg[key];
        }

        var id = this._msgList[index].id;

        if (this._layer[id]) {
            this._layer[id].removeFromParent();
            this._layer[id] = null;
        }

        this._layer[id] = cc.Layer.create();
        this._scrollViewLayer.addChild(this._layer[id]);

        if (msg.playerId != gameData.player.get("id")) {

            var playerMenu = LazyMenu.create();
            playerMenu.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY);
            playerMenu.setPosition(cc.p(0, 0));
            this._layer[id].addChild(playerMenu);

            var playerItem = cc.MenuItemImage.create(
                main_scene_image.edit,
                main_scene_image.edit,
                this._onClickPlayer(id),
                this
            );
            playerItem.setScaleX(17);
            playerItem.setScaleY(4);
            playerItem.setAnchorPoint(cc.p(0, 0.5));
            playerItem.setPosition(cc.p(50, -60));
            playerMenu.addChild(playerItem);

            this._playerItem[id] = playerItem;
        }

        var x = 70;

        var color = cc.c3b(255, 239, 131);
        if (msg.playerId == gameData.player.get("id")) {
            color = cc.c3b(70, 130, 176);
        }

        var nameLabel = cc.LabelTTF.create(msg.name, "STHeitiTC-Medium", 25);
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(cc.p(70, -35));
        nameLabel.setColor(color);
        this._layer[id].addChild(nameLabel);

        x += nameLabel.getContentSize().width + 15;

        if (msg.vip > 0) {
            var vipLabel = cc.Sprite.create(main_scene_image["vip" + msg.vip]);
            vipLabel.setAnchorPoint(cc.p(0, 0.5));
            vipLabel.setScale(0.75);
            vipLabel.setPosition(cc.p(x, -35));
            this._layer[id].addChild(vipLabel);

            x += vipLabel.getContentSize().width;
        }

        var timeStr = lz.getTimeStr({time: msg.created, fmt: "MM月dd日  hh:mm:ss"});
        var timeLabel = cc.LabelTTF.create(timeStr, "STHeitiTC-Medium", 20);
        timeLabel.setAnchorPoint(cc.p(0, 0.5));
        timeLabel.setPosition(cc.p(x, -38));
        timeLabel.setColor(color);
        this._layer[id].addChild(timeLabel);

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
        return b.created - a.created;
    },

    _onClickSend: function () {
        cc.log("GreetingLabel _onClickSend");
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var text = this._msgEditBox.getText();
        cc.log("send msg text: " + text);

        if (text == null || text == "") {
            TipLayer.tip("请输入信息");
            return;
        } else if (text.length > 20) {
            TipLayer.tip("信息长度不能超过20个字");
            return;
        }

        var id = 8;
        var product = gameData.shop.getProduct(id);
        var that = this;

        if (gameData.player.get("speaker") <= 0) {
            AmountLayer.pop(
                function (count) {
                    that._buySpeaker(id, count);
                },
                product
            );
            return;
        }

        gameData.greeting.sendMsg(function () {
            that._msgEditBox.setText("");
            that._speakerNumLabel.setString(gameData.player.get("speaker"));
        }, text);
    },

    _buySpeaker: function (id, count) {
        cc.log("GreetingLabel _buySpeaker");

        if (count > 0) {
            var that = this;
            gameData.shop.buyProduct(function (data) {
                that._speakerNumLabel.setString(gameData.player.get("speaker"));
                lz.tipReward(data);
            }, id, count);
        }
    },

    _onClickPlayer: function (index) {
        var that = this;
        return function () {
            cc.log("GreetingLabel _onClickPlayer: " + index);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            var point = that._layer[index].convertToWorldSpace(cc.p(273, -60));
            that._selectId = index;
            that._skyDialog.show(point);
        }
    },

    _onClickClose: function () {
        cc.log("GreetingLabel _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    },

    _onClickDetail: function () {
        cc.log("GreetingLabel _onClickDetail: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var len = this._msgList.length;
        var player = null;

        for (var i = 0; i < len; i++) {
            if (this._msgList[i].id == this._selectId) {
                player = this._msgList[i];
            }
        }

        if (player) {
            gameData.player.playerDetail(function (data) {
                cc.log(data);

                LineUpDetail.pop(data);
            }, player.playerId);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    },

    _onClickSendMessage: function () {
        cc.log("GreetingLabel _onClickSendMessage: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var len = this._msgList.length;
        var player = null;

        for (var i = 0; i < len; i++) {
            if (this._msgList[i].id == this._selectId) {
                player = this._msgList[i];
            }
        }

        if (player) {
            SendMessageLayer.pop(player.playerId, player.name);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    },

    _onClickAddFriend: function () {
        cc.log("GreetingLabel _onClickAddFriend: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var len = this._msgList.length;
        var player = null;

        for (var i = 0; i < len; i++) {
            if (this._msgList[i].id == this._selectId) {
                player = this._msgList[i];
            }
        }

        if (player) {
            gameData.friend.addFriend(player.name);
        } else {
            TipLayer.tip("找不到该玩家");
        }
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
    MainScene.getInstance().addChild(greetingLabel, 8);
};

/*
 * 单例
 * */
(function () {
    var _greetingLabel = null;

    GreetingLabel.getInstance = function () {
        if (_greetingLabel == null) {
            _greetingLabel = GreetingLabel.create();
            _greetingLabel.retain();
        }

        return _greetingLabel;
    };

    GreetingLabel.destroy = function () {
        if (_greetingLabel) {
            _greetingLabel.release();
            _greetingLabel = null;
        }
    };
})();
