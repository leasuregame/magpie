/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-18
 * Time: 下午6:54
 * To change this template use File | Settings | File Templates.
 */


/*
 * player
 * */


var UPDATE_POWER_TIME_INTERVAL = 2;
var UPDATE_POWER_TIME = 600000;
var UPDATE_POWER_VALUE = 5;
var OVER_NOVICE_STEP = 17;
var LOTTERY_ENOUGH = 200;

var MONTH_CARD = 0;
var WEEK_CARD = 1;

var NO_FIRST_RECHARGER_BOX = 0;
var HAS_FIRST_RECHARGER_BOX = 1;
var GOT_FIRST_RECHARGER_BOX = 2;

var POWER_NOTIFICATION_KEY = 1;

var Player = Entity.extend({
    _id: 0,                 // 数据库id
    _uid: "",               // 玩家唯一标识
    _createTime: 0,         // 创建时间
    _userId: 0,             // 帐号id
    _areaId: 0,             // 区
    _name: "",              // 角色
    _power: 0,              // 体力
    _powerTimestamp: 0,     // 体力时间戳
    _lv: 0,                 // 等级
    _exp: 0,                // 经验
    _gold: 0,               // 魔石
    _money: 0,              // 金钱
    _elixir: 0,             // 仙丹
    _fragment: 0,           // 卡魂
    _energy: 0,             // 活力
    _skillPoint: 0,         // 技能点
    _vip: 0,                // VIP等级
    _cash: 0,               // 付费
    _goldCards: {},         // 周卡月卡
    _recharge: 0,           // 充值记录标记
    _firstRechargeBox: 0,   // 首充礼包标记
    _evolutionRate: null,   // 星级进阶概率
    _maxTournamentCount: 0,
    _tournamentCount: 0,
    _ability: 0,            // 战斗力
    _speaker: 0,            // 喇叭数量

    _maxLv: 0,              // 最大等级
    _maxPower: 0,           // 最大体力
    _maxMoney: 0,           // 最大金钱
    _maxSkillPoint: 0,      // 最大技能点
    _maxEnergy: 0,          // 最大活力
    _maxExp: 0,             // 最大经验

    _honor: 0,              // 荣誉
    _superHonor: 0,         // 精元

    _noviceTeachStep: OVER_NOVICE_STEP, //进行新手教程步骤

    init: function (data, cb) {
        cc.log("Player init");

        this.unscheduleAllCallbacks();

        this._evolutionRate = {};

        this.off();
        this.on("lvChange", this._lvChangeEvent);
        this.on("energyChange", this._energyChangeEvent);
        this.on("vipChange", this._vipChangeEvent);
        this.on("powerChange", this._powerChangeEven);

        this._load();
        this.update(data);
        this.sync();

        gameData.cardLibrary.init();
        gameData.friend.init();
        gameData.message.init();
        gameData.signIn.init();
        gameData.rank.init();
        gameData.achievement.init();
        gameData.activity.init();
        gameData.speak.init();
        gameData.payment.init();
        gameData.greeting.init();

        this.schedule(this.updatePower, UPDATE_POWER_TIME_INTERVAL);

        this.setListener();

        if (cb) {
            cb();
        }

        return true;
    },

    _load: function () {
        this._maxLv = outputTables.lv_limit.rows[1].player_lv_limit;

        var resourceLimitTable = outputTables.resource_limit.rows[1];
        this._maxPower = resourceLimitTable.power_value;
        this._maxMoney = resourceLimitTable.money;
        this._skillPoint = resourceLimitTable.skillPoint;
        this._maxEnergy = resourceLimitTable.energy;
    },

    update: function (data) {
        cc.log("Player update");

        this.set("noviceTeachStep", data.teachingStep);
        this.set("id", data.id);
        this.set("uid", data.uniqueId);
        this.set("createTime", data.createTime);
        this.set("userId", data.userId);
        this.set("areaId", data.areaId);
        this.set("name", data.name);
        this.set("exp", data.exp);
        this.set("gold", data.gold);
        this.set("money", data.money);
        this.set("elixir", data.elixir);
        this.set("fragment", data.fragments);
        this.set("skillPoint", data.skillPoint);
        this.set("cash", data.cash);
        this.set("power", data.power.value);
        this.set("powerTimestamp", data.power.time);
        this.set("goldCards", data.goldCards);
        this.set("vip", data.vip);
        this.set("honor", data.honor);
        this.set("superHonor", data.superHonor);

        if (data.speaker) {
            this.set("speaker", data.speaker);
        } else {
            this.set("speaker", 0);
        }

        if (data.firstTime) {
            this.set("recharge", data.firstTime.recharge);
            this.set("firstRechargeBox", data.firstTime.firstRechargeBox)
        } else {
            this.set("recharge", 127);
            this.set("firstRechargeBox", NO_FIRST_RECHARGER_BOX);
        }

        // 需要调用gameMark
        this.set("lv", data.lv);
        this.set("energy", data.energy);

        gameData.clock.init(data.serverTime);
        gameData.cardList.init(data.cards, data.cardsCount);
        gameData.lineUp.init(data.lineUp);
        gameData.task.init(data.task);
        gameData.pass.init(data.pass);
        gameData.spirit.init(data.spiritor);
        gameData.spiritPool.init(data.spiritPool);
        gameData.tournament.init(data.rank);
        gameData.treasureHunt.init({
            count: data.dailyGift.lotteryCount,
            freeCount: data.dailyGift.lotteryFreeCount
        });
        gameData.shop.init({
            useVipBoxList: data.vipBox,
            powerBuyCount: data.dailyGift.powerBuyCount,
            challengeBuyCount: data.dailyGift.challengeBuyCount,
            expCardBuyCount: data.dailyGift.expCardCount
        });
        gameData.lottery.init({
            firstTime: data.firstTime,
            goldLuckyCard10: data.dailyGift.goldLuckyCard10,
            goldLuckyCardForFragment: data.dailyGift.goldLuckyCardForFragment
        });
        gameData.exchange.init(data.exchangeCards);
        gameData.boss.init(data.bossInfo);

        this.set("ability", this.getAbility());
    },

    sync: function () {
        cc.log("Player sync");

        var that = this;
        lz.server.request(
            "area.trainHandler.starUpgradeInitRate",
            {},
            function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);

                if (data.code == 200) {
                    cc.log("Player sync success");

                    var msg = data.msg;

                    that.set("evolutionRate", msg.initRate);

                } else {
                    cc.log("Player sync fail");

                    that.sync();
                }
            },
            true
        );
    },

    setListener: function () {
        cc.log("Player setListener");

        var that = this;
        lz.server.on("onResetData", function (data) {
            cc.log("***** on reset data:");
            cc.log(data);

            var msg = data.msg;

            gameData.task.update(msg.task);
            gameData.pass.update(msg.pass);
            gameData.spiritPool.update(msg.spiritPool);
            gameData.friend.update({
                "maxFriendCount": msg.friendsCount
            });
            gameData.treasureHunt.update({
                count: msg.dailyGift.lotteryCount,
                freeCount: msg.dailyGift.lotteryFreeCount
            });
            gameData.shop.update({
                powerBuyCount: msg.dailyGift.powerBuyCount,
                challengeBuyCount: msg.dailyGift.challengeBuyCount,
                expCardBuyCount: msg.dailyGift.expCardCount
            });

            if (msg.goldCards) {
                that.set("goldCards", msg.goldCards);
            }

            gameData.activity.set("vipLoginReward", msg.vipLoginReward);
            gameData.activity.updateLoginCountFlag(msg.loginInfo);

            MainScene.getInstance().updateMark();
        });
    },

    getAbility: function () {
        var lineUpCardList = gameData.lineUp.getLineUpCardList();
        var len = lineUpCardList.length;
        var ability = 0;
        var card = null;
        var spiritPassiveHarm = gameData.spirit.get("passiveHarm");

        for (var i = 0; i < len; ++i) {
            card = lineUpCardList[i];
            ability += card.get("ability");
            ability += parseInt(card.get("initHp") / 2 * spiritPassiveHarm / 100) + parseInt(card.get("initAtk") * spiritPassiveHarm / 100);
        }

        return ability;
    },

    checkAbility: function () {
        cc.log("Player checkAbility");

        var ability = this.getAbility();

        if (ability != this._ability) {
            TipLayer.tipAbility(ability - this._ability);
        }

        cc.log(this._ability);
        cc.log(ability);

        this._ability = ability;
    },

    updatePower: function () {
        if (this._power > this._maxPower) {
            return;
        }

        var serverTime = gameData.clock.get("time");

        var interval = serverTime - this._powerTimestamp;
        var power = this._power;

        if (interval > 0) {
            var times = Math.floor(interval / UPDATE_POWER_TIME);

            power += UPDATE_POWER_VALUE * times;
            this._powerTimestamp += times * UPDATE_POWER_TIME;

            if (power > this._maxPower) {
                power = this._maxPower;
            }
        }

        if (this._power != power) {
            this.set("power", power);
        }
    },

    correctionPower: function (power, powerTimestamp) {
        gameData.clock.updateServerTime();

        this.set("power", power);
        this.set("powerTimestamp", powerTimestamp);
    },

    upgrade: function (data) {
        cc.log("Player upgrade");

        if (!data) return;

        this.set("lv", data.lv);
        this.adds(data.rewards);

        gameData.friend.set("maxFriendCount", data.friendsCount);

        // YY数据收集
        if (typeof(yyAdapter) != "undefined" && yyAdapter.YYUpdateUserRole) {
            yyAdapter.YYUpdateUserRole(this._name, this._lv);
        }
    },

    isFullLv: function () {
        return (this._lv >= this._maxLv);
    },

    _lvChangeEvent: function () {
        cc.log("Player _lvChangeEvent");

        this.set("maxExp", outputTables.player_upgrade.rows[this._lv].exp);
        gameData.lineUp.update();
        gameData.activity.updateGrowthPlanFlag();
        gameMark.updateGoldRewardMark(false);
        gameMark.updateGrowPlanMark(false);
    },

    _energyChangeEvent: function () {
        cc.log("Player _energyChangeEvent");

        if (this._energy >= LOTTERY_ENOUGH) {
            gameMark.updateLotteryMark(true);
        } else {
            gameMark.updateLotteryMark(false);
        }
    },

    _vipChangeEvent: function () {
        cc.log("Player _vipChangeEvent");

        gameData.shop.updateMaxCount();
    },

    _powerChangeEven: function () {
        cc.log("Player _powerChangeEven");

        if (typeof(lz.NotificationHelp) != "undefined") {
            lz.NotificationHelp.remove(POWER_NOTIFICATION_KEY);

            if (this._power < this._maxPower) {
                var time = Math.ceil((this._maxPower - this._power) / 5) * 10 * 60;

                lz.NotificationHelp.push("哥，在干啥呢，体力恢复满了，再不用就浪费了。", time, POWER_NOTIFICATION_KEY);
            }
        }
    },

    sendMessage: function (cb, playerId, msg) {
        cc.log("Player sendMessage: " + playerId + " " + msg);

        var that = this;
        lz.server.request("area.messageHandler.leaveMessage", {
            friendId: playerId,
            content: msg
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("sendMessage success");

                cb("success");

                lz.um.event("event_send_message");
            } else {
                cc.log("sendMessage fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    fight: function (cb, playerId) {
        cc.log("Player learn: " + playerId);

        var that = this;
        lz.server.request("area.rankHandler.fight", {
            targetId: playerId
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("learn success");

                var msg = data.msg;

                var battleLogId = BattleLogPool.getInstance().put(msg.battleLog);

                cb(battleLogId);

                lz.um.event("event_fight");
            } else {
                cc.log("learn fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    playerDetail: function (cb, playerId) {
        cc.log("Player playerDetail: " + playerId);

        var that = this;
        lz.server.request("area.playerHandler.getLineUpInfo", {
            playerId: playerId
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("playerDetail success");

                var msg = data.msg;

                cb(msg);

                lz.um.event("event_get_player_detail");
            } else {
                cc.log("playerDetail fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    invite: function (cb, key) {
        cc.log("Player invitation: " + key);

        var that = this;
        lz.server.request("area.cdkeyHandler.verifyCdkey", {
            cdkey: key
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("invite success");

                var msg = data.msg;
                for (key in msg) {
                    if (key == "cardArray") {
                        var cards = msg[key];
                        var len = cards.length;
                        for (var i = 0; i < len; i++) {
                            var card = Card.create(cards[i]);
                            gameData.cardList.push(card);
                        }
                    } else if (key == "fragments") {
                        that.add("fragment", msg[key]);
                    } else {
                        that.add(key, msg[key]);
                    }
                }

                cb(msg);
            } else {
                cc.log("invite fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    setStep: function (step) {
        cc.log("Player setStep: " + step);

        var that = this;
        lz.server.request("area.playerHandler.setStep", {
            step: step
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);
            if (data.code == 200) {
                cc.log("setStep success");
            } else {
                cc.log("setStep fail");

                TipLayer.tip(data.msg);
            }
        }, true);
    },

    getRemainDays: function (type) {
        cc.log("Player getRemainDays: " + type);

        var goldCards = this.get("goldCards");
        if (type == MONTH_CARD) {
            if (goldCards.month) {
                return goldCards.month.remainingDays || 0;
            } else {
                return 0;
            }
        } else if (type == WEEK_CARD) {
            if (goldCards.week) {
                return goldCards.week.remainingDays || 0;
            } else {
                return 0;
            }
        } else {
            cc.log("类型出错！！！");
            return 0;
        }
    },

    isGotDaily: function (type) {
        cc.log("Player isGotDaily: " + type);

        var goldCards = this.get("goldCards");
        if (type == MONTH_CARD) {
            if (goldCards.month) {
                return goldCards.month.hasGot;
            } else {
                return 1;
            }
        } else if (type == WEEK_CARD) {
            if (goldCards.week) {
                return goldCards.week.hasGot;
            } else {
                return 1;
            }
        } else {
            cc.log("类型出错！！！");
            return 0;
        }
    },

    goldCardsStatus: function (type) {
        cc.log("Player goldCardsStatus: " + type);

        var goldCards = this.get("goldCards");
        if (type == MONTH_CARD) {
            if (goldCards.month) {
                return goldCards.month.status;
            } else {
                return 0;
            }
        } else if (type == WEEK_CARD) {
            if (goldCards.week) {
                return goldCards.week.status;
            } else {
                return 0;
            }
        } else {
            cc.log("类型出错！！！");
            return 0;
        }
    },

    resetGoldCards: function (type) {
        cc.log("Player resetGoldCards: " + type);

        var goldCards = this.get("goldCards");
        if (type == MONTH_CARD) {
            if (goldCards.month) {
                if (goldCards.month.remainingDays == 0) {
                    goldCards.month.remainingDays = -1;
                }
            } else {
                goldCards.month = {
                    "remainingDays": -1
                };
            }
        } else if (type == WEEK_CARD) {
            if (goldCards.week) {
                if (goldCards.week.remainingDays == 0) {
                    goldCards.week.remainingDays = -1;
                }
            } else {
                goldCards.week = {
                    "remainingDays": -1
                };
            }
        }
    },

    isFirstPayment: function (id) {
        cc.log("Player isFirstPayment: " + id);

        var offset = (id - 1) % EACH_NUM_BIT;
        var mark = this._recharge;
        return !((mark >> offset & 1) == 1);
    },

    updateFirstPayment: function (id) {
        cc.log("Player updateFirstPayment: " + id);

        this._recharge = this._recharge | (1 << (id - 1));
    },

    getEvolutionRate: function (star) {
        cc.log("Player getEvolutionRate: " + star);

        var rate = this._evolutionRate;

        if (rate) {
            return rate["star" + star] || 0;
        }

        return 0;
    }
});


Player.create = function () {
    var ret = new Player();

    if (ret) {
        return ret;
    }

    return null;
};
