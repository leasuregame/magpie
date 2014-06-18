/**
 * Created by lujunyu on 14-6-16.
 */

var DailyInstances = Entity.extend({

    init: function () {
        cc.log("DailyInstances init");
    },

    update: function () {
        cc.log("DailyInstances update");
    },

    sync: function () {
        cc.log("DailyInstances sync");
    },

    expInstance: function (id, cb) {
        cc.log("DailyInstances expInstance");

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

                player.sets({
                    power: msg.power.value,
                    powerTimestamp: msg.power.time,
                    exp: msg.exp
                });

                var battleLogId = BattleLogPool.getInstance().put(msg.battleLog);
                cb(battleLogId);

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