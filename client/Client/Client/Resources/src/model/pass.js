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
        this._pass = data.pass;
        this._passMark = data.passMark || 0;

        cc.log(this);

        return true;
    },

    defiance: function (cb, index) {
        cc.log("PassLayer defiance");
        cc.log(index);

        var that = this;
        lzWindow.pomelo.request("logic.taskHandler.passBarrier", {playerId: 1, index: index}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("barriers success");

                var msg = data.msg;

                var battleLog = BattleLog.create(msg);
                BattleLogNote.getInstance().pushBattleLog(battleLog);

                cb("success");
            } else {
                cc.log("barriers fail");

                cb("fail");
            }
        });
    },

    wipeOut: function(cb) {
        cc.log("Pass wipeOut");

        var that = this;

        lzWindow.pomelo.request("logic.taskHandler.wipeOut", {playerId: 1, type: "pass"}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("wipeOut success.");

                cb("success");
            } else {
                cc.log("wipeOut fail");

                cb("fail");
            }
        });
    }
})


Pass.create = function (data) {
    var ret = new Pass();

    if (ret) {
        return ret;
    }

    return null;
}