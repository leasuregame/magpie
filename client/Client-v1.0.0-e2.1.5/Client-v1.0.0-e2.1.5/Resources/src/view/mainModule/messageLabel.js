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
    _messageLabel: null,

    init: function () {
        cc.log("MessageLabel init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.main_message_bg);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        this.addChild(bgSprite, -1);

        this.retain();

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
            this._messageLabel.setPosition(cc.p(640, 18));
            this.addChild(this._messageLabel);

            var x = 640 + this._messageLabel.getContentSize().width;

            this._messageLabel.runAction(
                cc.MoveBy.create(MESSAGE_MOVE_TIME, cc.p(-x, 0))
            );
        }
    },

    onExit: function () {
        this.release();
        this._super();
    }
});


/*
 * 单例
 * */
MessageLabel.getInstance = singleton(MessageLabel);