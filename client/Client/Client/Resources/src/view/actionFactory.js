/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-21
 * Time: 下午12:30
 * To change this template use File | Settings | File Templates.
 */

/*
* 动作
* */

var ActionFactory = {
    attack : function() {
        var a1 = cc.RotateTo.create(0.3 / GAME_COMBAT_SPEED, 30);
        var a2 = cc.RotateTo.create(0.4 / GAME_COMBAT_SPEED, 330);
        var a3 = cc.RotateTo.create(0.3 / GAME_COMBAT_SPEED, 360);
        var a = cc.Sequence.create(a1, a2, a3);

        return {action : a, time : 1.0 / GAME_COMBAT_SPEED};
    },

    hit : function() {
        var a1 = cc.TintTo.create(0.5 / GAME_COMBAT_SPEED, 0, 255, 255);
        var a2 = cc.TintTo.create(0.5 / GAME_COMBAT_SPEED, 255, 255, 255);
        var a = cc.Sequence.create(a1, a2);

        return {action : a, time : 1.0 / GAME_COMBAT_SPEED};
    },

    miss : function() {
        var a1 = cc.MoveBy.create(0.5 / GAME_COMBAT_SPEED, cc.p(-20, 0));
        var a2 = cc.MoveBy.create(0.5 / GAME_COMBAT_SPEED, cc.p(20, 0));
        var aa = cc.Sequence.create(a1, a2);
        var a3 = cc.FadeOut.create(0.3 / GAME_COMBAT_SPEED);
        var a4 = cc.FadeIn.create(0.5 / GAME_COMBAT_SPEED);
        var bb = cc.Sequence.create(a3, a4);
        var a = cc.Spawn.create(aa, bb);

        return {action : a, time : 1.0 / GAME_COMBAT_SPEED};
    }
}
