/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-8
 * Time: 下午6:08
 * To change this template use File | Settings | File Templates.
 */

/*
 * 战斗流程播放器
 * */

var BattlePlayer = cc.Class.extend({
    _scheduler: null,
    _battleLog: null,

    _cardList: null,
    _labelList: null,
    _progressList: null,
    _tipLabel: null,

    init: function () {
        cc.log("BattlePlayer init");

        this._scheduler = cc.Director.getInstance().getScheduler();
    },

    play: function (battleLog, cardList, labelList, progressList, tipLabel) {
        cc.log("BattlePlayer play");

        this._tipLabel = tipLabel;
        this._battleLog = battleLog;
        this._cardList = cardList;
        this._labelList = labelList;
        this._progressList = progressList;

        this._battleLog.recover();
        this.playAStep();
    },

    playAStep: function () {
        this._scheduler.unscheduleCallbackForTarget(this, this.playAStep);

        if (!this._battleLog.hasNextBattleStep()) {
            this.end();
            return;
        }

        cc.log("\n\n\nBattlePlayer playAStep " + this._battleLog.getBattleStepIndex());

        var step = this._battleLog.getBattleStep();

        var str = step.getAttacker() + (step.isSkill() ? " 用技能 揍了 " : " 用普攻 揍了 ");
        str += step.getAllTarget();
        str += " 伤害为 " + step.getAllEffect();

        cc.log(str);

        this._tipLabel.setString(str);

        var delay = SkillFactory.normalAttack(this._cardList, step, this._labelList, this._progressList);

        cc.log("set next round");
        this._scheduler.scheduleCallbackForTarget(this, this.playAStep, delay, 1, 0, false);
    },

    pause: function () {
        cc.log("BattlePlayer pause");
    },

    getSpeed: function () {
        cc.log("BattlePlayer getSpeed");

        return GAME_COMBAT_SPEED;
    },

    setSpeed: function (speed) {
        cc.log("BattlePlayer setSpeed");

        GAME_COMBAT_SPEED = speed;
    },

    end: function () {
        cc.log("battle end");

        this._scheduler.unscheduleAllCallbacksForTarget(this);
        this._scheduler.scheduleCallbackForTarget(this, function() {
            cc.log("replace scene MainScene");
            cc.Director.getInstance().replaceScene(MainScene.getInstance());
//            cc.Director.getInstance().replaceScene(cc.TransitionTurnOffTiles.create(1, MainScene.getInstance()));
        }, 0, 0, 1.5, false);
    }
})


/*
 * 单例
 * */
BattlePlayer.getInstance = singleton(BattlePlayer);