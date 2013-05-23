/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-2
 * Time: 下午5:54
 * To change this template use File | Settings | File Templates.
 */

/*
* 技能
* */

var SkillFactory = {
    normalAttack : function(own, enemy, hit) {
        var ownAction = ActionFactory.attack();
        var enemyAction = hit ? ActionFactory.hit() : ActionFactory.miss();

        own.runAction(ownAction.action);
        enemy.runAction(enemyAction.action);

        return 1;
    }
}