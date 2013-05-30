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
    normalAttack : function(cardList, battleARound, labelList, progressList) {
        var own = battleARound.a;
        var enemy = battleARound.d;
        if(typeof(enemy) == "number") enemy = [enemy];
        var effect = battleARound.v;
        if(typeof(effect) == "number") effect = [effect];

        if(progressList[own].getValue() <= 0) return 0;

        cardList[own].runAction(ActionFactory.attack().action);
        var len = enemy.length;
        for(var i = 0; i < len; ++i) {
            var index = enemy[i];
            cc.log(index);
            cc.log(progressList[index].getValue());

            if(progressList[index].getValue() <= 0) continue;
            else progressList[index].addValue(effect[i]);

            cc.log(progressList[index].getValue());

            cardList[index].stopAllActions();
            labelList[index].stopAllActions();

            cardList[index].runAction(effect[i] == 0 ? ActionFactory.miss().action : ActionFactory.hit().action);



            var str = "";
            effect[i] == 0 ? str += "MISS" : str += effect[i];
            labelList[index].setString(str);
            labelList[index].setVisible(true);
            labelList[index].runAction(cc.FadeOut.create(1));
        }

        cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(this, function() {
            for(var i = 0; i < len; ++i) {
                if(progressList[index].getValue() <= 0) {
                    cardList[index].setVisible(false);
                    progressList[index].setVisible(false);
                }
            }
        }, 0.0, 1, 1.2, false);

        return 1.2;
    }
}