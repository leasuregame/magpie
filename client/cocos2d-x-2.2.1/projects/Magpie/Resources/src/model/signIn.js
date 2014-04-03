/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-6
 * Time: 下午2:23
 * To change this template use File | Settings | File Templates.
 */


/*
 * sign in
 * */


var MAX_SIGN_IN_HISTORY = 12;

var SignIn = Entity.extend({
    _monthsMark: [],
    _flag: [],

    init: function () {
        cc.log("SignIn init");

        this._monthsMark = [];
        this._flag = [];

        this.sync();
    },

    update: function (data) {
        cc.log("SignIn update");
        cc.log(data);

        var months = data || {};

        this._flag = [];
        this._monthsMark = [];

        for (var i = 0; i < MAX_SIGN_IN_HISTORY; ++i) {
            var monthMark = this._getMonthData(i);

            var key = monthMark.year.toString() + monthMark.month.toString();

            if (months[key]) {
                monthMark.mark = months[key].mark || 0;
                this._flag[i] = months[key].flag || 0;
            } else {
                monthMark.mark = 0;
                this._flag[i] = 0;
            }

            monthMark.count = 0;
            for (var j = 0; j < monthMark.days; ++j) {
                monthMark.count += monthMark.mark >> j & 1;
            }

            this._monthsMark[i] = monthMark;
        }
    },

    sync: function () {
        cc.log("SignIn sync");

        var that = this;
        lz.server.request(
            "area.dailyHandler.signInDetails",
            {},
            function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);

                if (data.code == 200) {
                    cc.log("sync success");

                    var msg = data.msg;

                    that.update(msg);

                    gameMark.updateSignInMark(false);

                    lz.um.event("event_sign_in_record");
                } else {
                    cc.log("sync fail");

                    that.sync();
                }
            },
            true
        );
    },

    getMonthMark: function (index) {
        cc.log("SignIn getMonthMark");

        return this._monthsMark[index];
    },

    getRewardList: function () {
        cc.log("SignIn getRewardList");

        var table = outputTables.signIn_rewards.rows;

        var rewardList = [];

        for (var key in table) {
            rewardList.push(table[key]);
        }

        rewardList.sort(this._cmp);

        return rewardList;
    },

    canSignIn: function (index) {
        cc.log("MonthLabel canSignIn");

        if (index == 0) {
            var day = new Date().getDate() - 1;
            if (this._monthsMark[0]) {
                return ((this._monthsMark[0].mark >> day & 1) != 1);
            }
        }

        return false;
    },

    canRemedySignIn: function (index) {
        cc.log("MonthLabel canRemedySignIn");

        if (index == 0) {
            var nowDay = new Date().getDate();

            var signIn = 0;
            if (this.canSignIn(index)) {
                signIn = 1;
            }

            if (this._monthsMark[0]) {
                return (this._monthsMark[0].count < nowDay - signIn);
            }
        }

        return false;
    },

    canReceive: function (index, i) {
        cc.log("MonthLabel canReceive");

        if (this._flag[index]) {
            return ((this._flag[index] >> i & 1) != 1);
        }

        return true;
    },

    signIn: function (cb) {
        cc.log("SignIn signIn");

        var that = this;
        lz.server.request("area.dailyHandler.signIn", {}, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("signIn success");

                var msg = data.msg;

                gameData.player.adds({
                    money: msg.money,
                    energy: msg.energy
                });

                var day = new Date().getDate() - 1;
                that._monthsMark[0].mark |= (1 << day);
                that._monthsMark[0].count += 1;

                cb(msg);

                lz.um.event("event_sign_in");
            } else {
                cc.log("signIn fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    remedySignIn: function (cb) {
        cc.log("SignIn remedySignIn");

        var that = this;
        lz.server.request("area.dailyHandler.reSignIn", {}, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("remedySignIn success");

                var msg = data.msg;

                gameData.player.adds({
                    money: msg.reward.money,
                    energy: msg.reward.energy,
                    gold: -msg.goldResume
                });

                var day = msg.day - 1;
                that._monthsMark[0].mark |= (1 << day);
                that._monthsMark[0].count += 1;

                cb(msg.reward);

                lz.um.event("event_remedy_sign_in");
            } else {
                cc.log("remedySignIn fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    receiveReward: function (cb, id) {
        cc.log("SignIn receiveReward: " + id);

        var that = this;
        lz.server.request("area.dailyHandler.getSignInGift", {
            id: id
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("signIn success");

                var table = outputTables.signIn_rewards.rows[id];

                gameData.player.adds({
                    money: table.money,
                    energy: table.energy,
                    skillPoint: table.skillPoint,
                    elixir: table.elixir,
                    fragment: table.fragments,
                    gold: table.gold
                });
                gameData.spirit.add("exp", table.spirit);
                gameData.treasureHunt.add("freeCount", table.lottery_free_count);

                that._flag[0] = that._flag[0] | (1 << (id - 1));

                cb({
                    money: table.money,
                    energy: table.energy,
                    skillPoint: table.skillPoint,
                    elixir: table.elixir,
                    fragment: table.fragments,
                    gold: table.gold,
                    spirit: table.spirit,
                    freeCount: table.lottery_free_count
                });

                lz.um.event("event_receive_sign_in_reward", id);
            } else {
                cc.log("signIn fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    _getMonthData: function (index) {
        cc.log("MonthLabel _getMonthData");

        var today = new Date();
        var date = {};

        date.year = today.getFullYear();
        date.month = today.getMonth() + 1 - index;

        if (date.month <= 0) {
            date.year -= 1;
            date.month += 12;
        }

        date.days = new Date(date.year, date.month, 0).getDate();

        return date;
    },

    _cmp: function (a, b) {
        return (a.id - b.id);
    }
});


SignIn.create = function () {
    var ret = new SignIn();

    if (ret) {
        return ret;
    }

    return null;
};