/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-10-16
 * Time: 下午4:32
 * To change this template use File | Settings | File Templates.
 */


/*
 * send message layer
 * */


var MAX_SEND_MESSAGE_LENGTH = 50;

var SendMessageLayer = LazyLayer.extend({
    _id: 0,

    init: function (id, name) {
        cc.log("SendMessageLayer init");

        if (!this._super()) return false;

        this._id = id;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 640, 1136);
        bgLayer.setPosition(cc.p(40, 0));
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(520, 300));
        bgSprite.setPosition(cc.p(363, 600));
        this.addChild(bgSprite);

        var nameIcon = cc.LabelTTF.create("收件人:", "STHeitiTC-Medium", 25);
        nameIcon.setColor(cc.c3b(255, 248, 69));
        nameIcon.setAnchorPoint(cc.p(0, 0.5));
        nameIcon.setPosition(cc.p(160, 690));
        this.addChild(nameIcon);

        var nameLabel = cc.LabelTTF.create(name, "STHeitiTC-Medium", 25);
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(cc.p(255, 690));
        this.addChild(nameLabel);

        this._messageEditBox = cc.EditBox.create(cc.size(436, 50), cc.Scale9Sprite.create(main_scene_image.edit3));
        this._messageEditBox.setPosition(cc.p(360, 610));
        this._messageEditBox.setDelegate(this);
        this._messageEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._messageEditBox.setReturnType(cc.KEYBOARD_RETURNTYPE_SEND);
        this._messageEditBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_SENTENCE);
        this._messageEditBox.setFont("STHeitiTC-Medium", 25);
        this._messageEditBox.setFontColor(cc.c3b(255, 239, 131));
        this._messageEditBox.setMaxLength(MAX_SEND_MESSAGE_LENGTH);
//        this._messageEditBox.setPlaceHolder("请输入留言内容:");
        this.addChild(this._messageEditBox);

        var sendItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon176,
            this._onClickSend,
            this
        );
        sendItem.setPosition(cc.p(240, 520));

        var cancelItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon72,
            this._onClickCancel,
            this
        );
        cancelItem.setPosition(cc.p(480, 520));

        var menu = cc.Menu.create(sendItem, cancelItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

//    editBoxReturn: function () {
//        this._onClickSend();
//    },

    _onClickSend: function () {
        cc.log("SendMessageLayer _onClickSend");

        var text = this._messageEditBox.getText();

        cc.log(text);

        if (text == "") {
            TipLayer.tip("请输入内容");
            return;
        }

        var that = this;
        gameData.player.sendMessage(function (data) {
            TipLayer.tip("留言成功");

            that._onClickCancel();
        }, this._id, text);
    },

    _onClickCancel: function () {
        cc.log("SendMessageLayer _onClickCancel");

        this.removeFromParent();
    }
});


SendMessageLayer.create = function (id, name) {
    var ret = new SendMessageLayer();

    if (ret && ret.init(id, name)) {
        return ret;
    }

    return null;
};


SendMessageLayer.pop = function (id, name) {
    var sendMessageLayer = SendMessageLayer.create(id, name);

    MainScene.getInstance().getLayer().addChild(sendMessageLayer, 10);
};

