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


var TASK_CHAPTER_COUNT = 10;
var TASK_SECTION_COUNT = 5;
var TASK_POINTS_COUNT = 10;

var Task = Entity.extend({
    _id: 0,
    _progress: 0,
    _maxProgress: 0,          // 最大层数

    init: function (data) {
        cc.log("Task init");

        this.update(data);

        cc.log(this);

        return true;
    },

    update: function (data) {
        cc.log("Task update");

        if (this._id != data.id) {
            this._id = data.id;
            this._maxProgress = outputTables.task.rows[this._id].points;
        }

        this._progress = data.progress;
    },

    getChapter: function () {
        cc.log("Task getChapter");

        return Math.ceil((this.getSection()) / TASK_SECTION_COUNT);
    },

    getSection: function () {
        cc.log("Task getSection");

        return Math.ceil((this._id) / TASK_CHAPTER_COUNT);
    },

    getProgress: function (index) {
        cc.log("Task getProgress");

        var progress = {};
        if (index == this._id) {
            progress.maxProgress = this._maxProgress;
            progress.progress = this._progress;
        } else {
            progress.maxProgress = outputTables.task.rows[index].points;

            if (index < this._id) {
                progress.progress = progress.maxProgress;
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
        cc.log("Task explore " + id);

        var that = this;
        lzWindow.pomelo.request("area.taskHandler.explore", {
            id: id
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("explore success");

                var msg = data.msg;

                var player = gameData.player;

                player.adds({
                    exp: msg.exp_obtain,
                    money: msg.money_obtain,
                    power: -msg.power_consume
                });

                var backData = {
                    result: msg.result
                };

                if (msg.result == "fight") {
                    backData.battleLogId = BattleLogPool.getInstance().pushBattleLog(msg.battle_log, PVE_BATTLE_LOG);
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
        lzWindow.pomelo.request("logic.taskHandler.wipeOut", {
            type: "task"
        }, function (data) {
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
});


Task.create = function () {
    var ret = new Task();

    if (ret) {
        return ret;
    }

    return null;
};