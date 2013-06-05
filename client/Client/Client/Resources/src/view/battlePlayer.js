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
    _scheduler : null,
    _battleLogLen : 0,
    _battleRoundIndex : 0,
    _battleLog : null,
    _cardList : null,
    _labelList : null,
    _progressList : null,
    _tipLabel : null,

    init : function() {
        cc.log("BattlePlayer init");

        this._scheduler = cc.Director.getInstance().getScheduler();
    },

    play : function(battleLog, cardList, labelList, progressList, tipLabel) {
        cc.log("BattlePlayer play");

        this._tipLabel = tipLabel;
        this._battleLog = battleLog;
        this._cardList = cardList;
        this._labelList = labelList;
        this._progressList = progressList;
        this._battleLogLen = this._battleLog.length;
        this._battleRoundIndex = 0;
        this.playARound();
    },

    playARound : function() {
        this._scheduler.unscheduleCallbackForTarget(this, this.playARound);

        cc.log("\n\n\nBattlePlayer playARound " + this._battleRoundIndex);

        var battleARound = this._battleLog[this._battleRoundIndex];

        cc.log(battleARound);

        var own = battleARound.a < 0 ? -battleARound.a : battleARound.a;
        var str = own + (battleARound.a > 0 ? " 用普攻 " : " 用技能 ");
        for(var i = 0; i < battleARound.d.length; ++i) {
            var index = battleARound.d[i];
            str += (index < 0 ? -index : index) + " ";
        }
        str += "伤害为 " + battleARound.e;

        cc.log(str);

        this._tipLabel.setString(str);

        var delay = SkillFactory.normalAttack(this._cardList, battleARound, this._labelList, this._progressList);
        this._battleRoundIndex += 1;

        if(this._battleRoundIndex < this._battleLogLen) {
            cc.log("set next round");

            this._scheduler.scheduleCallbackForTarget(this, this.playARound, delay, 1, 0, false);
        }
        else {
            cc.log("battle is over, set back MainScene");

            this._scheduler.scheduleCallbackForTarget(this, function() {
                cc.log("pop battle scene");
//                cc.Director.getInstance().replaceScene(cc.TransitionTurnOffTiles.create(1, MainScene.create()));
                cc.Director.getInstance().replaceScene(MainScene.create());
            }, 0.0, 0, 5, false);
        }
    },

    pause : function() {
        cc.log("BattlePlayer pause");
    },

    getSpeed : function() {
        cc.log("BattlePlayer getSpeed");

        return GAME_COMBAT_SPEED;
    },

    setSpeed : function(speed) {
        cc.log("BattlePlayer setSpeed");

        GAME_COMBAT_SPEED = speed;
    }
})


/*
 * 单例
 * */
BattlePlayer.getInstance = singleton(BattlePlayer);