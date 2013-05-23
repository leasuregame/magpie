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
    _battleListLen : 0,
    _battleRoundIndex : 0,
    _battleList : null,
    _cardList : null,

    ctor : function() {
        this._scheduler = cc.Director.getInstance().getScheduler();
    },

    play : function(battleList, cardList) {
//        this._battleListLen = battleList.length;
        this._battleList = battleList;
        this._cardList = cardList;
        this._battleListLen = 5;
        this._battleRoundIndex = 0;
        this.playARound();
    },

    playARound : function() {
        this._scheduler.unscheduleCallbackForTarget(this, this.playARound);
//            var delay = SkillFactory.normalAttack();
            var delay = 1;
            cc.log(this._battleRoundIndex);
            this._battleRoundIndex += 1;

        if(this._battleRoundIndex < this._battleListLen)
        this._scheduler.scheduleCallbackForTarget(this, this.playARound, 0.0, 1, delay, false);
        cc.log("end");
    },

    pause : function() {

    },

    getSpeed : function() {
        return GameConfig.gameCombatSpeed;
    },

    setSpeed : function(speed) {
        GameConfig.gameCombatSpeed = speed;
    }
})

/*
 * 单例
 * */
BattlePlayer.getInstance = singleton(BattlePlayer);