/**
 * Created by lcc3536 on 13-11-19.
 */


/*
 * clock
 * */


/*
 * 查看当前游戏时间命令: lz.getTimeStr(gameData.clock.get("time"));
 * */

var UPDATE_LOCAL_TIME_INTERVAL = 1;
var UPDATE_SERVER_TIME_INTERVAL = 120;

var Clock = Entity.extend({
    _alarmClock: {},
    _index: 0,
    _time: 0,
    _localTime: 0,

    init: function (time) {
        cc.log("Clock init");

        this._alarmClock = {};
        this._index = 0;
        this._time = time || Date.now();
        this._localTime = Date.now();

        this.schedule(this.updateLocalTime, UPDATE_LOCAL_TIME_INTERVAL);
        this.schedule(this.updateServerTime, UPDATE_SERVER_TIME_INTERVAL);
    },

    updateLocalTime: function () {
        var now = Date.now();
        this._time += (now - this._localTime);
        this._localTime = now;

        this._judge();
    },

    updateServerTime: function () {
        cc.log("Clock updateServerTime");

        var that = this;
        lz.server.request(
            "area.timeHandler.serverTime",
            {},
            function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);

                if (data.code == 200) {
                    cc.log("getServerTime success");

                    that._time = data.msg;
                    that._judge();
                } else {
                    cc.log("getServerTime fail");
                }
            },
            true
        );
    },

    _judge: function () {
        var date = new Date(this._time);
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        var key, alarmClock, startTime, endTime;

        for (key in this._alarmClock) {
            alarmClock = this._alarmClock[key];
            startTime = alarmClock.startTime;
            endTime = alarmClock.endTime;

            if ((
                hour > startTime.hour ||
                    hour == startTime.hour && minute > startTime.minute ||
                    hour == startTime.hour && minute == startTime.minute && second > startTime.second
                ) && (
                hour < endTime.hour ||
                    hour == endTime.hour && minute < endTime.minute ||
                    hour == endTime.hour && minute == endTime.minute && second < endTime.second
                )) {
                alarmClock.cb();

                delete this._alarmClock[key];
            }
        }
    },

    /*
     * hour (1 ~ 24)
     * minute (1 ~ 60)
     * second (1 ~ 60)
     * startTime: {hour: 12, minute: 12, second: 30}
     * endTime: {hour: 13, minute: 12, second: 30}
     * */
    addAlarmClick: function (startTime, endTime, cb) {
        this._alarmClock[this._index] = {
            startTime: startTime,
            endTime: endTime,
            cb: cb
        };

        this._index += 1;

        return (this._index - 1);
    },

    deleteAlarmClick: function (index) {
        if (this._alarmClock[index]) {
            delete this._alarmClock[index];
        }
    }
});


Clock.create = function () {
    var ret = new Clock();

    if (ret) {
        return ret;
    }

    return null;
};


/*
 gameData.clock.addAlarmClick(
 {hour: 17, minute: 8, second: 0},
 {hour: 17, minute: 10, second: 0},
 function () {
 cc.log("===============================");
 cc.log("触发事件，触发时删掉这个定时器");
 cc.log("===============================");
 }
 );
 */