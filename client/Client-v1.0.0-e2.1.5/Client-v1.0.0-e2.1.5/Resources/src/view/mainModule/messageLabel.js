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


var MessageLabel = cc.Node.extend({
    onEnter: function () {
        cc.log("MessageLabel onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("MessageLabel init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.main_message_bg);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        this.addChild(bgSprite, -1);

        this._messageLabel = cc.LabelTTF.create("系统消息：", "STHeitiTC-Medium", 20);
        this._messageLabel.setColor(cc.c3b(255, 239, 131));
        this._messageLabel.setAnchorPoint(cc.p(0, 0.5));
        this._messageLabel.setPosition(cc.p(20, 18));
        this.addChild(this._messageLabel);

        return true;
    },

    update: function () {
        cc.log("MessageLabel update");

        this._messageLabel.setString("系统消息：xxxxxxxxxxxxxxxxxxxxxxx");
    }
})


MessageLabel.create = function () {
    var ret = new MessageLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}