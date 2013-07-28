/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-28
 * Time: 下午5:43
 * To change this template use File | Settings | File Templates.
 */


/*
* line up layer
* */


var LineUpLayer = cc.Layer.extend({
    init : function() {
        cc.log("LineUpLayer init");

        if(!this._super()) return false;

        var bgSprite = cc.Sprite.create();
        bgSprite.setPosition(GAME_MIDPOINT);
        this.addChild(bgSprite);

        return true;
    }

})


LineUpLayer.create = function() {
    var ret = new LineUpLayer();

    if(ret && ret.init()) {
        return ret;
    }

    return null;
}