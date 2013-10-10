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
    _mark: [],

    init: function (data) {
        cc.log("Task init");

        this.update(data);

        cc.log(this);

        return true;
    },

    update: function (data) {
        cc.log("Task update");

        this.set("id", data.id);
        this.set("progress", data.progress);
        this.set("mark", data.mark);

        this._maxProgress = outputTables.task.rows[this._id].points;
    },

    getChapter: function () {
        cc.log("Task getChapter");

        return Math.ceil((this.getSection()) / TASK_SECTION_COUNT);
    },

    getSection: function () {
        cc.log("Task getSection");

        return Math.ceil((this._id) / TASK_CHAPTER_COUNT);
    },

    getPoints: function () {
        cc.log("Task getPoints");

        return ((this._id - 1) % TASK_POINTS_COUNT + 1);
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

    canWipeOut: function () {
        cc.log("Task canWipOut");

        var section = this.getSection();

        for (var i = 1; i <= section; ++i) {
            if (this.getMarkByIndex(i)) {
                return true
            }
        }

        return false;
    },

    getMarkByIndex: function (index) {
        cc.log("Task getMarkByIndex " + index);

        if (index >= this.getSection()) {
            return false;
        }

        var offset = (index - 1) % EACH_NUM_BIT;
        index = Math.floor((index - 1) / EACH_NUM_BIT);


        if (this._mark[index]) {
            return ((this._mark[index] >> offset & 1) == 0);
        }

        return true;
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
            taskId: id
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("explore success");

                var msg = data.msg;

                var cbData = {
                    result: msg.result,
                    power: msg.power_consume,
                    exp: msg.exp_obtain,
                    money: msg.money_obtain,
                    goldList: msg.momo
                };

                gameData.spirit.update(msg.spiritor);

                if (msg.task.id > that._id) {
                    cbData.toNext = true;
                    cbData.progress = 1;
                } else if (msg.task.progress > that._progress) {
                    cbData.progress = 1;
                }

                that.update(msg.task);

                var player = gameData.player;

                player.add("money", msg.money_obtain);

                player.update({
                    power: msg.power,
                    lv: msg.lv,
                    exp: msg.exp
                });

                if (msg.result == "fight") {
                    cbData.battleLogId = BattleLogPool.getInstance().pushBattleLog(msg.battle_log, PVE_BATTLE_LOG);
                } else if (msg.result == "box") {
                    var card = Card.create(msg.open_box_card);
                    gameData.cardList.push(card);
                    cbData.card = card;
                }

                cb(cbData);
            } else {
                cc.log("explore fail");

                TipLayer.tip(data.msg);

                cb(null);
            }
        });
    },

    wipeOut: function (cb, id) {
        cc.log("Task wipeOut: " + id);

        var param = {type: "task"};

        if (id) {
            param.chapterId = id;
        }

        cc.log(param);

        var that = this;
        lzWindow.pomelo.request("area.taskHandler.wipeOut", param, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("wipeOut success.");

                var msg = data.msg;

                that.update({
                    mark: msg.mark
                });

                var reward = msg.rewards;
                var player = gameData.player;

                player.adds({
                    exp: reward.exp_obtain,
                    money: reward.money_obtain
                });

                player.update({
                    power: msg.power,
                    lv: msg.lv,
                    exp: msg.exp
                });

                var cbData = {
                    exp: reward.exp_obtain,
                    money: reward.money_obtain
                };

                cb(cbData);
            } else {
                cc.log("wipeOut fail");
            }
        });
    },

    obtainGold: function (gold) {
        cc.log("Task obtainGold: " + gold);

        var that = this;
        lzWindow.pomelo.request("area.taskHandler.updateMomoResult", {
            gold: gold
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("obtainGold success.");

                gameData.player.add("gold", gold);
            } else {
                cc.log("obtainGold fail");
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