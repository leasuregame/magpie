/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-25
 * Time: 下午3:44
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle log
 * */


(function () {
    var BattleLog = function (param) {
        this.id = param.id;
        this.createTime = param.createTime;
        this.own = param.own;
        this.enemy = param.own;
        this.battleLog = param.battleLog;
    }

    module.exports = BattleLog;

}).call(this);