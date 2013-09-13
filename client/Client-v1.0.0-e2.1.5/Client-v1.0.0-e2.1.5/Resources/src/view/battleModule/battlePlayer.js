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
    _battleLayer: null,
    _battleNode: null,
    _tipLabel: null,

    init: function () {
        cc.log("BattlePlayer init");

        this._scheduler = cc.Director.getInstance().getScheduler();
    },

    play: function (id) {
        cc.log("BattlePlayer play");

        this._battleNode = null;
        this._tipLabel = null;
        this._battleLog = BattleLog.create(id);

        if (this._battleLog === undefined) {
            cc.log("no find " + id + " this battle log!!");
            return;
        }

        cc.Director.getInstance().replaceScene(BattleScene.create(this._battleLog));
    },

    began: function () {
        cc.log("BattlePlayer began");

        if (this._battleNode == null || this._tipLabel == null) {
            cc.log("battle element is undefined");

            this.end();

            return;
        }

        var that = this;
        BattleBeganLayer.play(function () {
            playEffect({
                effectId: 14,
                target: that._battleLayer,
                delay: 0.1,
                loops: 1,
                scale: 1.77,
                clear: true,
                cb: function () {
                    that._battleLog.recover();
                    that._playAStep();
                }
            });
        });
    },

    _playAStep: function () {
        this._scheduler.unscheduleCallbackForTarget(this, this._playAStep);

        if (!this._battleLog.hasNextBattleStep()) {
            this.end();
            return;
        }

        cc.log("\n\n\nBattlePlayer _playAStep " + this._battleLog.getBattleStepIndex());

        var battleStep = this._battleLog.getBattleStep();

        if (battleStep.isSpiritAtk()) {
            battleStep.set("attacker", this._battleLog.getSpirit(battleStep.get("attacker")));
        }

        var str = battleStep.get("attacker") + (battleStep.get("isSkill") ? " 用技能 揍了 " : " 用普攻 揍了 ");
        str += battleStep.get("target");
        str += " 伤害为 " + battleStep.get("effect");
        cc.log(str);
        this._tipLabel.setString(str);

        var delay = SkillFactory.normalAttack(this._battleNode, battleStep);

        cc.log("set next round");
        this._scheduler.scheduleCallbackForTarget(this, this._playAStep, delay, 1, 0, false);
    },

    setBattleElement: function (battleLayer, battleNode, tipLabel) {
        cc.log("BattlePlayer setBattleElement");

        this._battleLayer = battleLayer;
        this._battleNode = battleNode;
        this._tipLabel = tipLabel;
    },

    end: function () {
        cc.log("battle end");

        this._scheduler.unscheduleAllCallbacksForTarget(this);
        this._scheduler.scheduleCallbackForTarget(this, function () {
            cc.log("replace scene MainScene");
            cc.Director.getInstance().replaceScene(MainScene.getInstance());
//            cc.Director.getInstance().replaceScene(cc.TransitionTurnOffTiles.create(1, MainScene.getInstance()));
        }, 0, 0, 1.5, false);
    }
});


/*
 * 单例
 * */
BattlePlayer.getInstance = singleton(BattlePlayer);