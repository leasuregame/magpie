/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-30
 * Time: 上午11:33
 * To change this template use File | Settings | File Templates.
 */


var GOLD_RECEIVE = 1;
var GOLD_NO_RECEIVE = 0;

var Activity = Entity.extend({
    _type: {},

    init: function () {
        cc.log("Activity init");

        this._type = {};

        this.sync();

        return true;
    },

    sync: function () {
        cc.log("Activity sync");
        var that = this;
        lz.server.request(
            "area.playerHandler.getActivityInfo",
            {},
            function (data) {
                cc.log(data);
                if (data.code == 200) {
                    cc.log("sync success");
                    that.update(data.msg.levelReward);

                    lz.server.on("onPowerGive", function (data) {
                        cc.log("***** on powerGive:");
                        cc.log(data);

                        gameMark.updatePowerRewardMark(true);
                    });

                    lz.server.on("onPowerGiveEnd", function (data) {
                        cc.log("***** on PowerGiveEnd:");
                        cc.log(data);

                        gameMark.updatePowerRewardMark(false);
                    });

                    gameMark.updateActivityMark(false);
                    gameMark.updatePowerRewardMark(data.msg.canGetPower);

                    lz.dc.event("event_activity");
                } else {
                    cc.log("sync fail");

                    that.sync();
                }
            },
            true
        );
    },

    update: function (mark) {
        cc.log("Activity update");
        for (var i = 1; i <= 10; i++) {
            var offset = (i - 1) % EACH_NUM_BIT;
            index = Math.floor((i - 1) / EACH_NUM_BIT);
            if (mark[index]) {
                if ((mark[index] >> offset & 1) == 1) {
                    this._changeTypeById(i, GOLD_RECEIVE);
                } else {
                    this._changeTypeById(i, GOLD_NO_RECEIVE);
                }
            } else {
                this._changeTypeById(i, GOLD_NO_RECEIVE);
            }
        }
    },

    getPowerReward: function (cb) {
        cc.log("Activity getPowerReward");
        lz.server.request("area.playerHandler.givePower", {}, function (data) {
            cc.log(data);
            if (data.code == 200) {
                var power = data.msg.powerValue;

                // TipLayer.tipNoBg("体力: +" + power);
                TipLayer.tipWithIcon(lz.getGameGoodsIcon("power"), " +" + power);
                gameData.player.add("power", power);

                lz.dc.event("event_give_power");
                cb();
            } else {
                TipLayer.tip(data.msg);
                cb();
            }
        });
    },

    getGoldReward: function (id, cb) {
        cc.log("Activity getGoldReward");
        var that = this;
        lz.server.request("area.playerHandler.getLevelReward", {id: id}, function (data) {
            cc.log(data);
            if (data.code == 200) {
                //TipLayer.tipNoBg("魔石: +" + data.msg.gold);
                TipLayer.tipWithIcon(lz.getGameGoodsIcon("gold"), " +" + data.msg.gold);
                gameData.player.add("gold", data.msg.gold);
                that._changeTypeById(id, GOLD_RECEIVE);

                cb(true);

                lz.dc.event("event_receive_level_reward", id);
            } else {
                TipLayer.tip(data.msg);
                cb(false);
            }
        });
    },

    _changeTypeById: function (id, type) {
        this._type[id] = type;
    },

    getTypeById: function (id) {
        return this._type[id];
    }

});

Activity.create = function () {
    var ret = new Activity();

    if (ret) {
        return ret;
    }

    return null;
};