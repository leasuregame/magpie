/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-15
 * Time: 下午3:00
 * To change this template use File | Settings | File Templates.
 */


/*
 * message label
 * */


var MESSAGE_MOVE_TIME = 15;

var MessageLabel = cc.Node.extend({
    _messageLabelFit: null,

    _messageLabel: null,

    onEnter: function () {
        cc.log("MessageLabel onEnter");

        this._super();

        lz.um.beginLogPageView("滑动消息条");
    },

    onExit: function () {
        cc.log("MessageLabel onExit");

        this._super();

        lz.um.endLogPageView("滑动消息条");
    },

    init: function () {
        cc.log("MessageLabel init");

        if (!this._super()) return false;

        this._messageLabelFit = gameFit.mainScene.messageLabel;

        var bgSprite = cc.Sprite.create(main_scene_image.main_message_bg);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        this.addChild(bgSprite, -1);

        return true;
    },

    push: function (msg) {
        cc.log("MessageLabel update");

        if (this.isRunning()) {
            if (this._messageLabel) {
                this._messageLabel.removeFromParent();
            }

            this._messageLabel = cc.LabelTTF.create(msg, "STHeitiTC-Medium", 20);
            this._messageLabel.setColor(cc.c3b(255, 239, 131));
            this._messageLabel.setAnchorPoint(cc.p(0, 0.5));
            this._messageLabel.setPosition(this._messageLabelFit.messageLabelPoint);
            this.addChild(this._messageLabel);

            var x = this._messageLabelFit.offsetXWidth + this._messageLabel.getContentSize().width;

            this._messageLabel.runAction(
                cc.MoveBy.create(MESSAGE_MOVE_TIME, cc.p(-x, 0))
            );
        }
    }
});


MessageLabel.create = function () {
    var ret = new MessageLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};