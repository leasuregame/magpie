/**
 * Created by lujunyu on 14-6-16.
 */

var DailyInstances = Entity.extend({

    _expPassCount: null,

    init: function (data) {
        cc.log("DailyInstances init");

        this._expPassCount = 0;

        this.update(data);
    },

    update: function (data) {
        cc.log("DailyInstances update");

        this.set("expPassCount", data.expPassCount);
    },

    sync: function () {
        cc.log("DailyInstances sync");
    },

    buyExpCountNeedVip: function () {
        cc.log("DailyInstances buyExpCountNeedVip");

        var table = outputTables.vip_privilege.rows;

        for (var id in table) {
            if (table[id].exp_pass_count > 0) {
                return table[id].id;
            }
        }
    },

    expInstance: function (id, cb) {
        cc.log("DailyInstances expInstance");

        var that = this;

        lz.server.request("area.expPassHandler.attack", {
            id: id
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("expInstance success");

                var msg = data.msg;
                var player = gameData.player;
                var cbData = {};
                var upgradeInfo = msg.upgradeInfo;

                if (upgradeInfo) {
                    player.upgrade(upgradeInfo);
                    cbData.upgradeReward = upgradeInfo.rewards;
                }

                if (msg.level9Box) {
                    var box = {
                        money: msg.level9Box.money,
                        skillPoint: msg.level9Box.skillPoint,
                        energy: msg.level9Box.energy,
                        power: msg.level9Box.powerValue,
                        gold: msg.level9Box.gold
                    };

                    player.adds(box);

                    cbData.level9Box = box;
                }

                player.sets({
                    power: msg.power.value,
                    powerTimestamp: msg.power.time,
                    exp: msg.exp
                });

                that.set("expPassCount", msg.expPassCount);

                cbData.battleLogId = BattleLogPool.getInstance().put(msg.battleLog);

                cb(cbData);

            } else {
                cc.log("expInstance fail");

                TipLayer.tip(data.msg);
            }

        });
    }

});

DailyInstances.create = function () {
    cc.log("DailyInstance create");

    var ret = new DailyInstances();

    if (ret) {
        return ret;
    }

    return null;
};

DailyInstances.IsShowHandler = {
    "expInstanceLayer": function () {
        return true;
    }
};

DailyInstances.IsMarkHandler = {
    "expInstanceLayer": function () {
        return false;
    }
};