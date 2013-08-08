/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-29
 * Time: 下午2:26
 * To change this template use File | Settings | File Templates.
 */


/*
 * star label
 * */


var StarLabel = cc.Node.extend({
    _count: 0,

    init: function (count) {
        cc.log("StarLabel init");

        if (!this._super()) return false;

        this._count = count;

        for (var i = 0; i < this._count; ++i) {
            var starSprite = cc.Sprite.create(main_scene_image.star1);
            starSprite.setAnchorPoint(cc.p(0, 0));
            starSprite.setPosition(cc.p(40 * i, 0));
            this.addChild(starSprite);
        }

        return true;
    },

    setOpacity: function (opacity) {
        var children = this.getChildren();
        var len = children.length;

        for (var i = 0; i < len; ++i) {
            children[i].setOpacity(opacity);
        }
    }
})


StarLabel.create = function (count) {
    var ret = new StarLabel();

    if (ret && ret.init(count)) {
        return ret;
    }

    return null;
}