/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-8
 * Time: 下午5:36
 * To change this template use File | Settings | File Templates.
 */


var TesttestLayer = cc.Layer.extend({
    init : function() {

        this._super();

        var size = cc.Director.getInstance().getWinSize();

        var bgSprite = cc.Sprite.create(s_game_bg);
        bgSprite.setPosition(size.width / 2, size.height / 2);
        this.addChild(bgSprite);

        var frameSprite = cc.Sprite.create(s_frame2);
        this.addChild(frameSprite);
        frameSprite.setPosition(size.width / 2, size.height / 2);

        var sprite = cc.Sprite.create(s_path + "b" + 4 + ".png");
        sprite.setPosition(size.width / 2, size.height / 2);
        this.addChild(sprite);

        var a1 = cc.OrbitCamera.create(2, 1, 0, 0, 45, 0, 60);

        var a2 = cc.OrbitCamera.create(2, 1, 0, 45, -90, 60, 0);

        var a3 = cc.OrbitCamera.create(2, 1, 0, -45, 90, 60, 0);

        var a4 = cc.OrbitCamera.create(2, 1, 0, 45, -90, 60, 0);

        var a5 = cc.OrbitCamera.create(2, 1, 0, -45, 90, 60, 0);

        var a6 = cc.OrbitCamera.create(2, 1, 0, 45, -45, 60, -45);

        var a = cc.OrbitCamera.create(0.5, 1, 0, 0, 40, 90, 0);

        var a1 = cc.OrbitCamera.create(2, 1, 0, 45, 10, 0, 0);
        var a2 = cc.OrbitCamera.create(2, 1, 0, 55, -10, 0, 0);

        var a1 = cc.RotateBy.create(0.2 / GAME_COMBAT_SPEED, 10);
        var a2 = cc.RotateBy.create(0.3 / GAME_COMBAT_SPEED, -20);
        var a3 = cc.RotateBy.create(0.2 / GAME_COMBAT_SPEED, 10);

//        sprite.runAction(cc.Sequence.create(a1, a2, a3, a4, a5, a6));
        sprite.runAction(cc.Sequence.create(a, a1, a2, a3));
    }
})