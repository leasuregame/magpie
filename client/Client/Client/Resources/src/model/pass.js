/**
 * Created with JetBrains WebStorm.
 * User: lcc
 * Date: 13-7-10
 * Time: 下午1:42
 * To change this template use File | Settings | File Templates.
 */


/*
 * pass
 * */


var Pass = Entity.extend({
    _pass: 0,
    _passMark: 0,

    init: function (data) {
        this.update(data);

        return true;
    },

    update: function (data) {
        this._pass = data.pass;
        this._passMark = data.passMark;
    },

    barriers: function (cb, index) {
        cc.log("BarriersLayer barriers");
        cc.log(index);

        var that = this;
        lzWindow.pomelo.request("logic.taskHandler.passBarrier", {index: index}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("barriers success");

                var msg = data.msg;

                that.update({
                    pass: msg.pass,
                    passMark: msg.passMark
                });

                var battleLog = BattleLog.create(msg.battle_log);
                BattleLogNote.getInstance().pushBattleLog(battleLog);
                cc.Director.getInstance().replaceScene(cc.TransitionPageTurn.create(1, BattleScene.create(battleLog), true));

                cb("success");
            } else {
                cc.log("barriers fail");

                cb("fail");
            }
        });
    }
})


Pass.create = function (data) {
    var ret = new Pass();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
}