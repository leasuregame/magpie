/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-30
 * Time: 上午11:33
 * To change this template use File | Settings | File Templates.
 */


var TYPE_GOLD_REWARD = "goldReward";
var TYPE_RECHARGE_REWARD = "rechargeReward";
var TYPE_LOGIN_COUNT_REWARD = "loginCountReward";

var GOLD_RECEIVE = 1;
var GOLD_NO_RECEIVE = 0;

var NO_RECHARGE_REWARD = 0;
var RECHARGE_REWARD = 1;
var ALREADY_RECHARGE_REWARD = 2;

var NO_ATTAIN_REWARD = 0;       //未达到奖励
var NOT_GOT_REWARD = 1;         //有奖励未领取
var ALREADY_GOT_REWARD = 2;     //已经领取奖励

var RECEIVE_LOGIN_REWARD = "login";
var RECEIVE_GIFT_REWARD = "recharge";
var RECEIVE_LOGIN_COUNT_REWARD = "loginCount";

var Activity = Entity.extend({
    _goldReward: {},
    _hasLoginReward: false,
    _rechargeReward: {},
    _goldRewardList: [],
    _loginCountReward: {},

    init: function () {
        cc.log("Activity init");

        this._goldReward = {};
        this._rechargeReward = {};
        this._hasLoginReward = false;
        this._loginCountReward = {};

        var rows = outputTables.player_upgrade_reward.rows;
        var index = 0;

        for (var key in rows) {
            this._goldRewardList[index] = rows[key];
            index++;
        }

        this._goldRewardList.sort(function (a, b) {
            return a.lv - b.lv;
        });

        this.sync();

        return true;
    },

    update: function (data) {
        cc.log("Activity update: ");
        cc.log(data);

        this.set("hasLoginReward", data.hasLoginReward);
        gameMark.updatePowerRewardMark(data.canGetPower);

        this.updateLevelRewardFlag(data.levelReward);
        this.updateRechargeFlag(data.rechargeFlag);
        this.updateLoginCountFlag(data.loginInfo);
    },

    sync: function () {
        cc.log("Activity sync");

        var that = this;
        lz.server.request(
            "area.playerHandler.getActivityInfo",
            {},
            function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);
                if (data.code == 200) {
                    cc.log("sync success");

                    that.update(data.msg);
                    that.setListener();

                    gameMark.updateActivityMark(false);

                    lz.um.event("event_activity");
                } else {
                    cc.log("sync fail");

                    that.sync();
                }
            },
            true
        );
    },

    setListener: function () {
        cc.log("Activity setListener");

        var that = this;

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
            gameMark.updateNewYearMark(false);
        });
    },

    updateLevelRewardFlag: function (levelReward) {
        cc.log("Activity updateLevelRewardFlag: " + levelReward);

        var mark = levelReward;
        var rows = outputTables.player_upgrade_reward.rows;

        for (var key in rows) {
            var offset = (key - 1) % EACH_NUM_BIT;
            var index = Math.floor((key - 1) / EACH_NUM_BIT);
            if (mark[index]) {
                if ((mark[index] >> offset & 1) == 1) {
                    this._changeStateById(TYPE_GOLD_REWARD, key, GOLD_RECEIVE);
                } else {
                    this._changeStateById(TYPE_GOLD_REWARD, key, GOLD_NO_RECEIVE);
                }
            } else {
                this._changeStateById(TYPE_GOLD_REWARD, key, GOLD_NO_RECEIVE);
            }
        }
    },

    updateRechargeFlag: function (flag) {
        cc.log("Activity updateRechargeFlag: " + flag);

        var canGetFlag = 0;
        var hasGetFlag = 0;

        if (flag) {
            canGetFlag = flag.canGet;
            hasGetFlag = flag.hasGet;
        }

        for (var id = 1; id <= 5; id++) {
            var offset = (id - 1) % EACH_NUM_BIT;

            if ((canGetFlag >> offset & 1) == 1) {
                this._changeStateById(TYPE_RECHARGE_REWARD, id, RECHARGE_REWARD);   //有奖励未领取
            } else {
                if ((hasGetFlag >> offset & 1) == 1) {
                    this._changeStateById(TYPE_RECHARGE_REWARD, id, ALREADY_RECHARGE_REWARD); //已领取
                } else {
                    this._changeStateById(TYPE_RECHARGE_REWARD, id, NO_RECHARGE_REWARD); //没有奖励
                }
            }
        }
    },

    updateLoginCountFlag: function (loginInfo) {
        cc.log("Activity updateLoginCountFlag: ");
        cc.log(loginInfo);

        var count = loginInfo.count;
        var got = loginInfo.got;

        for (var id = 1; id <= 30; id++) {
            if (id <= count) {
                var offset = (id - 1) % EACH_NUM_BIT;
                if ((got >> offset & 1) == 1) {
                    this._changeStateById(TYPE_LOGIN_COUNT_REWARD, id, ALREADY_GOT_REWARD);
                } else {
                    this._changeStateById(TYPE_LOGIN_COUNT_REWARD, id, NOT_GOT_REWARD);
                }
            } else {
                this._changeStateById(TYPE_LOGIN_COUNT_REWARD, id, NO_ATTAIN_REWARD);
            }
        }

        cc.log(this._loginCountReward);

    },

    getPowerReward: function (cb) {
        cc.log("Activity getPowerReward");
        lz.server.request("area.playerHandler.givePower", {}, function (data) {
            cc.log(data);
            if (data.code == 200) {
                var power = data.msg.powerValue;

                gameData.player.add("power", power);

                lz.tipReward("power", power);

                lz.um.event("event_give_power");
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
                gameData.player.add("gold", data.msg.gold);
                gameData.player.add("energy", data.msg.energy);
                that._changeStateById(TYPE_GOLD_REWARD, id, GOLD_RECEIVE);

                lz.tipReward(data.msg);

                cb(true);

                lz.um.event("event_receive_level_reward", id);
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

                gameMark.updateNewYearMark(false);
                cb();

            } else {
                cc.log("getNewYearReward fail");
                TipLayer.tip(data.msg);
            }

        });
    },

    getLoginCountReward: function (cb, day) {
        cc.log("Activity getLoginCountReward: " + day);

        var that = this;
        lz.server.request("area.activityHandler.get", {
            type: RECEIVE_LOGIN_COUNT_REWARD,
            args: {count: parseInt(day)}
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                cc.log("getLoginCountReward success");

                var reward = {};

                var table = outputTables.login_count_reward.rows[day];
                for (var key in table) {
                    if (key != "id" && key != "card_id") {
                        if (key == "fragments") {
                            reward["fragment"] = table[key];
                            gameData.player.add("fragment", table[key]);
                        } else {
                            reward[key] = table[key];
                            gameData.player.add(key, table[key]);
                        }
                    }
                }

                if (data.msg.card) {
                    var card = Card.create(data.msg.card);
                    gameData.cardList.push(card);
                    var cards = [];
                    cards.push(data.msg.card);
                    reward["cardArray"] = cards;
                }

                that._changeStateById(TYPE_LOGIN_COUNT_REWARD, day, ALREADY_GOT_REWARD);

                gameMark.updateNewAreaReward(false);

                cb(reward);

            } else {
                cc.log("getLoginCountReward fail");
                TipLayer.tip(data.msg);
            }
        });
    },

    getFirstRechargeBox: function (cb) {
        cc.log("Activity getFirstRechargeBox");

        lz.server.request("area.vipHandler.firstRechargeBox", {}, function (data) {
            cc.log(data);
            if (data.code == 200) {
                cc.log("getFirstRechargeBox success");

                var card = Card.create(data.msg.card);
                gameData.cardList.push(card);

                var cards = [];
                cards.push(data.msg.card);

                var table = outputTables.first_recharge_box.rows[1];
                var reward = {
                    "energy": table.energy,
                    "money": table.money,
                    "elixir": table.elixir,
                    "skillPoint": table.skillPoint,
                    "spirit": table.spirit,
                    "power": table.power,
                    "cardArray": cards
                };

                for (var key in reward) {
                    if (key != "cardArray") {
                        gameData.player.add(key, reward[key]);
                    }
                }

                gameData.player.set("firstRechargeBox", GOT_FIRST_RECHARGER_BOX);

                cb(reward);

            } else {
                cc.log("getFirstRechargeBox fail");
                TipLayer.tip(data.msg);
            }
        });
    },

    _changeStateById: function (type, id, state) {
        if (type == TYPE_GOLD_REWARD) {
            this._goldReward[id] = state;
        } else if (type == TYPE_RECHARGE_REWARD) {
            this._rechargeReward[id] = state;
        } else if (type == TYPE_LOGIN_COUNT_REWARD) {
            this._loginCountReward[id] = state;
        } else {
            cc.log("类型出错！！！");
        }
    },

    getStateById: function (type, id) {
        if (type == TYPE_GOLD_REWARD) {
            return this._goldReward[id];
        } else if (type == TYPE_RECHARGE_REWARD) {
            return this._rechargeReward[id];
        } else if (type == TYPE_LOGIN_COUNT_REWARD) {
            return this._loginCountReward[id];
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