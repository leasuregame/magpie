/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-9
 * Time: 下午6:20
 * To change this template use File | Settings | File Templates.
 */


/*
 * task
 * */


var Task = Entity.extend({
    _id: 0,
    _progress: 0,
    _points: 0, // 最大层数

    init: function (data) {
        this.update(data);

        cc.log(this);

        return true;
    },

    update: function (data) {
        if (this._id != data.id) {
            this._id = data.id;
            this._points = outputTables.task.rows[this._id].points;
        }

        this._progress = data.progress;
    },

    getPercentage: function () {
        return (this._progress / this._points);
    },

    getChapter: function () {
        return ((this._id / 10 - 1) / 5 + 1);
    },

    getSection: function () {
        return ((this._id / 10 - 1) % 5 + 1);
    },

    getProgress: function (index) {
        cc.log("Task getProgress");

        var progress = {};
        if (index == this._id) {
            progress.points = this._points;
            progress.progress = this._progress;
        } else {
            progress.points = outputTables.task.rows[index].points;

            if (index < this._id) {
                progress.progress = progress.points;
            } else {
                progress.progress = 0;
            }
        }

        return progress;
    },

    /*
     * 根据id和任务进度请求服务器执行任务
     * @ param {function} cb 回调函数
     * @ param {number} id 任务id
     * */
    explore: function (cb, id) {
        cc.log("Task explore");

        var that = this;
        lzWindow.pomelo.request("logic.taskHandler.explore", {playerId: gameData.player.get("id"), id: id}, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("explore success");

                var msg = data.msg;

                var player = gameData.player;
                player.update({
                    exp: msg.exp_obtain,
                    money: msg.money_obtain,
                    power: msg.power_consume,
                    fragment: msg.fragment ? 1 : 0
                });

                var backData = {
                    result: msg.result
                };
                if (msg.result == "fight") {
                    var battleLog = BattleLog.create(msg.battle_log);
                    BattleLogNote.getInstance().pushBattleLog(battleLog);
                    backData.battleLogId = battleLog.get("id");
                } else if (msg.result == "box") {
                    backData.card = msg.open_box_card;
                }

                cb(backData);
            } else {
                cc.log("explore fail");
            }
        });
    },

    wipeOut: function (cb) {
        cc.log("Task wipeOut");

        var that = this;

        lzWindow.pomelo.request("logic.taskHandler.wipeOut", {playerId: gameData.player.get("id"), type: "task"}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Task success.");

                cb("success");
            } else {
                cc.log("Task fail");

                cb("fail");
            }
        });
    }
})


Task.create = function (data) {
    var ret = new Task();

    if (ret) {
        return ret;
    }

    return null;
}