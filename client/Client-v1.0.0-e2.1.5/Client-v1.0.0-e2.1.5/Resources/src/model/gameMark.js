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

    getActivityMark: function () {
        cc.log("gameMark getActivityMark");

        var mark = this._activity;
        if (mark == false) {
            if (this.getSignInMark() == true) {
                mark = true;
            } else if (this.getPowerRewardMark() == true) {
                mark = true;
            } else if (this.getGoldRewardMark() == true) {
                mark = true;
            } else if (this.getRechargeMark() == true) {
                mark = true;
            }
        }
        this._activity = mark;
        return mark;
    },

    updateActivityMark: function (mark) {
        cc.log("gameMark updateActivityMark");
        this._activity = mark;
        MainScene.getInstance().updateMark();
    },

    getCardLibraryMark: function () {
        cc.log("gameMark getCardLibraryMark");

        var mark = this._cardLibrary;
        if (mark == false) {
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
        if (mark == false) {
            var achievement = gameData.achievement.get("achievement");
            for (var key in achievement) {
                var isReceiver = achievement[key].isReceiver;
                var isAchieve = achievement[key].isAchieve;
                if (!isReceiver) {
                    if (isAchieve) {
                        mark = true;
                        break;
                    }
                }
            }
        }
        this._achievement = mark
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
        if (mark == false) {
            var friend = gameData.friend;
            var giveCount = friend.get("giveCount");
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

        if (mark == false) {
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
        if (mark == false) {
            var signIn = gameData.signIn;
            if (signIn.canSignIn(0) == true) {
                mark = true;
            } else if (signIn.canRemedySignIn(0) == true) {
                mark = true;
            } else {
                for (var i = 0; i < 5; ++i) {
                    if (signIn.canReceive(this.index, i) == true) {
                        mark = true;
                        break;
                    }

                }
            }
        }
        this._signIn = false;
        return mark;
    },

    updateSignInMark: function (mark) {
        cc.log("gameMark updateSignInMark");
        this._signIn = mark;
    },

    getPowerRewardMark: function () {
        cc.log("gameMark getPowerRewardMark");
        return this._powerReward;
    },

    updatePowerRewardMark: function (mark) {
        cc.log("gameMark updatePowerRewardMark");
        this._powerReward = mark;
        MainScene.getInstance().updateMark();
    },

    getGoldRewardMark: function () {
        cc.log("gameMark getGoldRewardMark");

        var mark = this._goldReward;
        if (mark == false) {
            var goldRewards = outputTables.player_upgrade_reward.rows;
            var lv = gameData.player.get("lv");
            var keys = Object.keys(goldRewards);
            var len = keys.length;
            for (var i = 0; i < len; ++i) {
                var key = keys[i];
                if (gameData.activity.getTypeById(goldRewards[key].id) == GOLD_NO_RECEIVE) {
                    if(lv >= goldRewards[key].lv) {
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
        MainScene.getInstance().updateMark();
    },

    getRechargeMark: function () {
        cc.log("gameMark getRechargeMark");
        return this._recharge;
    },

    updateRechargeMark: function (mark) {
        cc.log("gameMark updateRechargeMark");
        this._recharge = mark;
        MainScene.getInstance().updateMark();
    },

    getFriendMessageMark: function () {
        cc.log("gameMark getFriendMessageMark");

        var mark = this._friendMessage;
        if (mark == false) {
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
        MainScene.getInstance().updateMark();
    },

    getSystemMessageMark: function () {
        cc.log("gameMark getFriendMessageMark");

        var mark = this._systemMessage;
        if (mark == false) {
            var systemMessageList = gameData.message.get("systemMessage");
            var len = systemMessageList.length;
            for (var i = 0; i < len; ++i) {
                if (systemMessageList[i].status == UNHANDLED_STATUS) {
                    mark = true;
                }
            }
        }
        this._systemMessage = mark;
        return mark;
    },

    updateSystemMessageMark: function (mark) {
        cc.log("gameMark updateSystemMessageMark");
        this._systemMessage = mark;
        MainScene.getInstance().updateMark();
    }

};

