/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-17
 * Time: 下午4:08
 * To change this template use File | Settings | File Templates.
 */


/*
* game frame
* */


var GameFrame = cc.Layer.extend({
    init :function() {
        cc.log("GameFrame init");

        if(!this._super()) return false;

        var frame1 = cc.Sprite.create(main_scene_image.gameFrame);
        frame1.setAnchorPoint(cc.p(0, 0.5));
        frame1.setPosition(cc.p(0, 568));
        this.addChild(frame1);

        var frame2 = cc.Sprite.create(main_scene_image.gameFrame);
        frame2.setAnchorPoint(cc.p(1, 0.5));
        frame2.setPosition(cc.p(680, 568));
        this.addChild(frame2);
        frame2.setRotation(180);

        return true;
    }
});


GameFrame.create = function() {
    var ret = new GameFrame();

    if(ret && ret.init()) {
        return ret;
    }

    return null;
};