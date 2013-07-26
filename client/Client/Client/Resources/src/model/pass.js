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


var MAX_PASS_COUNT = 100;
var PASS_BOSS_SPACE = 5;

var Pass = Entity.extend({
    _passTop: 0,
    _passMark: 0,

    init: function (data) {
        this.update(data);

        return true;
    },

    update: function(data) {
        cc.log("Pass update");

        this._passTop = data.pass;
        this._passMark = data.passMark || 0;
    },

    getPassMarkByIndex: function(index) {
        cc.log("Pass getPassMarkByIndex");

        return (((this._passMark >> (index - 1)) & 1) == 0);
    },

    getPassMarkList: function() {
        cc.log("Pass getPassMarkList");

        var passMarkList = [];
        for(var i = 1; i <= MAX_PASS_COUNT; ++i) {
            passMarkList[i] = (((this._passMark >> (i - 1)) & 1) == 0);
        }

        return passMarkList;
    },

    defiance: function (cb, index) {
        cc.log("PassLayer defiance");
        cc.log(index);

        var that = this;
        lzWindow.pomelo.request("logic.taskHandler.passBarrier", {playerId: gameData.player.get("id"), index: index}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("barriers success");

                var msg = data.msg;

                that.update({
                    pass: msg.pass,
                    passMark: msg.passMark
                })

                var battleLog = BattleLog.create(msg.battleLog);
                BattleLogNote.getInstance().pushBattleLog(battleLog);

                cb(battleLog.get("id"));
            } else {
                cc.log("barriers fail");
            }
        });
    },

    wipeOut: function(cb) {
        cc.log("Pass wipeOut");

        var that = this;

        lzWindow.pomelo.request("logic.taskHandler.wipeOut", {playerId: gameData.player.get("id"), type: "pass"}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("wipeOut success.");

                var msg = data.msg;

                that.update({
                    pass: msg.pass,
                    passMark: msg.passMark
                })

                cb("success");
            } else {
                cc.log("wipeOut fail");
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