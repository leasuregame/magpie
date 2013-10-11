/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-23
 * Time: 上午11:24
 * To change this template use File | Settings | File Templates.
 */


/*
 * bubble node
 * */


var BubbleNode = cc.Node.extend({
    init: function (str) {
        cc.log("BubbleNode init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.icon222);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        this.addChild(bgSprite);

        var strList = lz.format(str, 8);
        var len = strList.length;

        for (var i = 0; i < len; ++i) {
            var strLabel = cc.LabelTTF.create(strList[i], "STHeitiTC-Medium", 18);
            strLabel.setAnchorPoint(cc.p(0, 0.5));
            strLabel.setPosition(cc.p(30, 88 - i * 25));
            this.addChild(strLabel);
        }

        this._show();

        return true;
    },

    _show: function () {
        this.setScale(0.1);

        var scaleAction = cc.ScaleTo.create(0.2, 1, 1);

        this.runAction(scaleAction);
    }
});


BubbleNode.create = function (str) {
    var ret = new BubbleNode();

    if (ret && ret.init(str)) {
        return ret;
    }

    return null;
};