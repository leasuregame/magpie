/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-10-17
 * Time: 上午3:01
 * To change this template use File | Settings | File Templates.
 */


/*
 * read message layer
 * */


var ReadMessageLayer = LazyLayer.extend({
    _id: 0,
    _name: "",

    init: function (id, name, text) {
        cc.log("ReadMessageLayer init");

        if (!this._super()) return false;

        this._id = id;
        this._name = name;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 640, 1136);
        bgLayer.setPosition(cc.p(40, 0));
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(520, 350));
        bgSprite.setPosition(cc.p(363, 600));
        this.addChild(bgSprite);

        var nameIcon = cc.LabelTTF.create("发件人:", "STHeitiTC-Medium", 25);
        nameIcon.setColor(cc.c3b(255, 248, 69));
        nameIcon.setAnchorPoint(cc.p(0, 0.5));
        nameIcon.setPosition(cc.p(160, 720));
        this.addChild(nameIcon);

        var nameLabel = cc.LabelTTF.create(this._name, "STHeitiTC-Medium", 25);
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(cc.p(255, 720));
        this.addChild(nameLabel);

        var messageLabel = cc.Scale9Sprite.create(main_scene_image.edit3);
        messageLabel.setContentSize(cc.size(460, 160));
        messageLabel.setPosition(cc.p(363, 610));
        this.addChild(messageLabel);

        this._setTextLabel(text);

        var sendMessageItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon256,
            this._onClickSendMessage,
            this
        );
        sendMessageItem.setPosition(cc.p(240, 485));

        var cancelItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon36,
            this._onClickClose,
            this
        );
        cancelItem.setPosition(cc.p(480, 485));

        var menu = cc.Menu.create(sendMessageItem, cancelItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    _setTextLabel: function (text) {
        var min = 0;
        var max = text.length;
        var index = 0;

        while (max > min) {
            var len = max - min;

            while (lz.getStrWidth(text.substr(min, len), "STHeitiTC-Medium", 25) > 425 && len > 1) {
                len -= 1;
            }

            var label = cc.LabelTTF.create(text.substr(min, len), "STHeitiTC-Medium", 25);
            label.setAnchorPoint(cc.p(0, 0.5));
            label.setPosition(cc.p(148, 660 - index * 50));
            this.addChild(label);

            index += 1;
            min += len;
        }

    },

    _onClickSendMessage: function () {
        cc.log("ReadMessageLayer _onClickSend");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._onClickClose();

        SendMessageLayer.pop(this._id, this._name);
    },

    _onClickClose: function () {
        cc.log("ReadMessageLayer _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    }
});


ReadMessageLayer.create = function (id, name, text) {
    var ret = new ReadMessageLayer();

    if (ret && ret.init(id, name, text)) {
        return ret;
    }

    return null;
};


ReadMessageLayer.pop = function (id, name, text) {
    var readMessageLayer = ReadMessageLayer.create(id, name, text);

    MainScene.getInstance().getLayer().addChild(readMessageLayer, 10);
};