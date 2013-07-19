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


var MessageLabel = cc.Layer.extend({
    onEnter: function() {
        cc.log("MessageLabel onEnter");

        this._super();
        this.update();
    },

    init: function() {
        cc.log("MessageLabel init");

        if(!this._super()) return false;

        var bg = cc.LayerColor.create(cc.c4b(100, 100, 0, 100), GAME_WIDTH, 30);
        this.addChild(bg);

        this._messageLabel = cc.LabelTTF.create("系统消息：", 'Times New Roman', 25);
        this._messageLabel.setAnchorPoint(cc.p(0, 0));
        this.addChild(this._messageLabel);

        return true;
    },

    update: function() {
        cc.log("MessageLabel update");

        this._messageLabel.setString("系统消息：有一个SB又升级失败啦。。。哇哈哈哈哈哈。");
    }
})


MessageLabel.create = function() {
    var ret = new MessageLabel();

    if(ret && ret.init()) {
        return ret;
    }

    return null;
}