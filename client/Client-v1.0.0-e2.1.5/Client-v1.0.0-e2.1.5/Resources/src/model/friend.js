/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-26
 * Time: 下午5:56
 * To change this template use File | Settings | File Templates.
 */


/*
 * friend
 * */


var Friend = Entity.extend({
    _giveBlessCount: 0,
    _giveBlessList: [],
    _receiveBlessCount: 0,
    _receiveBlessList: [],
    _friendCount: 0,
    _maxFriendCount: 0,
    _friendList: [],

    init: function (data) {
        cc.log("Friend init");

        this._friendList = data.friendList;
        this._giveBlessCount = data.giveBlessCount;
        this._giveBlessList = data.giveBlessList;
        this._receiveBlessCount = data.receiveBlessCount;
        this._receiveBlessList = data.receiveBlessList;
        this._friendCount = this._friendList.length;
        this._maxFriendCount = 50;

        cc.log(this);

        return true;
    },

    push: function (friend) {
        cc.log("friend push");

        this._friendList.push(friend);
        this._friendCount = this._friendList.length;
    },

    addFriend: function (name) {
        cc.log("Friend addFriend: " + name);

        var that = this;
        lzWindow.pomelo.request("area.messageHandler.addFriend", {
            friendName: name
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("addFriend success");
            } else {
                cc.log("addFriend fail");
            }
        });
    },

    deleteFriend: function (cb, friendId) {
        cc.log("Friend deleteFriend");

        var that = this;
        lzWindow.pomelo.request("area.messageHandler.deleteFriend", {
            friendId: friendId
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("deleteFriend success");
            } else {
                cc.log("deleteFriend fail");
            }
        });
    },

    giveBless: function (cb, friendId) {
        cc.log("Friend giveBless: " + friendId);

        var that = this;
        lzWindow.pomelo.request("area.messageHandler.giveBless", {
            friendId: friendId
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("giveBless success");

                that._giveBlessCount -= 1;

                cb("success");
            } else {
                cc.log("giveBless fail");
            }
        });
    },

    receiveBless: function (cb, friendId) {
        cc.log("Friend receiveBless: " + friendId);

        var that = this;
        lzWindow.pomelo.request("area.messageHandler.receiveBless", {
            friendId: friendId
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("receiveBless success");

                that._receiveBlessCount -= 1;
                gameData.player.add("energy", 5);

                cb("success");
            } else {
                cc.log("receiveBless fail");
            }
        });
    },

    sendMessage: function (cb, playerId, msg) {
        cc.log("Friend sendMessage: " + palyerId + " " + msg);

        var that = this;
        lzWindow.pomelo.request("area.messageHandler.leaveMessage", {
            friendId: friendId,
            content: msg
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("sendMessage success");

                cb("success");
            } else {
                cc.log("sendMessage fail");

                cb("fail");
            }
        });
    }
});


Friend.create = function () {
    var ret = new Friend();

    if (ret) {
        return ret;
    }

    return null;
};