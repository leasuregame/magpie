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
var EACH_NUM_BIT = 30;

var Pass = Entity.extend({
    _top: 0,
    _mark: [],

    init: function (data) {
        cc.log("Pass init");

        this.update(data);

        cc.log(this);

        return true;
    },

    update: function (data) {
        cc.log("Pass update");

        this.set("top", data.layer);
        this.set("mark", data.mark);
    },

    canWipeOut: function () {
        cc.log("Pass canWipOut");

        for (var i = 1; i <= this._top; ++i) {
            if (this.getMarkByIndex(i)) {
                return true
            }
        }

        return false;
    },

    getMarkByIndex: function (index) {
        cc.log("Pass getMarkByIndex " + index);

        var offset = (index - 1) % EACH_NUM_BIT;
        index = Math.floor((index - 1) / EACH_NUM_BIT);

        if (this._mark[index]) {
            return (this._mark[index] >> offset & 1 == 0);
        }

        return true;
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

                var battleLogId = BattleLogPool.getInstance().pushBattleLog(msg.battleLog, PVE_BATTLE_LOG);

                cb(battleLogId);
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
});


Pass.create = function (data) {
    var ret = new Pass();

    if (ret) {
        return ret;
    }

    return null;
};