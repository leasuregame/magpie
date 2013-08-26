/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-2
 * Time: 下午5:54
 * To change this template use File | Settings | File Templates.
 */


/*
 * skill factory
 * */


var SkillFactory = {
    normalAttack: function (battleNode, battleStep) {
        cc.log(battleStep);

        battleNode[battleStep.get("attacker")].atk();

        battleStep.recover();
        while (battleStep.hasNextTarget()) {
            battleNode[battleStep.getTarget()].defend(battleStep.getEffect(), battleStep.isCrit());
        }

        return 2.0;
    }
};