/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-3
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */


/*
 * card node
 * */


var CardNode = cc.Node.extend({
    _frameSprite: null,
    _heroSprite: null,
    _expressionSprite: null,

    init: function (card) {
        if (!this._super()) return false;

        index = card % 6 + 1;

        this._frameSprite = cc.Sprite.create(s_frame2);
        this.addChild(this._frameSprite);

        this._heroSprite = cc.Sprite.create(s_path + "b" + index + ".png");
        this.addChild(this._heroSprite);

        return true;
    },

    atk: function () {
        var a1 = cc.RotateBy.create(0.3 / GAME_COMBAT_SPEED, 30);
        var a2 = cc.RotateBy.create(0.4 / GAME_COMBAT_SPEED, -60);
        var a3 = cc.RotateBy.create(0.3 / GAME_COMBAT_SPEED, 30);
        var a = cc.Sequence.create(a1, a2, a3);

        var b = cc.Sequence.create(cc.ScaleTo.create(0.3, 1.1), cc.ScaleTo.create(0.3, 1.0));
        this.runAction(cc.Spawn.create(a, b));

//        var a = cc.OrbitCamera.create(2, 1, 0, 0, 360, 90, -45);
//        this.runAction(a);
    },

    miss: function () {
        var waitTime = cc.DelayTime.create(0.5);

        var a1 = cc.MoveBy.create(0.5 / GAME_COMBAT_SPEED, cc.p(-20, 0));
        var a2 = cc.MoveBy.create(0.5 / GAME_COMBAT_SPEED, cc.p(20, 0));
        var aa = cc.Sequence.create(waitTime.copy(), a1, a2);

        var a3 = cc.FadeOut.create(0.3 / GAME_COMBAT_SPEED);
        var a4 = cc.FadeIn.create(0.5 / GAME_COMBAT_SPEED);
        var bb = cc.Sequence.create(waitTime, a3, a4);

        this._heroSprite.runAction(bb);
        this.runAction(aa);
    },

    hit: function () {
        var waitTime = cc.DelayTime.create(0.5);

        var a1 = cc.TintTo.create(0.5 / GAME_COMBAT_SPEED, 0, 255, 255);
        var a2 = cc.TintTo.create(0.5 / GAME_COMBAT_SPEED, 255, 255, 255);
        var a = cc.Sequence.create(waitTime.copy(), a1, a2);
        this._heroSprite.runAction(a);

        var a3 = cc.MoveBy.create(0.01 / GAME_COMBAT_SPEED, cc.p(3, 0));
        var a4 = cc.MoveBy.create(0.02 / GAME_COMBAT_SPEED, cc.p(-6, 0));
        var a5 = cc.MoveBy.create(0.02 / GAME_COMBAT_SPEED, cc.p(6, 0));
        var a6 = cc.MoveBy.create(0.01 / GAME_COMBAT_SPEED, cc.p(-3, 0));
        var bb = cc.Sequence.create(waitTime.copy(), a3, a4, a5, a6);
        this.runAction(bb);
    }
})


CardNode.create = function (card) {
    var ret = new CardNode();

    if (ret && ret.init(card)) {
        return ret;
    }

    return null;
}
