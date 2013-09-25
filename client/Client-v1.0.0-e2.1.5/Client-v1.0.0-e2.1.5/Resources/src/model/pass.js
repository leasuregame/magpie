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
    _hasMystical: false,
    _canReset: false,

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
        this.set("hasMystical", data.hasMystical);
        this.set("canReset", data.canReset);
    },

    getTop: function () {
        cc.log("Pass getLocal");

        if (this._top < MAX_PASS_COUNT) {
            return (this._top + 1);
        }

        return MAX_PASS_COUNT;
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

    canReset: function () {
        cc.log("Pass canReset");

        if (this.canWipeOut()) {
            return false;
        }

        return this._canReset;
    },

    canDefiance: function (index) {
        cc.log("Pass canDefiance " + index);

        if (index < this._top + 1) {
            return this.getMarkByIndex(index);
        }

        return false;
    },

    isBossPass: function (index) {
        cc.log("Pass isBossPass: " + index);

        return (index % PASS_BOSS_SPACE == 0);
    },

    getMarkByIndex: function (index) {
        cc.log("Pass getMarkByIndex " + index);

        var offset = (index - 1) % EACH_NUM_BIT;
        index = Math.floor((index - 1) / EACH_NUM_BIT);

        if (this._mark[index]) {
            return ((this._mark[index] >> offset & 1) == 0);
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

                gameData.player.update({
                    power: msg.power,
                    lv: msg.lv,
                    exp: msg.exp
                });

                gameData.spirit.update(msg.spiritor);

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
        lzWindow.pomelo.request("area.taskHandler.wipeOut", {
            type: "pass"
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("wipeOut success");

                var msg = data.msg;

                that.update({
                    mark: msg.mark
                });

                var reward = msg.rewards;
                var player = gameData.player;

                player.adds({
                    exp: reward.exp_obtain,
                    money: reward.money_obtain,
                    skillPoint: reward.skill_point
                });

                player.update({
                    power: msg.power,
                    lv: msg.lv,
                    exp: msg.exp
                });

                var cbData = {
                    exp: reward.exp_obtain,
                    money: reward.money_obtain,
                    skillPoint: reward.skill_point
                };

                cb(cbData);
            } else {
                cc.log("wipeOut fail");
            }
        });
    },

    mystical: function (cb) {
        cc.log("Pass mystical");

        var that = this;
        lzWindow.pomelo.request("area.taskHandler.mysticalPass", {}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("mystical success");

                var msg = data.msg;

                gameData.spirit.update(msg.spiritor);

                var battleLogId = BattleLogPool.getInstance().pushBattleLog(msg.battleLog, PVE_BATTLE_LOG);

                cb(battleLogId);
            } else {
                cc.log("mystical fail");
            }
        });
    },

    reset: function (cb) {
        cc.log("Pass reset");

        var that = this;
        lzWindow.pomelo.request("area.taskHandler.wipeOut", {}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("wipeOut success");

                var msg = data.msg;

                that.update({
                    mark: []
                });

                gameData.player.update({
                    gold: msg.gold
                });

                cb();
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