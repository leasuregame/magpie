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
        var effect = battleARound.e;
        if(typeof(effect) == "number") effect = [effect];

        var rebound = null;
        if(battleARound.r != null) rebound = battleARound.r;

        if(own < 0) own = -own;
        if(progressList[own] == null || progressList[own].getValue() <= 0) return 0;

        cardList[own].runAction(ActionFactory.attack().action);

        var len = enemy.length;
        for(var i = 0; i < len; ++i) {
            var type = false;
            if(enemy[i] < 0) {
                type = true;
                enemy[i] = -enemy[i];
            }

            var index = enemy[i];
            if(progressList[index] == null) continue;

            cc.log(index);
            cc.log(progressList[index].getValue());
            cc.log(effect);

            if(progressList[index].getValue() <= 0) continue;
            else progressList[index].addValue(effect[i]);

            cc.log(effect[i]);

            cc.log(progressList[index].getValue());

            cardList[index].stopAllActions();
            labelList[index].stopAllActions();

            var action = cc.Sequence.create(cc.DelayTime.create(0.5), effect[i] == 0 ? ActionFactory.miss().action : ActionFactory.hit().action);
            cardList[index].runAction(action);

            var str = "";
            if(type) {
                labelList[index].setFontSize(75);
                str += "暴"
            }
            else {
                labelList[index].setFontSize(60);
            }


            effect[i] == 0 ? str += "MISS" : str += effect[i];
            labelList[index].setOpacity(0);

            labelList[index].setString(str);
            labelList[index].runAction(cc.Sequence.create(cc.FadeIn.create(0.5), cc.ScaleTo.create(0.2, 1.5), cc.ScaleTo.create(0.1, 1.0), cc.FadeOut.create(1)));
        }

        if(rebound != null) {
            var num = 0;
            for(var i = 0; i < len; ++i) {
                if(rebound[i] != null) {
                    num += rebound[i];
                }
            }
            progressList[own].addValue(effect[i]);
        }

        if(num > 0) {
            cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(this, function() {
                labelList[own].setOpacity(0);
                var str = "弹" + num;
                labelList[own].setFontSize(50);
                labelList[own].setString(str);
                labelList[own].runAction(cc.Sequence.create(cc.FadeIn.create(0.5), cc.ScaleTo.create(0.2, 1.5), cc.ScaleTo.create(0.1, 1.0), cc.FadeOut.create(1)));
            }, 0.0, 0, 1, false);
        }


        cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(this, function() {
            for(var i = 0; i < len; ++i) {
                var index = enemy[i];
                if(progressList[index] == null) continue;

                if(progressList[index].getValue() <= 0) {
                    cc.log("remove " + index + " from parent");

                    cardList[index].setVisible(false);
                    progressList[index].setVisible(false);

                    cardList[index] = null;
                    progressList[index] = null;
//                    cardList[index].removeFromParent();
//                    progressList[index].removeFromParent();
                }
            }
        }, 0.0, 0, 1.8, false);

        return 2.0;
    }
}