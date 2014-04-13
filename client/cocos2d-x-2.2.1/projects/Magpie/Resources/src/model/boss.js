/**
 * Created by lcc3536 on 14-2-26.
 */


/*
 * boss
 * */


var BOSS_STATUS_SLEEP = 1;      // 沉睡
var BOSS_STATUS_AWAKE = 2;      // 苏醒
var BOSS_STATUS_FLEE = 3;       // 逃走
var BOSS_STATUS_TIMEOUT = 4;    // 超时
var BOSS_STATUS_DIE = 5;        // 死亡
var BOSS_STATUS_OFF = 6;        // 消失

var UPDATE_CD_TIME_INTERVAL = 1;    // cd和boss剩余时间更新间隔

var Boss = Entity.extend({
    _bossList: null,        // boss列表
    _cdTimestamp: 0,        // cd时间戳
    _cd: 0,                 // 下次攻击剩余时间
    _kneelList: null,       // 已膜拜列表
    _kneelCount: 0,         // 膜拜次数
    _canReceive: false,     // 奖励领取标记
    _rmTimerCount: 0,       // 消除cd次数
    _thisWeekRank: null,    // 本周排行榜
    _lastWeekRank: null,    // 上周排行榜
    _thisWeek: null,        // 本周信息
    _lastWeek: null,        // 上周信息
    _isGetReward: null,     // 上周奖励是否已领

    init: function (data) {
        cc.log("Boss init");

        this.unscheduleAllCallbacks();

        this.off();
        this.on("cdChange", this._cdChangeEvent);
        this.on("kneelCountChange", this._kneelCountChangeEvent);
        this.on("canReceiveChange", this._canReceiveChangeEvent);

        this._bossList = [];
        this._cdTimestamp = 0;
        this._cd = 0;
        this._kneelCount = 0;
        this._canReceive = false;
        this._rmTimerCount = 0;
        this._thisWeekRank = [];
        this._lastWeekRank = [];
        this._kneelList = [];
        this._thisWeek = null;
        this._lastWeek = null;
        this._isGetReward = true;

        this.update(data);

        this.sync();

        this.schedule(this._updateCdAndBoss, UPDATE_CD_TIME_INTERVAL);

        this.setListener();

        return true;
    },

    update: function (data) {
        cc.log("Boss update");

        if (data) {
            if (data.cd != undefined) {
                this.sets({
                    "cd": data.cd,
                    "cdTimestamp": Date.now()
                });
            }

            this.sets({
                "kneelCount": data.kneelCountLeft,
                "kneelList": data.kneelList,
                "canReceive": data.canReceive,
                "rmTimerCount": data.rmTimerCount
            })
        }
    },

    sync: function () {
        cc.log("Boss sync");

        var that = this;
        lz.server.request("area.bossHandler.lastWeek", {}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Boss sync success");

                var msg = data.msg;

                that.sets({
                    "lastWeekRank": msg.damageList,
                    "lastWeek": msg.lastWeek,
                    "isGetReward": msg.isGet
                });
            } else {
                cc.log("Boss sync fail");

                that.sync();
            }
        }, true);
    },

    setListener: function () {
        cc.log("Boss setListener");

        var that = this;
        lz.server.on("onFriendHelp", function (data) {
            cc.log("***** on friend help:");
            cc.log(data);

            that.set("canReceive", true);
        });
    },

    updateBossList: function (cb) {
        cc.log("Boss updateBossList");

        var that = this;
        lz.server.request("area.bossHandler.bossList", {
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Boss updateBossList success");

                that.set("bossList", data.msg);
                that._updateCdAndBoss();

                cb();
            } else {
                cc.log("Boss updateBossList fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    },

    updateRank: function (cb) {
        cc.log("Boss updateRank");

        var that = this;
        lz.server.request("area.bossHandler.thisWeek", {
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Boss updateRank success");

                var msg = data.msg;

                that.sets({
                    "thisWeekRank": msg.damageList,
                    "thisWeek": msg.thisWeek
                });

                cb();
            } else {
                cc.log("Boss updateRank fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    },

    _getBossById: function (bossId) {
        cc.log("Boss _getBossById");

        var len = this._bossList.length;
        for (var i = 0; i < len; ++i) {
            if (this._bossList[i].bossId == bossId) {
                return i;
            }
        }

        return null;
    },

    push: function (boss) {
        cc.log("Boss push");

        var index = this._getBossById(boss.bossId);

        if (index != null) {
            this._bossList[index] = boss;
        } else {
            this._bossList.unshift(boss);
        }
    },

    getBoss: function (bossId) {
        cc.log("Boss getBoss");

        if (bossId) {
            var index = this._getBossById(bossId);

            if (index != null) {
                return this._bossList[index];
            }

            return null;
        }

        return this._bossList;
    },

    attack: function (cb, bossId, inspireCount) {
        cc.log("Boss attack");

        var that = this;
        lz.server.request("area.bossHandler.attack", {
            bossId: bossId,
            inspireCount: inspireCount
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Boss attack success");

                var msg = data.msg;

                gameData.player.set("gold", msg.gold);

                that.push(msg.boss);
                that.set("cd", msg.cd);

                var battleLogId = BattleLogPool.getInstance().put(msg.battleLog);

                cb(battleLogId);
            } else {
                cc.log("Boss attack fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    },

    getBossDetails: function (cb, bossId) {
        cc.log("Boss getBossDetails");

        var that = this;
        lz.server.request("area.bossHandler.attackDetails", {
            bossId: bossId
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Boss getBossDetails success");

                cb(data.msg);
            } else {
                cc.log("Boss getBossDetails fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    },

    getLastWeekReward: function (cb) {
        cc.log("Boss getLastWeekReward");

        var that = this;
        lz.server.request("area.bossHandler.getLastWeekReward", {
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Boss getLastWeekReward success");

                var msg = data.msg;

                gameData.player.adds(msg);
                that.set("isGetReward", true);

                gameMark.updateBossListMark(false);

                cb(msg);
            } else {
                cc.log("Boss getLastWeekReward fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    },

    getFriendHelpReward: function (cb) {
        cc.log("Boss getFriendHelpReward");

        var that = this;
        lz.server.request("area.bossHandler.getFriendReward", {
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Boss getFriendHelpReward success");

                var msg = data.msg;

                gameData.player.adds(msg);

                that.set("canReceive", false);

                cb(msg);
            } else {
                cc.log("Boss getFriendHelpReward fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    },

    showFriendHelpRewardList: function (cb) {
        cc.log("Boss showFriendHelpRewardList");

        var that = this;
        lz.server.request("area.bossHandler.friendRewardList", {
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Boss showFriendHelpRewardList success");

                cb(data.msg);
            } else {
                cc.log("Boss showFriendHelpRewardList fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    },

    convertHonor: function (cb, number) {
        cc.log("Boss convertHonor");

        var that = this;
        lz.server.request("area.bossHandler.convertHonor", {
            number: number
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Boss convertHonor success");

                var msg = data.msg;

                gameData.player.sets(msg);

                cb();
            } else {
                cc.log("Boss convertHonor fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    },

    removeTimer: function (cb) {
        cc.log("Boss removeTimer");

        var that = this;
        lz.server.request("area.bossHandler.removeTimer", {
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Boss removeTimer success");

                var msg = data.msg;

                gameData.player.sets(msg);

                that.set("cd", 0);
                that.add("rmTimerCount", 1);

                cb();
            } else {
                cc.log("Boss removeTimer fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    },

    kneel: function (cb, playerId) {
        cc.log("Boss kneel");

        var that = this;
        lz.server.request("area.bossHandler.kneel", {
            playerId: playerId
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Boss kneel success");

                var msg = data.msg;

                for (var key in msg) {
                    gameData.player.add(key, msg[key]);
                }

                that.add("kneelCount", -1);
                that._kneelList.push(playerId);

                cb(msg);
            } else {
                cc.log("Boss kneel fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    },

    _updateCdAndBoss: function () {
        if (this._cdTimestamp <= 0) {
            this._cdTimestamp = Date.now();
        }

        var interval = Date.now() - this._cdTimestamp;
        this._cdTimestamp = Date.now();

        if (this._cd > 0) {
            var cd = Math.max(0, this._cd - interval);
            this.set("cd", cd);
        }

        if (this._bossList) {
            var len = this._bossList.length;
            for (var i = 0; i < len; ++i) {
                var boss = this._bossList[i];
                if (boss.status == BOSS_STATUS_FLEE || boss.status == BOSS_STATUS_DIE) {
                    boss.timeLeft = 0;
                } else {
                    boss.timeLeft = Math.max(0, boss.timeLeft - interval);
                }
            }
        }
    },

    canAddition: function (times) {

        if (times < 0 || times > 5) {
            return false;
        }

        if (this.additionNeedGold(times) > gameData.player.get("gold")) {
            TipLayer.tip("魔石不足");
            return false
        }

        return true;
    },

    additionNeedGold: function (times) {
        return times * 20;
    },

    removeCdNeedGold: function () {
        return Math.min(200, this._rmTimerCount * 20);
    },

    _cdChangeEvent: function () {
        // 提示cd已经到了可以打BOSS
        if (this.get("cd") == 0) {
            gameMark.updateBossMark(true);
        }
    },

    _kneelCountChangeEvent: function () {
        // 提示是否可以膜拜

        gameMark.updateBossListMark(false);

    },

    _canReceiveChangeEvent: function () {
        // 提示是否有奖励可以领取
        var nowLayer = MainScene.getInstance().getLayer();
        if (nowLayer instanceof BossListLayer) {
            nowLayer.updateEffect();
        }
    },

    getThisWeekReward: function () {
        cc.log("Boss getThisWeekReward");

        if (!this._thisWeek) {
            return null;
        }

        var rank = this._thisWeek.rank;

        if (rank <= 5) {
            return outputTables.boss_rank_reward.rows[rank];
        } else {
            var honor = outputTables.boss_rank_reward.rows[6].honor;
            honor -= parseInt(Math.ceil((rank - 6) / 20) * 0.003 * honor);
            honor = Math.max(2000, honor);
            return {honor: honor}
        }
    },

    isCanGetRankReward: function () {
        cc.log("Boss isCanGetRankReward");

        return !(this._isGetReward || !this._lastWeek);
    },

    isCanKneel: function (playerId) {

        var len = this._kneelList.length;

        for (var i = 0; i < len; i++) {
            if (playerId == this._kneelList[i]) {
                return false;
            }
        }

        return this._kneelCount > 0;
    },

    exchangeSuperHonor: function () {
        var product = {
            name: "兑换精元",
            consumeType: "honor",
            price: 6000,
            obtain: 1,
            unit: "精元",
            count: 0,
            tip: "",
            remainTimes: MAX_REMAIN_TIMES
        };

        var count;
        var player = gameData.player;

        count = product.count = parseInt(player.get("honor") / product.price);

        if (count <= 0) {
            product.tip = "荣誉不足";
            product.count = 0;
            return product;
        } else {
            product.count = Math.min(product.count, count);
            product.tip = "荣誉不足";
        }

        return product;
    }
});

Boss.create = function () {
    var ret = new Boss();

    if (ret) {
        return ret;
    }

    return null;
};