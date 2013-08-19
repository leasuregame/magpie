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
    _passMark: [],

    init: function (data) {
        this.update(data);

        cc.log(this);

        return true;
    },

    update: function (data) {
        cc.log("Pass update");

        this._passTop = data.layer || 0;
        this._passMark = data.mark || [];
    },

    canWipeOut: function () {
        cc.log("Pass canWipOut");

        for (var i = 1; i <= this._passTop; ++i) {
            if (this.getPassMarkByIndex(i)) {
                return true
            }
        }

        return false;
    },

    getPassMarkByIndex: function (index) {
        cc.log("Pass getPassMarkByIndex " + index);

        return (this._passMark[index - 1] == 0);
    },

    defiance: function (cb, index) {
        cc.log("Pass defiance " + index);

        var that = this;
        lzWindow.pomelo.request("area.taskHandler.passBarrier", {
            layer: index
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("defiance success");

                var msg = data.msg;

                that.update(msg.pass);

                var battleLog = BattleLog.create(msg.battleLog);
                BattleLogNote.getInstance().pushBattleLog(battleLog);

                cb(battleLog.get("id"));
            } else {
                cc.log("defiance fail");
            }
        });
    },

    wipeOut: function (cb) {
        cc.log("Pass wipeOut");

        var that = this;

        lzWindow.pomelo.request("logic.taskHandler.wipeOut", {
            playerId: gameData.player.get("id"),
            type: "pass"
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("wipeOut success.");

                var msg = data.msg;

                that.update(msg.pass);

                var rewards = msg.rewards;
                var player = gameData.player;

                player.add("exp", rewards.exp_obtain || 0);
                player.add("gold", rewards.gold_obtain || 0);
                player.add("money", rewards.money_obtain || 0);
                player.add("skillPoint", rewards.skill_point || 0);

                cb(rewards);
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