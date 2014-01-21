/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-30
 * Time: 上午11:33
 * To change this template use File | Settings | File Templates.
 */

var TYPE_GOLD_REWARD = "goldReward";
var TYPE_RECHARGE_REWARD = "rechargeReward";

var GOLD_RECEIVE = 1;
var GOLD_NO_RECEIVE = 0;

var NO_RECHARGE_REWARD = 0;
var RECHARGE_REWARD = 1;
var ALREADY_RECHARGE_REWARD = 2;

var RECEIVE_LOGIN_REWARD = "login";
var RECEIVE_GIFT_REWARD = "recharge";

var Activity = Entity.extend({
    _goldReward: {},
    _hasLoginReward: false,
    _rechargeReward: {},

    init: function () {
        cc.log("Activity init");

        this._goldReward = {};
        this._rechargeReward = {};
        this._hasLoginReward = false;

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


                    that.update(data.msg);

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

                    lz.server.on("onNewYearReward", function (data) {
                        cc.log("***** on onNewYearReward:");
                        cc.log(data);

                        that.updateRechargeFlag(data.msg.flag);
                        gameMark.updateNewYearMark(true);
                    });

                    gameMark.updateActivityMark(false);

                    lz.dc.event("event_activity");
                } else {
                    cc.log("sync fail");

                    that.sync();
                }

            }, true);
    },

    update: function (data) {
        cc.log("Activity update: " + data);

        this.set("hasLoginReward", data.hasLoginReward);
        gameMark.updatePowerRewardMark(data.canGetPower);

        var mark = data.levelReward;
        for (var i = 1; i <= 10; i++) {
            var offset = (i - 1) % EACH_NUM_BIT;
            var index = Math.floor((i - 1) / EACH_NUM_BIT);
            if (mark[index]) {
                if ((mark[index] >> offset & 1) == 1) {
                    this._changeStateById(TYPE_GOLD_REWARD, i, GOLD_RECEIVE);
                } else {
                    this._changeStateById(TYPE_GOLD_REWARD, i, GOLD_NO_RECEIVE);
                }
            } else {
                this._changeStateById(TYPE_GOLD_REWARD, i, GOLD_NO_RECEIVE);
            }
        }

        this.updateRechargeFlag(data.rechargeFlag);
    },

    updateRechargeFlag: function (flag) {
        cc.log("Activity updateRechargeFlag: " + flag);

        var canGetFlag = flag.canGet;
        var hasGetFlag = flag.hasGet;

        for (var id = 1; id <= 5; id++) {
            var offset = (id - 1) % EACH_NUM_BIT;

            if ((canGetFlag >> offset & 1) == 1) {
                this._changeStateById(TYPE_RECHARGE_REWARD, id, RECHARGE_REWARD);   //有奖励未领取
            } else {
                if((hasGetFlag >> offset & 1) == 1) {
                    this._changeStateById(TYPE_RECHARGE_REWARD, id, ALREADY_RECHARGE_REWARD); //已领取
                } else {
                    this._changeStateById(TYPE_RECHARGE_REWARD, id, NO_RECHARGE_REWARD); //没有奖励
                }
            }
        }
    },

    getPowerReward: function (cb) {
        cc.log("Activity getPowerReward");
        lz.server.request("area.playerHandler.givePower", {}, function (data) {
            cc.log(data);
            if (data.code == 200) {
                var power = data.msg.powerValue;
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
                TipLayer.tipWithIcon(lz.getGameGoodsIcon("gold"), " +" + data.msg.gold);
                gameData.player.add("gold", data.msg.gold);
                that._changeStateById(TYPE_GOLD_REWARD, id, GOLD_RECEIVE);

                cb(true);

                lz.dc.event("event_receive_level_reward", id);
            } else {
                TipLayer.tip(data.msg);
                cb(false);
            }
        });
    },

    getNewYearReward: function (cb, args) {
        cc.log("Activity getNewYearReward");
        cc.log(args);

        var that = this;
        lz.server.request("area.activityHandler.get", {
            type: args.type,
            args: args.args
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                cc.log("getNewYearReward success");

                if (args.type == RECEIVE_LOGIN_REWARD) {
                    gameData.player.add("gold", 20);
                    that.set("hasLoginReward", false);
                } else {
                    var id = args.args.id;
                    var table = outputTables.new_year_rechage.rows[id];

                    that._changeStateById(TYPE_RECHARGE_REWARD, id, ALREADY_RECHARGE_REWARD);

                    gameData.player.adds({
                        energy: table.energy,
                        money: table.money,
                        fragment: table.fragments
                    });
                }

                gameMark.updateNewYearMark();
                cb();

            } else {
                cc.log("getNewYearReward fail");
                TipLayer.tip(data.msg);
            }

        });
    },

    _changeStateById: function (type, id, state) {
        if (type == TYPE_GOLD_REWARD) {
            this._goldReward[id] = state;
        } else if (type == TYPE_RECHARGE_REWARD) {
            this._rechargeReward[id] = state;
        } else {
            cc.log("类型出错！！！");
        }

    },

    getStateById: function (type, id) {
        if (type == TYPE_GOLD_REWARD) {
            return this._goldReward[id];
        } else if (type == TYPE_RECHARGE_REWARD) {
            return this._rechargeReward[id];
        } else {
            cc.log("类型出错！！！");
            return null;
        }
    }

});

Activity.create = function () {
    var ret = new Activity();

    if (ret) {
        return ret;
    }

    return null;
};