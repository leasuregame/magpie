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

var POWER_NO_ENOUGH = 0;
var CARD_FULL = 1;
var CAN_EXPLORE = 2;

var Task = Entity.extend({
    _id: 0,
    _progress: 0,
    _maxProgress: 0,          // 最大层数
    _powerNeed: 0,
    _mark: [],

    init: function (data) {
        cc.log("Task init");

        this._mark = [];

        this.off();
        this.on("idChange", this._idChangeEvent);

        this.update(data);

        cc.log(this);

        return true;
    },

    update: function (data) {
        cc.log("Task update");

        this.set("id", data.id);
        this.set("progress", data.progress);
        this.set("mark", data.mark);
    },

    _idChangeEvent: function () {
        cc.log("Task _idChangeEvent");

        var table = outputTables.task.rows[this._id];

        this._maxProgress = table.points;
        this._powerNeed = table.power_consume;
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

    canExplore: function () {
        cc.log("Task canExplore");

        if (gameData.player.get("power") < this._powerNeed) {
            return POWER_NO_ENOUGH;
        }

        if (gameData.cardList.isFull()) {
            return CARD_FULL;
        }

        return CAN_EXPLORE;
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
        lz.server.request("area.taskHandler.explore", {
            taskId: id
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            var player = gameData.player;
            var msg = data.msg;

            if (data.code == 200) {
                cc.log("explore success");

                var cbData = {
                    result: msg.result,
                    power: msg.power_consume,
                    exp: msg.exp_obtain,
                    money: msg.money_obtain,
                    goldList: msg.momo,
                    isDouble: msg.isDouble || false
                };

                if (msg.task.id > that._id) {
                    cbData.toNext = true;
                    cbData.progress = 1;
                } else if (msg.task.progress > that._progress) {
                    cbData.progress = 1;
                }

                that.update(msg.task);

                if (msg.find_boss) {
                    cbData.findBoss = msg.find_boss;
                }

                if (msg.upgradeInfo) {
                    player.upgrade(msg.upgradeInfo);

                    cbData.upgradeReward = msg.upgradeInfo.rewards;
                }

                if (msg.level9Box) {
                    var box = {
                        money: msg.level9Box.money,
                        skillPoint: msg.level9Box.skillPoint,
                        energy: msg.level9Box.energy,
                        power: msg.level9Box.powerValue,
                        gold: msg.level9Box.gold
                    };

                    player.adds(box);

                    cbData.level9Box = box;
                }

                if (msg.through_reward) {
                    player.add("money", msg.through_reward.money);

                    cbData.through_reward = msg.through_reward;
                }

                cc.log("first_win: " + msg.first_win);

                if (msg.first_win) {
                    cbData.isFirstFight = msg.first_win;
                }

                if (msg.result == "fight") {
                    msg.battle_log.rewards.money = msg.money_obtain;
                    msg.battle_log.rewards.exp = msg.exp_obtain;

                    cbData.battleLogId = BattleLogPool.getInstance().put(msg.battle_log);
                } else {
                    player.add("money", msg.money_obtain);

                    if (msg.result == "box") {
                        var card = Card.create(msg.open_box_card);
                        gameData.cardList.push(card);
                        cbData.card = card;
                    }
                }

                player.sets({
                    power: msg.power.value,
                    powerTimestamp: msg.power.time,
                    exp: msg.exp
                });

                cb(cbData);

                lz.um.event("event_task", id);
            } else if (data.code == 501) {
                cc.log("explore fail");

                if (msg) {
                    if (msg.message) {
                        TipLayer.tip(msg.message);
                    }

                    if (msg.power) {
                        player.correctionPower(msg.power.value, msg.power.time);
                    }
                }

                cb(null);
            } else {
                cc.log("explore fail");

                TipLayer.tip(msg);

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
        lz.server.request("area.taskHandler.wipeOut", param, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("wipeOut success.");

                var msg = data.msg;

                that.update({
                    mark: msg.mark
                });

                var reward = {
                    money: msg.rewards.money_obtain
                };

                gameData.player.adds(reward);

                cb(reward);

                lz.um.event("event_wipe_out_task", "" + id);
            } else {
                cc.log("wipeOut fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    obtainGold: function (gold) {
        cc.log("Task obtainGold: " + gold);

        var that = this;
        lz.server.request("area.taskHandler.updateMomoResult", {
            gold: gold
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("obtainGold success.");

                gameData.player.add("gold", gold);

                lz.um.event("event_momo", gold);
            } else {
                cc.log("obtainGold fail");

                TipLayer.tip(data.msg);
            }
        });
    }
});

Task.currentChapter = 0;

Task.create = function () {
    var ret = new Task();

    if (ret) {
        return ret;
    }

    return null;
};