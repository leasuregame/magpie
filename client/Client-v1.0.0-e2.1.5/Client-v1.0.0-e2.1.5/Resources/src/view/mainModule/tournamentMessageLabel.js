/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-6
 * Time: 上午11:09
 * To change this template use File | Settings | File Templates.
 */


/*
 * tournament message label
 * */


var TournamentMessageLabel = cc.Node.extend({
    onEnter: function () {
        cc.log("TournamentMessageLabel onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("TournamentMessageLabel init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.main_message_bg);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        this.addChild(bgSprite, -1);

        this._messageLabel = cc.LabelTTF.create("竞技消息：", "黑体", 22);
        this._messageLabel.setAnchorPoint(cc.p(0, 0));
        this._messageLabel.setPosition(cc.p(20, 5));
        this.addChild(this._messageLabel);

        return true;
    },

    update: function () {
        cc.log("TournamentMessageLabel update");

        this._messageLabel.setString("竞技消息：xxxxxxxxxxxxxxxxxxxxxxx");
    }
});


TournamentMessageLabel.create = function () {
    var ret = new TournamentMessageLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};