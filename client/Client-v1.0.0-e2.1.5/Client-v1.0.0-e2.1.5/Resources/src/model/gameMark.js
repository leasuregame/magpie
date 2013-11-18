/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-11-18
 * Time: 下午3:07
 * To change this template use File | Settings | File Templates.
 */


var gameMark = {

    _achievement: false,
    _cardLibrary: false,
    _friend: false,
    _message: false,
    _powerReward: false,
    _goldReward: false,
    _recharge: false,

    getActivityMark: function () {
        cc.log("gameMark getActivityMark");

        var mark = false;
        if (this.getSignInMark() == true) {
            mark = true;
        } else if (this.getPowerRewardMark() == true) {
            mark = true;
        } else if (this.getGoldRewardMark() == true) {
            mark = true;
        } else if (this.getRechargeMark() == true) {
            mark = true;
        }
        return mark;
    },

    getCardLibraryMark: function () {
        cc.log("gameMark getCardLibraryMark");

        var mark = this._cardLibrary;
        if (mark == false) {
            var cardLibrary = gameData.cardLibrary;
            for (var key in this.cardItem) {
                var type = cardLibrary.getTypeById(key);
                if (type == CARD_RECEIVE) {
                    mark = true;
                    break;
                }
            }
        }
        return mark;
    },

    setCardLibraryMark: function (mark) {
        cc.log("gameMark setCardLibraryMark");
        this._cardLibrary = mark;
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
        return mark;
    },

    setAchievementMark: function (mark) {
        cc.log("gameMark setAchievementMark");
        this._achievement = mark;
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
        return mark;
    },

    setFriendMark: function (mark) {
        cc.log("gameMark setFriendMark");
        this._friend = maek;
    },

    getMessageMark: function () {
        cc.log("gameMark getMessageMark");

        var mark = this._message;
        if (this._message == false) {
            if (this.getFriendMessageMark() == true) {
                mark = true;
            }
            else if (this.getSystemMessageMark() == true) {
                mark = true;
            }
        }
        return mark;
    },

    setMessageMark: function () {
        cc.log("gameMark setMessageMark");
        this._message = true;
    },

    getSignInMark: function () {
        cc.log("gameMark getMessageMark");

        var mark = false;
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
        return mark;
    },

    getPowerRewardMark: function () {
        cc.log("gameMark getPowerRewardMark");
        return this._powerReward;
    },

    setPowerRewardMark: function (mark) {
        cc.log("gameMark setPowerRewardMark");
        this._powerReward = mark;
    },

    getGoldRewardMark: function () {
        cc.log("gameMark getGoldRewardMark");

        var mark = false;
        var goldRewards = outputTables.playerupgradereward.rows;
        var keys = Object.keys(goldRewards);
        var len = keys.length;
        for (var i = 0; i < len; ++i) {
            if (gameData.activity.getTypeById(goldRewards[key].id) != GOLD_RECEIVE) {
                mark = true;
                break;
            }
        }
        return mark;
    },

    getRechargeMark: function () {
        cc.log("gameMark getRechargeMark");
        return this._recharge;
    },

    setRechargeMark: function (mark) {
        cc.log("gameMark setRechargeMark");
        this._recharge = mark;
    },

    getFriendMessageMark: function () {
        cc.log("gameMark getFriendMessageMark");

        var mark = false;
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
        return mark;
    },

    getSystemMessageMark: function () {
        cc.log("gameMark getFriendMessageMark");

        var mark = false;
        var systemMessageList = gameData.message.get("systemMessage");
        var len = systemMessageList.length;
        for (var i = 0; i < len; ++i) {
            if (systemMessageList[i].status == UNHANDLED_STATUS) {
                mark = true;
            }
        }
        return mark;
    }

};

