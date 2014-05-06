/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-11-18
 * Time: 下午3:07
 * To change this template use File | Settings | File Templates.
 */


var gameMark = {

    _activity: false,
    _achievement: false,
    _cardLibrary: false,
    _friend: false,
    _message: false,
    _friendMessage: false,
    _systemMessage: false,
    _signIn: false,
    _powerReward: false,
    _goldReward: false,
    _recharge: false,
    _lottery: false,
    _newYearReward: false,
    _treasureHunt: false,
    _goldCards: false,
    _boss: false,
    _tournament: false,
    _bossList: false,
    _newAreaReward: false,
    _growthPlan: false,

    init: function () {
        cc.log("gameMark init");

        this._activity = false;
        this._achievement = false;
        this._cardLibrary = false;
        this._friend = false;
        this._message = false;
        this._friendMessage = false;
        this._systemMessage = false;
        this._signIn = false;
        this._powerReward = false;
        this._goldReward = false;
        this._recharge = false;
        this._lottery = false;
        this._newYearReward = false;
        this._treasureHunt = false;
        this._goldCards = false;
        this._boss = false;
        this._tournament = false;
        this._bossList = false;
        this._newAreaReward = false;
        this._growthPlan = false;
    },

    getActivityMark: function () {
        cc.log("gameMark getActivityMark");

        if (!this._activity) {
            this._activity = this.getSignInMark() || this.getGoldRewardMark() || this.getRechargeMark() ||
                this.getPowerRewardMark() || this.getNewYearMark() || this.getGoldCardsMark() ||
                this.getNewAreaReward() || this.getGrowthPlan();
        }

        return this._activity;
    },

    updateActivityMark: function (mark) {
        cc.log("gameMark updateActivityMark");

        this._activity = mark;
        MainScene.getInstance().updateMark();
    },

    getCardLibraryMark: function () {
        cc.log("gameMark getCardLibraryMark");

        var mark = this._cardLibrary;
        if (!mark) {
            var cardLibrary = gameData.cardLibrary;
            for (var key in cardLibrary.get("type")) {
                var type = cardLibrary.getTypeById(key);
                if (type == CARD_RECEIVE) {
                    mark = true;
                    break;
                }
            }
        }
        this._cardLibrary = mark;
        return mark;
    },

    updateCardLibraryMark: function (mark) {
        cc.log("gameMark updateCardLibraryMark");

        this._cardLibrary = mark;
        MainScene.getInstance().updateMark();
    },

    getAchievementMark: function () {
        cc.log("gameMark getAchievementMark");

        var mark = this._achievement;
        if (!mark) {
            var achievementList = gameData.achievement.getAchievementList();
            var len = achievementList.length;

            for (var i = 0; i < len; ++i) {
                var isReceiver = achievementList[i].isReceiver;
                var isAchieve = achievementList[i].isAchieve;
                if (!isReceiver) {
                    if (isAchieve) {
                        mark = true;
                        break;
                    }
                }
            }
        }
        this._achievement = mark;
        return mark;
    },

    updateAchievementMark: function (mark) {
        cc.log("gameMark updateAchievementMark");

        this._achievement = mark;
        MainScene.getInstance().updateMark();
    },

    getFriendMark: function () {
        cc.log("gameMark getFriendMark");

        var mark = this._friend;
        if (!mark) {
            var friend = gameData.friend;
            var receiveCount = friend.get("receiveCount");
            var friendList = friend.get("friendList");
            var len = friendList.length;
            for (var i = 0; i < len; ++i) {
                if (receiveCount > 0 && friendList[i].canReceive) {
                    mark = true;
                    break;
                }
            }
        }
        this._friend = mark;
        return mark;
    },

    updateFriendMark: function (mark) {
        cc.log("gameMark updateFriendMark");

        this._friend = mark;
        MainScene.getInstance().updateMark();
    },

    getMessageMark: function () {
        cc.log("gameMark getMessageMark");

        var mark = this._message;

        if (!mark) {
            if (this.getFriendMessageMark() == true) {
                mark = true;
            } else if (this.getSystemMessageMark() == true) {
                mark = true;
            }
        }

        this._message = mark;
        return mark;
    },

    updateMessageMark: function (mark) {
        cc.log("gameMark updateMessageMark");

        this._message = mark;
        MainScene.getInstance().updateMark();
    },

    getSignInMark: function () {
        cc.log("gameMark getMessageMark");

        var mark = this._signIn;
        if (!mark) {
            var signIn = gameData.signIn;
            if (signIn.canSignIn(0) == true) {
                mark = true;
            } else {
                var monthMark = signIn.getMonthMark(0);
                if (monthMark) {
                    var table = outputTables.signIn_rewards;

                    for (var i = 0; i < 5; ++i) {
                        var row = table.rows[i + 1];
                        var count = row.count != -1 ? row.count : monthMark.days;

                        if (monthMark.count >= count && signIn.canReceive(0, i) == true) {
                            mark = true;
                            break;
                        }
                    }
                }
            }
        }
        this._signIn = mark;
        return mark;
    },

    updateSignInMark: function (mark) {
        cc.log("gameMark updateSignInMark");

        this._signIn = mark;
        this.updateActivityMark(mark);
        MainScene.getInstance().updateMark();
    },

    getPowerRewardMark: function () {
        cc.log("gameMark getPowerRewardMark");

        return this._powerReward;
    },

    updatePowerRewardMark: function (mark) {
        cc.log("gameMark updatePowerRewardMark");

        this._powerReward = mark;
        this.updateActivityMark(mark);
        MainScene.getInstance().updateMark();
    },

    getGoldRewardMark: function () {
        cc.log("gameMark getGoldRewardMark");

        var mark = this._goldReward;
        if (!mark) {
            var goldRewards = outputTables.player_upgrade_reward.rows;
            var lv = gameData.player.get('lv');
            var keys = Object.keys(goldRewards);
            keys.sort(function (a, b) {
                return parseInt(a) > parseInt(b);
            });
            var len = keys.length;
            for (var i = 0; i < len; ++i) {
                var key = keys[i];
                var type = gameData.activity.getStateById(TYPE_GOLD_REWARD, goldRewards[key].id);
                if (type == GOLD_NO_RECEIVE) {
                    if (lv >= goldRewards[key].lv) {
                        mark = true;
                        break;
                    }
                }
            }
        }

        this._goldReward = mark;
        return mark;
    },

    updateGoldRewardMark: function (mark) {
        cc.log("gameMark getGoldRewardMark");

        this._goldReward = mark;
        this.updateActivityMark(mark);
        MainScene.getInstance().updateMark();
    },

    getRechargeMark: function () {
        cc.log("gameMark getRechargeMark");

        return this._recharge;
    },

    updateRechargeMark: function (mark) {
        cc.log("gameMark updateRechargeMark");

        this._recharge = mark;
        this.updateActivityMark(mark);
        MainScene.getInstance().updateMark();
    },

    getFriendMessageMark: function () {
        cc.log("gameMark getFriendMessageMark");

        var mark = this._friendMessage;
        if (!mark) {
            var friendMessageList = gameData.message.get("friendMessage");
            var len = friendMessageList.length;
            for (var i = 0; i < len; ++i) {
                var type = friendMessageList[i].type;
                var status = friendMessageList[i].status;
                if (type == ADD_FRIEND_MESSAGE) {
                    if (status == ASKING_STATUS) {
                        mark = true;
                        break;
                    }
                }
            }
        }
        this._friendMessage = mark;
        return mark;
    },

    updateFriendMessageMark: function (mark) {
        cc.log("gameMark updateFriendMessageMark");

        this._friendMessage = mark;
        this.updateMessageMark(mark);
        MainScene.getInstance().updateMark();
    },

    getSystemMessageMark: function () {
        cc.log("gameMark getSystemMessageMark");

        var mark = this._systemMessage;
        if (!mark) {
            var systemMessageList = gameData.message.get("systemMessage");
            var len = systemMessageList.length;
            for (var i = 0; i < len; ++i) {
                if (systemMessageList[i].status == UNHANDLED_STATUS) {
                    mark = true;
                    break;
                }
            }
        }
        this._systemMessage = mark;
        return mark;
    },

    updateSystemMessageMark: function (mark) {
        cc.log("gameMark updateSystemMessageMark");

        this._systemMessage = mark;
        this.updateMessageMark(mark);
        MainScene.getInstance().updateMark();
    },

    getLotteryMark: function () {
        cc.log("gameMark getLotteryMark");

        if (gameData.player.get("lv") > 20) {
            this._lottery = false;
        } else if (!this._lottery) {
            var energy = gameData.player.get("energy");
            if (energy >= LOTTERY_ENOUGH) {
                this._lottery = true;
            }
        }
        return this._lottery;
    },

    updateLotteryMark: function (mark) {
        cc.log("gameMark updateLotteryMark");

        this._lottery = mark;
        MainScene.getInstance().updateMark();
    },

    getNewYearMark: function () {
        cc.log("gameMark getNewYearMark");

        if (!this._newYearReward) {
            var activity = gameData.activity;
            if (activity.get("hasLoginReward")) {
                this._newYearReward = true;
            } else {
                var table = outputTables.new_year_rechage.rows;
                var keys = Object.keys(table);
                var len = keys.length;
                for (var id = 1; id <= len; id++) {
                    if (activity.getStateById(TYPE_RECHARGE_REWARD, id) == RECHARGE_REWARD) {
                        this._newYearReward = true;
                        break;
                    }
                }
            }
        }

        return this._newYearReward;
    },

    updateNewYearMark: function (mark) {
        cc.log("gameMark updateNewYearMark");

        this._newYearReward = mark;
        this.updateActivityMark(mark);
        MainScene.getInstance().updateMark();
    },

    getTreasureHuntMark: function () {
        cc.log("gameMark getTreasureHuntMark");

        if (!this._treasureHunt) {
            var freeCount = gameData.treasureHunt.get("freeCount");
            var lv = gameData.player.get("lv");
            if (freeCount > 0 && lv >= 25) {
                this._treasureHunt = true;
            }
        }

        return this._treasureHunt;
    },

    updateTreasureHuntMark: function (mark) {
        cc.log("gameMark updateTreasureHuntMark");

        this._treasureHunt = mark;
        MainScene.getInstance().updateMark();
    },

    getGoldCardsMark: function () {
        cc.log("gameMark getGoldCardsMark");

        if (!this._goldCards) {
            for (var i = 0; i < 2; i++) {
                var remainDays = gameData.player.getRemainDays(i);
                var isGot = gameData.player.isGotDaily(i);
                var status = gameData.player.goldCardsStatus(i);

                if (remainDays > 0 && !isGot && status) {
                    this._goldCards = true;
                    break;
                }
            }
        }

        return this._goldCards;
    },

    updateGoldCardsMark: function (mark) {
        cc.log("gameMark updateGoldCardsMark");

        this._goldCards = mark;
        this.updateActivityMark(mark);
        MainScene.getInstance().updateMark();
    },

    getBossMark: function () {
        cc.log("gameMark getBossMark");

        var limitLv = outputTables.function_limit.rows[1].boss;
        if (gameData.player.get("lv") < limitLv) {
            return false;
        }

        return this._boss;
    },

    updateBossMark: function (mark) {
        cc.log("gameMark updateBossMark");

        this._boss = mark;
        MainScene.getInstance().updateMark();
    },

    getTournamentMark: function () {
        cc.log("gameMark getTournamentMark");

        this._tournament = gameData.tournament.isCanGetReward();

        return this._tournament;
    },

    updateTournamentMark: function (mark) {
        cc.log("gameMark updateTournamentMark");

        this._tournament = mark;
        MainScene.getInstance().updateMark();
    },

    getBossListMark: function () {
        cc.log("gameMark getBossListMark");

        if (!this._bossList) {
            var boss = gameData.boss;
            this._bossList = boss.isCanGetRankReward() || (boss.get("kneelCount") > 0);
        }

        return this._bossList;
    },

    updateBossListMark: function (mark) {
        cc.log("gameMark updateBossListMark");

        this._bossList = mark;
        MainScene.getInstance().updateMark();
    },

    getNewAreaReward: function () {
        cc.log("gameMark getNewAreaReward");

        if (!this._newAreaReward) {
            for (var i = 1; i <= 30; i++) {
                if (gameData.activity.getStateById(TYPE_LOGIN_COUNT_REWARD, i) == NOT_GOT_REWARD) {
                    this._newAreaReward = true;
                    break;
                }
            }
        }

        return this._newAreaReward;
    },

    updateNewAreaReward: function (mark) {
        cc.log("gameMark updateNewAreaReward");

        this._newAreaReward = mark;
        this.updateActivityMark(mark);
        MainScene.getInstance().updateMark();
    },

    getGrowthPlan: function () {
        cc.log("gameMark getGrowthPlan");

        if (!this._growthPlan) {
            var activity = gameData.activity;
            if (gameData.player.get("vip") < 2 || !activity.get("isBuyPlan")) {
                return false;
            }

            var table = outputTables.growth_plan.rows;
            for (var id in table) {
                if (activity.getStateById(TYPE_GROWTH_PLAN_REWARD, id) == NOT_GOT_REWARD) {
                    this._growthPlan = true;
                    break;
                }
            }
        }

        return this._growthPlan;
    },

    updateGrowPlan: function (mark) {
        cc.log("gameMark updateGrowthPlan");

        this._growthPlan = mark;
        this.updateActivityMark(mark);
        MainScene.getInstance().updateMark();
    }
};

