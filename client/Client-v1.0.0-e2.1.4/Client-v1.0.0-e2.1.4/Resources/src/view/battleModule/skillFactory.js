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
    normalAttack: function (cardList, battleStep, labelList, progressList) {
//        cardList[battleStep.getAttacker()].runAction(ActionFactory.attack().action);
        cardList[battleStep.getAttacker()].atk();

        battleStep.recover();
        while (battleStep.hasNextTaget()) {
            var isCrit = battleStep.isCrit();
            var taget = battleStep.getTarget();
            var effect = battleStep.getEffect();

            if (progressList[taget] == null) continue;

            cc.log("taget " + taget);
            cc.log(progressList[taget].getValue());
            cc.log("effect " + effect);

            if (progressList[taget].getValue() <= 0) continue;
            else progressList[taget].addValue(effect);

            cc.log(progressList[taget].getValue());

            cardList[taget].stopAllActions();
            labelList[taget].stopAllActions();

            if (effect == 0) cardList[taget].miss();
            else cardList[taget].hit();

            var str = "";
            if (isCrit) {
                labelList[taget].setFontSize(75);
                str += "暴"
            }
            else {
                labelList[taget].setFontSize(60);
            }

            if (effect == 0) {
                labelList[taget].setColor(cc.c3b(0, 0, 255));
                str += "MISS";
            }
            else {
                str += effect;

                if (effect > 0) {
                    labelList[taget].setColor(cc.c3b(0, 255, 0));
                }
                else {
                    labelList[taget].setColor(cc.c3b(255, 0, 0));
                }
            }


            labelList[taget].setOpacity(0);

            labelList[taget].setString(str);
            labelList[taget].runAction(cc.Sequence.create(cc.FadeIn.create(0.5), cc.ScaleTo.create(0.2, 1.5), cc.ScaleTo.create(0.1, 1.0), cc.FadeOut.create(1)));
        }


        cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(this, function () {
            battleStep.recover();
            while (battleStep.hasNextTaget()) {
                var taget = battleStep.getTarget();

                if (progressList[taget] == null) continue;

                if (progressList[taget].getValue() <= 0) {
                    cc.log("remove " + taget + " from parent");

                    cardList[taget].setVisible(false);
                    progressList[taget].setVisible(false);

                    cardList[taget] = null;
                    progressList[taget] = null;
                }
            }
        }, 0.0, 0, 1.8, false);

        return 2.0;
    }
};