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
    _flag: 0,

    init: function () {
        cc.log("SignIn init");

        this.sync();
    },

    update: function(data) {
        cc.log("SignIn update");
        cc.log(data);

        var months = data.months || {};

        this._flag = data.flag || 0;
        this._monthsMark = [];

        for(var i = 0; i < MAX_SIGN_IN_HISTORY; ++i) {
            var monthMark = this._getMonthData(i);

            var key = monthMark.year.toString() + monthMark.month.toString();
            monthMark.mark = months[key] || 0;

            monthMark.count = 0;
            for(var j = 0; j < monthMark.days; ++j) {
                monthMark.count += monthMark.mark >> j & 1;
            }

            this._monthsMark[i] = monthMark;
        }

        cc.log(this);
    },

    sync: function () {
        cc.log("SignIn sync");

        var that = this;
        lzWindow.pomelo.request("area.dailyHandler.signInDetails", {}, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("sync success");

                var msg = data.msg;

                that.update(msg);
            } else {
                cc.log("sync fail");

                that.sync();
            }
        });
    },

    getMonthMark: function (index) {
        cc.log("SignIn getMonth");

        return this._monthsMark[index];
    },

    getRewardList:function() {
        cc.log("SignIn getRewardList");

        var table = outputTables.signIn_rewards.rows;

        var rewardList = [];

        for(var key in table) {
            rewardList.push(table[key]);
        }

        rewardList.sort(this._cmp);

        return rewardList;
    },

    canReceive: function(index) {
        cc.log("MonthLabel getRewardFlag");

        return (this._flag >> index & 1 == 1);
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

    _cmp: function(a, b) {
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