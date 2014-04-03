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

        if (!data) return;

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

        if (this._top == 0) {
            return false;
        }

        if (this.canWipeOut()) {
            return false;
        }

        return this._canReset;
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

    defiance: function (cb, id) {
        cc.log("Pass defiance " + id);

        var that = this;
        lz.server.request("area.taskHandler.passBarrier", {
            layer: id
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("defiance success");

                var msg = data.msg;
                var player = gameData.player;
                var cbData = {};
                var upgradeInfo = msg.upgradeInfo;

                that.update(msg.pass);

                player.set("exp", msg.exp);

                if (upgradeInfo) {
                    player.upgrade(upgradeInfo);

                    cbData.upgradeReward = upgradeInfo.rewards;
                }

                if (msg.level9Box) {
                    var box = {
                        money: msg.level9Box.money,
                        skillPoint: msg.level9Box.skillPoint,
                        energy: msg.level9Box.energy,
                        power: msg.level9Box.powerValue
                    };

                    player.adds(box);

                    cbData.level9Box = box;
                }


                cc.log("firstWin: " + msg.firstWin);

                if (msg.firstWin) {
                    cbData.isFirstPassWin = msg.firstWin;
                }

                cbData.battleLogId = BattleLogPool.getInstance().put(msg.battleLog);

                cb(cbData);

                lz.um.event("event_pass", id);
            } else {
                cc.log("defiance fail");

                TipLayer.tip(data.msg);

                cb(null);
            }
        });
    },

    wipeOut: function (cb) {
        cc.log("Pass wipeOut");

        var that = this;
        lz.server.request("area.taskHandler.wipeOut", {
            type: "pass"
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("wipeOut success");

                var msg = data.msg;
                var player = gameData.player;
                var cbData = {};
                var upgradeInfo = msg.upgradeInfo;
                var reward = msg.rewards;

                that.update({
                    mark: msg.mark
                });

                player.adds({
                    money: reward.money_obtain,
                    skillPoint: reward.skill_point
                });

                player.set("exp", msg.exp);

                if (upgradeInfo) {
                    player.upgrade(upgradeInfo);

                    cbData.upgradeReward = upgradeInfo.rewards;
                }

                if (msg.level9Box) {
                    var box = {
                        money: msg.level9Box.money,
                        skillPoint: msg.level9Box.skillPoint,
                        energy: msg.level9Box.energy,
                        power: msg.level9Box.powerValue
                    };

                    player.adds(box);

                    cbData.level9Box = box;
                }

                if (msg.firstWin) {
                    cbData.isFirstPassWin = msg.firstWin;
                }

                cbData.reward = {
                    exp: reward.exp_obtain,
                    money: reward.money_obtain,
                    skillPoint: reward.skill_point
                };

                cb(cbData);

                lz.um.event("event_wipe_out_pass");
            } else {
                cc.log("wipeOut fail");

                TipLayer.tip(data.msg);

                cb(null);
            }
        });
    },

    mystical: function (cb) {
        cc.log("Pass mystical");

        var that = this;
        lz.server.request("area.taskHandler.mysticalPass", {}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("mystical success");

                var msg = data.msg;

                that.update({
                    hasMystical: msg.hasMystical || false
                });

                var battleLogId = BattleLogPool.getInstance().put(msg.battleLog);

                cb(battleLogId);

                lz.um.event("event_mystical");
            } else {
                cc.log("mystical fail");

                TipLayer.tip(data.msg);

                cb(null);
            }
        });
    },

    reset: function (cb) {
        cc.log("Pass reset");

        var that = this;
        lz.server.request("area.taskHandler.resetPassMark", {}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("reset success");

                var msg = data.msg;

                that.update({
                    mark: [],
                    canReset: msg.canReset || false
                });

                gameData.player.sets({
                    gold: msg.gold
                });

                cb();

                lz.um.event("event_reset_pass");
            } else {
                cc.log("reset fail");

                TipLayer.tip(data.msg);
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