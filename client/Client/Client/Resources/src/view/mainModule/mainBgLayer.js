/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午10:52
 * To change this template use File | Settings | File Templates.
 */


/*
 *  main bg layer
 * */


var MainBgLayer = cc.Layer.extend({
    init: function () {
        cc.log("MainBgLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(s_game_bg);
        bgSprite.setPosition(GAME_MIDPOINT);
        this.addChild(bgSprite);

        return true;
    }
})


MainBgLayer.create = function () {
    var ret = new MainBgLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}