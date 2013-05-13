/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-21
 * Time: 下午12:30
 * To change this template use File | Settings | File Templates.
 */

var ActionFactory = {
    attack : function() {
        var a1 = cc.RotateTo.create(0.3 / GameCombatSpeed, 30);
        var a2 = cc.RotateTo.create(0.4 / GameCombatSpeed, 330);
        var a3 = cc.RotateTo.create(0.3 / GameCombatSpeed, 360);
        var a = cc.Sequence.create(a1, a2, a3);

        return {action : a, time : 1.0 / GameCombatSpeed};
    },

    hit : function() {
        var a1 = cc.TintTo.create(0.5 / GameCombatSpeed, 0, 255, 255);
        var a2 = cc.TintTo.create(0.5 / GameCombatSpeed, 255, 255, 255);
        var a = cc.Sequence.create(a1, a2);

        return {action : a, time : 1.0 / GameCombatSpeed};
    },

    miss : function() {
        var a1 = cc.MoveBy.create(0.5 / GameCombatSpeed, cc.p(-20, 0));
        var a2 = cc.MoveBy.create(0.5 / GameCombatSpeed, cc.p(20, 0));
        var aa = cc.Sequence.create(a1, a2);
        var a3 = cc.FadeOut.create(0.3 / GameCombatSpeed);
        var a4 = cc.FadeIn.create(0.5 / GameCombatSpeed);
        var bb = cc.Sequence.create(a3, a4);
        var a = cc.Spawn.create(aa, bb);

        return {action : a, time : 1.0 / GameCombatSpeed};
    }
}
